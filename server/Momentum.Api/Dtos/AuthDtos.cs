using System.ComponentModel.DataAnnotations;

namespace Momentum.Api.Dtos;

public class RegisterRequest
{
    [Required]
    [MinLength(3)]
    [MaxLength(32)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;
}

public class LoginRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }
}

public class CurrentUserResponse
{
    public int Id { get; set; }

    public string Username { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}
