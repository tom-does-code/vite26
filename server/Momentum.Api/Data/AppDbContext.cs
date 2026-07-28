using Microsoft.EntityFrameworkCore;
using Momentum.Api.Models;

namespace Momentum.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<UserProfile> Profiles => Set<UserProfile>();

    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    public DbSet<BudgetEntry> BudgetEntries => Set<BudgetEntry>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        builder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        builder.Entity<User>()
            .HasOne(u => u.Profile)
            .WithOne(p => p.User)
            .HasForeignKey<UserProfile>(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<TaskItem>()
            .HasOne(t => t.User)
            .WithMany(u => u.Tasks)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<BudgetEntry>()
            .HasOne(b => b.User)
            .WithMany(u => u.BudgetEntries)
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<BudgetEntry>()
            .Property(b => b.Amount)
            .HasPrecision(12, 2);
    }
}
