using Microsoft.AspNetCore.Mvc;
using Momentum.Api.Controllers;
using Momentum.Api.Dtos;
using Momentum.Api.Models;

namespace Momentum.Api.Tests;

public class BudgetControllerTests
{
    private static BudgetController BuildController(TestContext context, User user)
    {
        var controller = new BudgetController(context.Db);
        TestContext.SignIn(controller, user);

        return controller;
    }

    private static BudgetSummaryResponse ReadSummary(ActionResult<BudgetSummaryResponse> result)
    {
        var ok = Assert.IsType<OkObjectResult>(result.Result);

        return Assert.IsType<BudgetSummaryResponse>(ok.Value);
    }

    private static async Task AddEntry(
        BudgetController controller,
        string label,
        string type,
        decimal amount,
        string category = "Other",
        DateTime? occurredOn = null)
    {
        await controller.Create(new BudgetEntryRequest
        {
            Label = label,
            Category = category,
            Type = type,
            Amount = amount,
            OccurredOn = occurredOn ?? DateTime.UtcNow
        });
    }

    [Fact]
    public async Task GetSummary_WorksOutTheBalanceFromIncomeAndExpenses()
    {
        using var context = new TestContext();
        var user = context.AddUser();
        var controller = BuildController(context, user);

        await AddEntry(controller, "Salary", "income", 2000m, "Salary");
        await AddEntry(controller, "Rent", "expense", 750m, "Rent");
        await AddEntry(controller, "Food", "expense", 250m, "Food");

        var summary = ReadSummary(await controller.GetSummary(null, null));

        Assert.Equal(2000m, summary.Income);
        Assert.Equal(1000m, summary.Expenses);
        Assert.Equal(1000m, summary.Balance);
        Assert.Equal(750m, summary.LargestExpense);
        Assert.Equal(3, summary.EntryCount);
    }

    [Fact]
    public async Task GetSummary_SplitsSpendingIntoCategoryShares()
    {
        using var context = new TestContext();
        var user = context.AddUser();
        var controller = BuildController(context, user);

        await AddEntry(controller, "Rent", "expense", 750m, "Rent");
        await AddEntry(controller, "Groceries", "expense", 150m, "Food");
        await AddEntry(controller, "Takeaway", "expense", 100m, "Food");

        var summary = ReadSummary(await controller.GetSummary(null, null));

        Assert.Equal(2, summary.Breakdown.Count);
        Assert.Equal("Rent", summary.Breakdown[0].Category);
        Assert.Equal(75, summary.Breakdown[0].Share);
        Assert.Equal(250m, summary.Breakdown[1].Total);
    }

    [Fact]
    public async Task GetSummary_LeavesOutEntriesFromOtherMonths()
    {
        using var context = new TestContext();
        var user = context.AddUser();
        var controller = BuildController(context, user);

        await AddEntry(controller, "This month", "expense", 40m);
        await AddEntry(controller, "Months ago", "expense", 500m, occurredOn: DateTime.UtcNow.AddMonths(-3));

        var summary = ReadSummary(await controller.GetSummary(null, null));

        Assert.Equal(1, summary.EntryCount);
        Assert.Equal(40m, summary.Expenses);
    }

    [Fact]
    public async Task Create_RejectsATypeThatIsNotIncomeOrExpense()
    {
        using var context = new TestContext();
        var user = context.AddUser();
        var controller = BuildController(context, user);

        var result = await controller.Create(new BudgetEntryRequest
        {
            Label = "Mystery",
            Category = "Other",
            Type = "transfer",
            Amount = 10m
        });

        Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Empty(context.Db.BudgetEntries);
    }

    [Fact]
    public async Task Delete_WillNotRemoveAnEntryFromAnotherAccount()
    {
        using var context = new TestContext();
        var owner = context.AddUser("owner");
        var stranger = context.AddUser("stranger");

        var ownerController = BuildController(context, owner);
        await AddEntry(ownerController, "Rent", "expense", 750m, "Rent");

        var entryId = context.Db.BudgetEntries.Single().Id;
        var strangerController = BuildController(context, stranger);

        Assert.IsType<NotFoundObjectResult>(await strangerController.Delete(entryId));
        Assert.Single(context.Db.BudgetEntries);
    }
}
