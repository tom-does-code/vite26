using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Dtos;
using Momentum.Api.Models;

namespace Momentum.Api.Controllers;

[Authorize]
public class BudgetController : ApiControllerBase
{
    private readonly AppDbContext db;

    public BudgetController(AppDbContext db)
    {
        this.db = db;
    }

    [HttpGet]
    public async Task<ActionResult<BudgetSummaryResponse>> GetSummary([FromQuery] int? month, [FromQuery] int? year)
    {
        var now = DateTime.UtcNow;
        var targetMonth = month ?? now.Month;
        var targetYear = year ?? now.Year;

        var entries = await db.BudgetEntries
            .Where(b => b.UserId == CurrentUserId
                && b.OccurredOn.Month == targetMonth
                && b.OccurredOn.Year == targetYear)
            .OrderByDescending(b => b.OccurredOn)
            .ThenByDescending(b => b.Id)
            .ToListAsync();

        var income = entries.Where(e => e.Type == "income").Sum(e => e.Amount);
        var expenses = entries.Where(e => e.Type == "expense").Sum(e => e.Amount);

        var breakdown = entries
            .Where(e => e.Type == "expense")
            .GroupBy(e => e.Category)
            .Select(g => new CategoryTotal
            {
                Category = g.Key,
                Total = g.Sum(e => e.Amount),
                Share = expenses == 0 ? 0 : (int)Math.Round(g.Sum(e => e.Amount) * 100 / expenses)
            })
            .OrderByDescending(c => c.Total)
            .ToList();

        return Ok(new BudgetSummaryResponse
        {
            Income = income,
            Expenses = expenses,
            Balance = income - expenses,
            LargestExpense = entries.Where(e => e.Type == "expense").Select(e => e.Amount).DefaultIfEmpty(0).Max(),
            EntryCount = entries.Count,
            Breakdown = breakdown,
            Entries = entries.Select(ToResponse).ToList()
        });
    }

    [HttpPost]
    public async Task<ActionResult<BudgetEntryResponse>> Create(BudgetEntryRequest request)
    {
        if (request.Type != "income" && request.Type != "expense")
        {
            return BadRequest(new { message = "Type must be income or expense." });
        }

        var entry = new BudgetEntry
        {
            UserId = CurrentUserId,
            Label = request.Label.Trim(),
            Category = request.Category.Trim(),
            Type = request.Type,
            Amount = Math.Round(request.Amount, 2),
            OccurredOn = request.OccurredOn ?? DateTime.UtcNow
        };

        db.BudgetEntries.Add(entry);
        await db.SaveChangesAsync();

        return Ok(ToResponse(entry));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entry = await db.BudgetEntries.FirstOrDefaultAsync(b => b.Id == id && b.UserId == CurrentUserId);

        if (entry == null)
        {
            return NotFound(new { message = "Entry not found." });
        }

        db.BudgetEntries.Remove(entry);
        await db.SaveChangesAsync();

        return NoContent();
    }

    private static BudgetEntryResponse ToResponse(BudgetEntry entry)
    {
        return new BudgetEntryResponse
        {
            Id = entry.Id,
            Label = entry.Label,
            Category = entry.Category,
            Type = entry.Type,
            Amount = entry.Amount,
            OccurredOn = entry.OccurredOn
        };
    }
}
