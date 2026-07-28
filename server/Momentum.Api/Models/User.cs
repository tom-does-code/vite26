using System.ComponentModel.DataAnnotations;

namespace Momentum.Api.Models;

public class User
{
    public int Id { get; set; }

    [MaxLength(32)]
    public string Username { get; set; } = string.Empty;

    [MaxLength(120)]
    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public UserProfile? Profile { get; set; }

    public List<TaskItem> Tasks { get; set; } = new();

    public List<BudgetEntry> BudgetEntries { get; set; } = new();
}
