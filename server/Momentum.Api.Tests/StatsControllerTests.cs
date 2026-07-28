using Microsoft.AspNetCore.Mvc;
using Momentum.Api.Controllers;
using Momentum.Api.Dtos;

namespace Momentum.Api.Tests;

public class StatsControllerTests
{
    private static StatsResponse ReadStats(ActionResult<StatsResponse> result)
    {
        var ok = Assert.IsType<OkObjectResult>(result.Result);

        return Assert.IsType<StatsResponse>(ok.Value);
    }

    [Fact]
    public async Task Get_CountsOverdueTasksButIgnoresFinishedOnes()
    {
        using var context = new TestContext();
        var user = context.AddUser();
        var yesterday = DateTime.UtcNow.Date.AddDays(-1);

        context.AddTask(user, "Late and open", dueDate: yesterday);
        context.AddTask(user, "Late but finished", completed: true, dueDate: yesterday);
        context.AddTask(user, "Due next week", dueDate: DateTime.UtcNow.Date.AddDays(7));

        var controller = new StatsController(context.Db);
        TestContext.SignIn(controller, user);

        var stats = ReadStats(await controller.Get());

        Assert.Equal(1, stats.OverdueTasks);
        Assert.Equal(3, stats.TotalTasks);
        Assert.Equal(2, stats.ActiveTasks);
    }

    [Fact]
    public async Task Get_RoundsTheCompletionRate()
    {
        using var context = new TestContext();
        var user = context.AddUser();

        context.AddTask(user, "One", completed: true);
        context.AddTask(user, "Two");
        context.AddTask(user, "Three");

        var controller = new StatsController(context.Db);
        TestContext.SignIn(controller, user);

        var stats = ReadStats(await controller.Get());

        Assert.Equal(33, stats.CompletionRate);
    }

    [Fact]
    public async Task Get_ReturnsZeroCompletionRateForAnEmptyAccount()
    {
        using var context = new TestContext();
        var user = context.AddUser();

        var controller = new StatsController(context.Db);
        TestContext.SignIn(controller, user);

        var stats = ReadStats(await controller.Get());

        Assert.Equal(0, stats.CompletionRate);
        Assert.Equal(0, stats.CurrentStreak);
        Assert.Equal(14, stats.LastFourteenDays.Count);
    }

    [Fact]
    public async Task Get_CountsAStreakOfConsecutiveDays()
    {
        using var context = new TestContext();
        var user = context.AddUser();
        var today = DateTime.UtcNow.Date;

        foreach (var offset in new[] { 0, 1, 2 })
        {
            var task = context.AddTask(user, $"Finished {offset} days ago", completed: true);
            task.CompletedAt = today.AddDays(-offset).AddHours(9);
        }

        context.Db.SaveChanges();

        var controller = new StatsController(context.Db);
        TestContext.SignIn(controller, user);

        var stats = ReadStats(await controller.Get());

        Assert.Equal(3, stats.CurrentStreak);
    }

    [Fact]
    public async Task Get_BreaksTheStreakWhenADayIsMissed()
    {
        using var context = new TestContext();
        var user = context.AddUser();
        var today = DateTime.UtcNow.Date;

        var recent = context.AddTask(user, "Finished today", completed: true);
        recent.CompletedAt = today.AddHours(10);

        var older = context.AddTask(user, "Finished three days ago", completed: true);
        older.CompletedAt = today.AddDays(-3).AddHours(10);

        context.Db.SaveChanges();

        var controller = new StatsController(context.Db);
        TestContext.SignIn(controller, user);

        var stats = ReadStats(await controller.Get());

        Assert.Equal(1, stats.CurrentStreak);
    }
}
