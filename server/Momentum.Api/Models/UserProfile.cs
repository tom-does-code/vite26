using System.ComponentModel.DataAnnotations;

namespace Momentum.Api.Models;

public class UserProfile
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }

    [MaxLength(40)]
    public string FirstName { get; set; } = string.Empty;

    [MaxLength(40)]
    public string LastName { get; set; } = string.Empty;

    [MaxLength(120)]
    public string ContactEmail { get; set; } = string.Empty;

    [MaxLength(400)]
    public string Bio { get; set; } = string.Empty;

    [MaxLength(20)]
    public string AccentColour { get; set; } = "violet";

    [MaxLength(10)]
    public string Theme { get; set; } = "dark";

    [MaxLength(10)]
    public string DefaultPriority { get; set; } = "medium";

    public bool ConfirmBeforeDelete { get; set; } = true;
}
