using Microsoft.AspNetCore.Mvc;
using Momentum.Api.Controllers;
using Momentum.Api.Dtos;
using Momentum.Api.Models;

namespace Momentum.Api.Tests;

public class TasksControllerTests
{
    private static TasksController BuildController(TestContext context, User user)
    {
        var controller = new TasksController(context.Db);
        TestContext.SignIn(controller, user);

        return controller;
    }

    private static List<TaskResponse> ReadTasks(ActionResult<List<TaskResponse>> result)
    {
        var ok = Assert.IsType<OkObjectResult>(result.Result);

        return Assert.IsType<List<TaskResponse>>(ok.Value);
    }

    [Fact]
    public async Task GetAll_OnlyReturnsTasksOwnedByTheCurrentUser()
    {
        using var context = new TestContext();
        var owner = context.AddUser("owner");
        var stranger = context.AddUser("stranger");

        context.AddTask(owner, "Mine");
        context.AddTask(stranger, "Theirs");

        var controller = BuildController(context, owner);
        var tasks = ReadTasks(await controller.GetAll(new TaskQuery()));

        Assert.Single(tasks);
        Assert.Equal("Mine", tasks[0].Title);
    }

    [Fact]
    public async Task GetAll_SearchMatchesTitleAndDescription()
    {
        using var context = new TestContext();
        var user = context.AddUser();

        context.AddTask(user, "Book flights");
        context.AddTask(user, "Tidy the garage", description: "Sort out the old flight cases");
        context.AddTask(user, "Call the bank");

        var controller = BuildController(context, user);
        var tasks = ReadTasks(await controller.GetAll(new TaskQuery { Search = "flight" }));

        Assert.Equal(2, tasks.Count);
        Assert.DoesNotContain(tasks, t => t.Title == "Call the bank");
    }

    [Fact]
    public async Task GetAll_FiltersByStatusAndPriority()
    {
        using var context = new TestContext();
        var user = context.AddUser();

        context.AddTask(user, "Done and high", priority: "high", completed: true);
        context.AddTask(user, "Active and high", priority: "high");
        context.AddTask(user, "Active and low", priority: "low");

        var controller = BuildController(context, user);

        var active = ReadTasks(await controller.GetAll(new TaskQuery { Status = "active" }));
        Assert.Equal(2, active.Count);

        var high = ReadTasks(await controller.GetAll(new TaskQuery { Status = "active", Priority = "high" }));
        Assert.Single(high);
        Assert.Equal("Active and high", high[0].Title);
    }

    [Fact]
    public async Task GetAll_SortsByPriorityHighestFirst()
    {
        using var context = new TestContext();
        var user = context.AddUser();

        context.AddTask(user, "Low one", priority: "low");
        context.AddTask(user, "High one", priority: "high");
        context.AddTask(user, "Medium one", priority: "medium");

        var controller = BuildController(context, user);
        var tasks = ReadTasks(await controller.GetAll(new TaskQuery { SortBy = "priority" }));

        Assert.Equal(new[] { "high", "medium", "low" }, tasks.Select(t => t.Priority));
    }

    [Fact]
    public async Task Create_RejectsAPriorityThatIsNotAllowed()
    {
        using var context = new TestContext();
        var user = context.AddUser();
        var controller = BuildController(context, user);

        var result = await controller.Create(new TaskRequest
        {
            Title = "Something urgent",
            Priority = "critical"
        });

        Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Empty(context.Db.Tasks);
    }

    [Fact]
    public async Task Create_FallsBackToTheGeneralCategory()
    {
        using var context = new TestContext();
        var user = context.AddUser();
        var controller = BuildController(context, user);

        var result = await controller.Create(new TaskRequest
        {
            Title = "No category given",
            Priority = "low",
            Category = "   "
        });

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var task = Assert.IsType<TaskResponse>(created.Value);

        Assert.Equal("General", task.Category);
    }

    [Fact]
    public async Task Toggle_SetsAndClearsTheCompletionTimestamp()
    {
        using var context = new TestContext();
        var user = context.AddUser();
        var task = context.AddTask(user, "Write the tests");
        var controller = BuildController(context, user);

        var completed = Assert.IsType<OkObjectResult>((await controller.Toggle(task.Id)).Result);
        var afterFirst = Assert.IsType<TaskResponse>(completed.Value);

        Assert.True(afterFirst.IsCompleted);
        Assert.NotNull(afterFirst.CompletedAt);

        var reopened = Assert.IsType<OkObjectResult>((await controller.Toggle(task.Id)).Result);
        var afterSecond = Assert.IsType<TaskResponse>(reopened.Value);

        Assert.False(afterSecond.IsCompleted);
        Assert.Null(afterSecond.CompletedAt);
    }

    [Fact]
    public async Task Delete_WillNotTouchATaskBelongingToSomeoneElse()
    {
        using var context = new TestContext();
        var owner = context.AddUser("owner");
        var stranger = context.AddUser("stranger");
        var task = context.AddTask(owner, "Private notes");

        var controller = BuildController(context, stranger);
        var result = await controller.Delete(task.Id);

        Assert.IsType<NotFoundObjectResult>(result);
        Assert.Single(context.Db.Tasks);
    }

    [Fact]
    public async Task ClearCompleted_RemovesOnlyFinishedTasks()
    {
        using var context = new TestContext();
        var user = context.AddUser();

        context.AddTask(user, "Done one", completed: true);
        context.AddTask(user, "Done two", completed: true);
        context.AddTask(user, "Still going");

        var controller = BuildController(context, user);
        await controller.ClearCompleted();

        var remaining = context.Db.Tasks.ToList();

        Assert.Single(remaining);
        Assert.Equal("Still going", remaining[0].Title);
    }
}
