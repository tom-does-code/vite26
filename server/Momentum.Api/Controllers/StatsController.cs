using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Dtos;

namespace Momentum.Api.Controllers;

[Authorize]
public class StatsController : ApiControllerBase
{
    private readonly AppDbContext db;

    public StatsController(AppDbContext db)
    {
        this.db = db;
    }

    [HttpGet]
    public async Task<ActionResult<StatsResponse>> Get()
    {
        var user = await db.Users.FindAsync(CurrentUserId);

        if (user == null)
        {
            return Unauthorized();
        }

        var tasks = await db.Tasks
            .Where(t => t.UserId == CurrentUserId)
            .ToListAsync();

        var completed = tasks.Count(t => t.IsCompleted);
        var today = DateTime.UtcNow.Date;

        var stats = new StatsResponse
        {
            TotalTasks = tasks.Count,
            CompletedTasks = completed,
            ActiveTasks = tasks.Count - completed,
            OverdueTasks = tasks.Count(t => !t.IsCompleted && t.DueDate != null && t.DueDate.Value.Date < today),
            CompletionRate = tasks.Count == 0 ? 0 : (int)Math.Round(completed * 100.0 / tasks.Count),
            CurrentStreak = CalculateStreak(tasks.Where(t => t.CompletedAt != null).Select(t => t.CompletedAt!.Value.Date).ToList()),
            MemberSince = user.CreatedAt,
            ByPriority = new Dictionary<string, int>
            {
                ["high"] = tasks.Count(t => t.Priority == "high"),
                ["medium"] = tasks.Count(t => t.Priority == "medium"),
                ["low"] = tasks.Count(t => t.Priority == "low")
            },
            ByCategory = tasks
                .GroupBy(t => t.Category)
                .OrderByDescending(g => g.Count())
                .Take(6)
                .ToDictionary(g => g.Key, g => g.Count())
        };

        for (var offset = 13; offset >= 0; offset--)
        {
            var day = today.AddDays(-offset);

            stats.LastFourteenDays.Add(new DailyCount
            {
                Date = day.ToString("yyyy-MM-dd"),
                Created = tasks.Count(t => t.CreatedAt.Date == day),
                Completed = tasks.Count(t => t.CompletedAt != null && t.CompletedAt.Value.Date == day)
            });
        }

        return Ok(stats);
    }

    private static int CalculateStreak(List<DateTime> completionDays)
    {
        if (completionDays.Count == 0)
        {
            return 0;
        }

        var days = completionDays.Distinct().ToHashSet();
        var cursor = DateTime.UtcNow.Date;

        if (!days.Contains(cursor))
        {
            cursor = cursor.AddDays(-1);
        }

        var streak = 0;

        while (days.Contains(cursor))
        {
            streak++;
            cursor = cursor.AddDays(-1);
        }

        return streak;
    }
}
