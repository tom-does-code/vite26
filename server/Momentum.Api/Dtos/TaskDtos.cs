using System.ComponentModel.DataAnnotations;

namespace Momentum.Api.Dtos;

public class TaskRequest
{
    [Required]
    [MinLength(3)]
    [MaxLength(80)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public string Priority { get; set; } = string.Empty;

    [MaxLength(30)]
    public string Category { get; set; } = "General";

    public DateTime? DueDate { get; set; }
}

public class TaskResponse
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Priority { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public bool IsCompleted { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? DueDate { get; set; }

    public DateTime? CompletedAt { get; set; }
}

public class TaskQuery
{
    public string? Search { get; set; }

    public string? Priority { get; set; }

    public string? Category { get; set; }

    public string? Status { get; set; }

    public string? SortBy { get; set; }
}
