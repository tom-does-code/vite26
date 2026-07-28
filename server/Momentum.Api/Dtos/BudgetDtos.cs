using System.ComponentModel.DataAnnotations;

namespace Momentum.Api.Dtos;

public class BudgetEntryRequest
{
    [Required]
    [MinLength(2)]
    [MaxLength(60)]
    public string Label { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string Category { get; set; } = string.Empty;

    [Required]
    public string Type { get; set; } = string.Empty;

    [Range(0.01, 1000000)]
    public decimal Amount { get; set; }

    public DateTime? OccurredOn { get; set; }
}

public class BudgetEntryResponse
{
    public int Id { get; set; }

    public string Label { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Type { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public DateTime OccurredOn { get; set; }
}

public class BudgetSummaryResponse
{
    public decimal Income { get; set; }

    public decimal Expenses { get; set; }

    public decimal Balance { get; set; }

    public decimal LargestExpense { get; set; }

    public int EntryCount { get; set; }

    public List<CategoryTotal> Breakdown { get; set; } = new();

    public List<BudgetEntryResponse> Entries { get; set; } = new();
}

public class CategoryTotal
{
    public string Category { get; set; } = string.Empty;

    public decimal Total { get; set; }

    public int Share { get; set; }
}
