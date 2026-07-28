using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Dtos;
using Momentum.Api.Models;

namespace Momentum.Api.Controllers;

[Authorize]
public class ProfileController : ApiControllerBase
{
    private static readonly string[] AllowedAccents = { "violet", "teal", "amber", "rose" };

    private readonly AppDbContext db;

    public ProfileController(AppDbContext db)
    {
        this.db = db;
    }

    [HttpGet]
    public async Task<ActionResult<ProfileResponse>> Get()
    {
        var user = await db.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == CurrentUserId);

        if (user == null)
        {
            return Unauthorized();
        }

        var profile = await EnsureProfile(user);

        return Ok(new ProfileResponse
        {
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            ContactEmail = profile.ContactEmail,
            Bio = profile.Bio,
            Username = user.Username,
            MemberSince = user.CreatedAt
        });
    }

    [HttpPut]
    public async Task<ActionResult<ProfileResponse>> Update(ProfileRequest request)
    {
        var user = await db.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == CurrentUserId);

        if (user == null)
        {
            return Unauthorized();
        }

        var profile = await EnsureProfile(user);

        profile.FirstName = request.FirstName.Trim();
        profile.LastName = request.LastName.Trim();
        profile.ContactEmail = request.ContactEmail.Trim();
        profile.Bio = request.Bio.Trim();

        await db.SaveChangesAsync();

        return Ok(new ProfileResponse
        {
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            ContactEmail = profile.ContactEmail,
            Bio = profile.Bio,
            Username = user.Username,
            MemberSince = user.CreatedAt
        });
    }

    [HttpGet("preferences")]
    public async Task<ActionResult<PreferencesResponse>> GetPreferences()
    {
        var user = await db.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == CurrentUserId);

        if (user == null)
        {
            return Unauthorized();
        }

        var profile = await EnsureProfile(user);

        return Ok(ToPreferences(profile));
    }

    [HttpPut("preferences")]
    public async Task<ActionResult<PreferencesResponse>> UpdatePreferences(PreferencesRequest request)
    {
        if (!AllowedAccents.Contains(request.AccentColour))
        {
            return BadRequest(new { message = "Unknown accent colour." });
        }

        var user = await db.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == CurrentUserId);

        if (user == null)
        {
            return Unauthorized();
        }

        var profile = await EnsureProfile(user);

        profile.Theme = request.Theme == "light" ? "light" : "dark";
        profile.AccentColour = request.AccentColour;
        profile.DefaultPriority = request.DefaultPriority;
        profile.ConfirmBeforeDelete = request.ConfirmBeforeDelete;

        await db.SaveChangesAsync();

        return Ok(ToPreferences(profile));
    }

    private async Task<UserProfile> EnsureProfile(User user)
    {
        if (user.Profile != null)
        {
            return user.Profile;
        }

        var profile = new UserProfile
        {
            UserId = user.Id,
            ContactEmail = user.Email
        };

        db.Profiles.Add(profile);
        await db.SaveChangesAsync();

        user.Profile = profile;

        return profile;
    }

    private static PreferencesResponse ToPreferences(UserProfile profile)
    {
        return new PreferencesResponse
        {
            Theme = profile.Theme,
            AccentColour = profile.AccentColour,
            DefaultPriority = profile.DefaultPriority,
            ConfirmBeforeDelete = profile.ConfirmBeforeDelete
        };
    }
}
