using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Dtos;
using Momentum.Api.Models;

namespace Momentum.Api.Controllers;

[Authorize]
public class AccountController : ApiControllerBase
{
    private readonly AppDbContext db;
    private readonly PasswordHasher<User> hasher = new();

    public AccountController(AppDbContext db)
    {
        this.db = db;
    }

    [HttpPut("password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
    {
        var user = await db.Users.FindAsync(CurrentUserId);

        if (user == null)
        {
            return Unauthorized();
        }

        var check = hasher.VerifyHashedPassword(user, user.PasswordHash, request.CurrentPassword);

        if (check == PasswordVerificationResult.Failed)
        {
            return BadRequest(new { message = "Your current password is not correct." });
        }

        user.PasswordHash = hasher.HashPassword(user, request.NewPassword);
        await db.SaveChangesAsync();

        return Ok(new { message = "Password updated." });
    }

    [HttpPut("email")]
    public async Task<IActionResult> ChangeEmail(ChangeEmailRequest request)
    {
        var user = await db.Users.FindAsync(CurrentUserId);

        if (user == null)
        {
            return Unauthorized();
        }

        var email = request.Email.Trim().ToLowerInvariant();

        if (await db.Users.AnyAsync(u => u.Email == email && u.Id != user.Id))
        {
            return Conflict(new { message = "An account already uses that email." });
        }

        user.Email = email;
        await db.SaveChangesAsync();

        return Ok(new { message = "Email updated." });
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteAccount()
    {
        var user = await db.Users.FindAsync(CurrentUserId);

        if (user == null)
        {
            return Unauthorized();
        }

        db.Users.Remove(user);
        await db.SaveChangesAsync();

        return NoContent();
    }
}
