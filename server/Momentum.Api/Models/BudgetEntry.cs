using System.ComponentModel.DataAnnotations;

namespace Momentum.Api.Models;

public class BudgetEntry
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }

    [MaxLength(60)]
    public string Label { get; set; } = string.Empty;

    [MaxLength(30)]
    public string Category { get; set; } = "Other";

    [MaxLength(10)]
    public string Type { get; set; } = "expense";

    public decimal Amount { get; set; }

    public DateTime OccurredOn { get; set; } = DateTime.UtcNow;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
