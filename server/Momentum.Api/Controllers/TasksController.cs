using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Dtos;
using Momentum.Api.Models;

namespace Momentum.Api.Controllers;

[Authorize]
public class TasksController : ApiControllerBase
{
    private static readonly string[] AllowedPriorities = { "low", "medium", "high" };

    private readonly AppDbContext db;

    public TasksController(AppDbContext db)
    {
        this.db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<TaskResponse>>> GetAll([FromQuery] TaskQuery query)
    {
        var tasks = db.Tasks.Where(t => t.UserId == CurrentUserId);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLower();
            tasks = tasks.Where(t => t.Title.ToLower().Contains(search) || t.Description.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(query.Priority) && query.Priority != "all")
        {
            tasks = tasks.Where(t => t.Priority == query.Priority);
        }

        if (!string.IsNullOrWhiteSpace(query.Category) && query.Category != "all")
        {
            tasks = tasks.Where(t => t.Category == query.Category);
        }

        if (query.Status == "active")
        {
            tasks = tasks.Where(t => !t.IsCompleted);
        }
        else if (query.Status == "completed")
        {
            tasks = tasks.Where(t => t.IsCompleted);
        }

        tasks = query.SortBy switch
        {
            "oldest" => tasks.OrderBy(t => t.CreatedAt),
            "title" => tasks.OrderBy(t => t.Title),
            "due" => tasks.OrderBy(t => t.DueDate == null).ThenBy(t => t.DueDate),
            "priority" => tasks.OrderBy(t => t.Priority == "high" ? 0 : t.Priority == "medium" ? 1 : 2),
            _ => tasks.OrderByDescending(t => t.CreatedAt)
        };

        var results = await tasks.ToListAsync();

        return Ok(results.Select(ToResponse).ToList());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskResponse>> GetOne(int id)
    {
        var task = await db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);

        if (task == null)
        {
            return NotFound(new { message = "Task not found." });
        }

        return Ok(ToResponse(task));
    }

    [HttpGet("categories")]
    public async Task<ActionResult<List<string>>> GetCategories()
    {
        var categories = await db.Tasks
            .Where(t => t.UserId == CurrentUserId)
            .Select(t => t.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return Ok(categories);
    }

    [HttpPost]
    public async Task<ActionResult<TaskResponse>> Create(TaskRequest request)
    {
        if (!AllowedPriorities.Contains(request.Priority))
        {
            return BadRequest(new { message = "Priority must be low, medium or high." });
        }

        var task = new TaskItem
        {
            UserId = CurrentUserId,
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Priority = request.Priority,
            Category = string.IsNullOrWhiteSpace(request.Category) ? "General" : request.Category.Trim(),
            DueDate = request.DueDate
        };

        db.Tasks.Add(task);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOne), new { id = task.Id }, ToResponse(task));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TaskResponse>> Update(int id, TaskRequest request)
    {
        if (!AllowedPriorities.Contains(request.Priority))
        {
            return BadRequest(new { message = "Priority must be low, medium or high." });
        }

        var task = await db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);

        if (task == null)
        {
            return NotFound(new { message = "Task not found." });
        }

        task.Title = request.Title.Trim();
        task.Description = request.Description.Trim();
        task.Priority = request.Priority;
        task.Category = string.IsNullOrWhiteSpace(request.Category) ? "General" : request.Category.Trim();
        task.DueDate = request.DueDate;

        await db.SaveChangesAsync();

        return Ok(ToResponse(task));
    }

    [HttpPatch("{id:int}/toggle")]
    public async Task<ActionResult<TaskResponse>> Toggle(int id)
    {
        var task = await db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);

        if (task == null)
        {
            return NotFound(new { message = "Task not found." });
        }

        task.IsCompleted = !task.IsCompleted;
        task.CompletedAt = task.IsCompleted ? DateTime.UtcNow : null;

        await db.SaveChangesAsync();

        return Ok(ToResponse(task));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var task = await db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);

        if (task == null)
        {
            return NotFound(new { message = "Task not found." });
        }

        db.Tasks.Remove(task);
        await db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("completed")]
    public async Task<ActionResult<object>> ClearCompleted()
    {
        var completed = await db.Tasks
            .Where(t => t.UserId == CurrentUserId && t.IsCompleted)
            .ToListAsync();

        db.Tasks.RemoveRange(completed);
        await db.SaveChangesAsync();

        return Ok(new { removed = completed.Count });
    }

    private static TaskResponse ToResponse(TaskItem task)
    {
        return new TaskResponse
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Priority = task.Priority,
            Category = task.Category,
            IsCompleted = task.IsCompleted,
            CreatedAt = task.CreatedAt,
            DueDate = task.DueDate,
            CompletedAt = task.CompletedAt
        };
    }
}
