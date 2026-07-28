using System.ComponentModel.DataAnnotations;

namespace Momentum.Api.Dtos;

public class ProfileRequest
{
    [MaxLength(40)]
    public string FirstName { get; set; } = string.Empty;

    [MaxLength(40)]
    public string LastName { get; set; } = string.Empty;

    [EmailAddress]
    public string ContactEmail { get; set; } = string.Empty;

    [MaxLength(400)]
    public string Bio { get; set; } = string.Empty;
}

public class ProfileResponse
{
    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string ContactEmail { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public DateTime MemberSince { get; set; }
}

public class PreferencesRequest
{
    [Required]
    public string Theme { get; set; } = "dark";

    [Required]
    public string AccentColour { get; set; } = "violet";

    [Required]
    public string DefaultPriority { get; set; } = "medium";

    public bool ConfirmBeforeDelete { get; set; }
}

public class PreferencesResponse
{
    public string Theme { get; set; } = string.Empty;

    public string AccentColour { get; set; } = string.Empty;

    public string DefaultPriority { get; set; } = string.Empty;

    public bool ConfirmBeforeDelete { get; set; }
}

public class ChangePasswordRequest
{
    [Required]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string NewPassword { get; set; } = string.Empty;
}

public class ChangeEmailRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}
