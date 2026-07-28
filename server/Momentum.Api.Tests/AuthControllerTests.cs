using Microsoft.AspNetCore.Mvc;
using Momentum.Api.Controllers;
using Momentum.Api.Dtos;
using Momentum.Api.Services;

namespace Momentum.Api.Tests;

public class AuthControllerTests
{
    private static AuthController BuildController(TestContext context)
    {
        return new AuthController(context.Db, new TokenService(TestContext.Configuration));
    }

    [Fact]
    public async Task Register_StoresAHashInsteadOfThePlainPassword()
    {
        using var context = new TestContext();
        var controller = BuildController(context);

        var result = await controller.Register(new RegisterRequest
        {
            Username = "newcomer",
            Email = "Newcomer@Example.com",
            Password = "Passw0rd123"
        });

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<AuthResponse>(ok.Value);
        var stored = context.Db.Users.Single();

        Assert.NotEmpty(response.Token);
        Assert.Equal("newcomer@example.com", stored.Email);
        Assert.NotEqual("Passw0rd123", stored.PasswordHash);
        Assert.NotNull(context.Db.Profiles.SingleOrDefault(p => p.UserId == stored.Id));
    }

    [Fact]
    public async Task Register_RejectsAUsernameThatIsAlreadyTaken()
    {
        using var context = new TestContext();
        var controller = BuildController(context);

        await controller.Register(new RegisterRequest
        {
            Username = "taken",
            Email = "first@example.com",
            Password = "Passw0rd123"
        });

        var second = await controller.Register(new RegisterRequest
        {
            Username = "TAKEN",
            Email = "second@example.com",
            Password = "Passw0rd123"
        });

        Assert.IsType<ConflictObjectResult>(second.Result);
        Assert.Single(context.Db.Users);
    }

    [Fact]
    public async Task Login_SucceedsWithTheRightPassword()
    {
        using var context = new TestContext();
        var controller = BuildController(context);

        await controller.Register(new RegisterRequest
        {
            Username = "returning",
            Email = "returning@example.com",
            Password = "Passw0rd123"
        });

        var result = await controller.Login(new LoginRequest
        {
            Username = "returning",
            Password = "Passw0rd123"
        });

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<AuthResponse>(ok.Value);

        Assert.Equal("returning", response.Username);
        Assert.True(response.ExpiresAt > DateTime.UtcNow);
    }

    [Fact]
    public async Task Login_FailsWhenThePasswordIsWrong()
    {
        using var context = new TestContext();
        var controller = BuildController(context);

        await controller.Register(new RegisterRequest
        {
            Username = "careful",
            Email = "careful@example.com",
            Password = "Passw0rd123"
        });

        var result = await controller.Login(new LoginRequest
        {
            Username = "careful",
            Password = "wrong-password"
        });

        Assert.IsType<UnauthorizedObjectResult>(result.Result);
    }

    [Fact]
    public async Task Login_FailsWhenTheUserDoesNotExist()
    {
        using var context = new TestContext();
        var controller = BuildController(context);

        var result = await controller.Login(new LoginRequest
        {
            Username = "ghost",
            Password = "Passw0rd123"
        });

        Assert.IsType<UnauthorizedObjectResult>(result.Result);
    }
}
