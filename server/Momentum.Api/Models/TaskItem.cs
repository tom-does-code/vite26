using System.ComponentModel.DataAnnotations;

namespace Momentum.Api.Models;

public class TaskItem
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }

    [MaxLength(80)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(10)]
    public string Priority { get; set; } = "medium";

    [MaxLength(30)]
    public string Category { get; set; } = "General";

    public bool IsCompleted { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? DueDate { get; set; }

    public DateTime? CompletedAt { get; set; }
}
