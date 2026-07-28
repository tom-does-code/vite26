using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Momentum.Api.Data;
using Momentum.Api.Models;

namespace Momentum.Api.Tests;

public class TestContext : IDisposable
{
    private readonly SqliteConnection connection;

    public TestContext()
    {
        connection = new SqliteConnection("Filename=:memory:");
        connection.Open();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(connection)
            .Options;

        Db = new AppDbContext(options);
        Db.Database.EnsureCreated();
    }

    public AppDbContext Db { get; }

    public static IConfiguration Configuration => new ConfigurationBuilder()
        .AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["Jwt:Key"] = "a-test-signing-key-that-is-long-enough-to-be-valid",
            ["Jwt:Issuer"] = "MomentumApi",
            ["Jwt:Audience"] = "MomentumClient"
        })
        .Build();

    public User AddUser(string username = "tester")
    {
        var user = new User
        {
            Username = username,
            Email = $"{username}@example.com",
            PasswordHash = "not-checked-here",
            CreatedAt = DateTime.UtcNow.AddDays(-30)
        };

        Db.Users.Add(user);
        Db.SaveChanges();

        return user;
    }

    public TaskItem AddTask(
        User user,
        string title,
        string priority = "medium",
        string category = "General",
        bool completed = false,
        DateTime? dueDate = null,
        DateTime? createdAt = null,
        string description = "")
    {
        var task = new TaskItem
        {
            UserId = user.Id,
            Title = title,
            Description = description,
            Priority = priority,
            Category = category,
            IsCompleted = completed,
            DueDate = dueDate,
            CreatedAt = createdAt ?? DateTime.UtcNow,
            CompletedAt = completed ? DateTime.UtcNow : null
        };

        Db.Tasks.Add(task);
        Db.SaveChanges();

        return task;
    }

    public static void SignIn(ControllerBase controller, User user)
    {
        var identity = new ClaimsIdentity(new[] { new Claim("sub", user.Id.ToString()) }, "Test");

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(identity) }
        };
    }

    public void Dispose()
    {
        Db.Dispose();
        connection.Dispose();
        GC.SuppressFinalize(this);
    }
}
