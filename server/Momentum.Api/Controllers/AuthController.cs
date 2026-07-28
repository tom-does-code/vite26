using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Dtos;
using Momentum.Api.Models;
using Momentum.Api.Services;

namespace Momentum.Api.Controllers;

public class AuthController : ApiControllerBase
{
    private readonly AppDbContext db;
    private readonly TokenService tokenService;
    private readonly PasswordHasher<User> hasher = new();

    public AuthController(AppDbContext db, TokenService tokenService)
    {
        this.db = db;
        this.tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var username = request.Username.Trim();
        var email = request.Email.Trim().ToLowerInvariant();

        if (await db.Users.AnyAsync(u => u.Username.ToLower() == username.ToLower()))
        {
            return Conflict(new { message = "That username is already taken." });
        }

        if (await db.Users.AnyAsync(u => u.Email == email))
        {
            return Conflict(new { message = "An account already uses that email." });
        }

        var user = new User
        {
            Username = username,
            Email = email
        };
        user.PasswordHash = hasher.HashPassword(user, request.Password);

        user.Profile = new UserProfile
        {
            ContactEmail = email
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        var (token, expiresAt) = tokenService.CreateToken(user);

        return Ok(new AuthResponse
        {
            Token = token,
            Username = user.Username,
            ExpiresAt = expiresAt
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var username = request.Username.Trim();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower());

        if (user == null)
        {
            return Unauthorized(new { message = "Username or password is incorrect." });
        }

        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

        if (result == PasswordVerificationResult.Failed)
        {
            return Unauthorized(new { message = "Username or password is incorrect." });
        }

        if (result == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = hasher.HashPassword(user, request.Password);
            await db.SaveChangesAsync();
        }

        var (token, expiresAt) = tokenService.CreateToken(user);

        return Ok(new AuthResponse
        {
            Token = token,
            Username = user.Username,
            ExpiresAt = expiresAt
        });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<CurrentUserResponse>> Me()
    {
        var user = await db.Users.FindAsync(CurrentUserId);

        if (user == null)
        {
            return Unauthorized();
        }

        return Ok(new CurrentUserResponse
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            CreatedAt = user.CreatedAt
        });
    }
}
