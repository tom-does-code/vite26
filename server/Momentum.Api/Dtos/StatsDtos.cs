namespace Momentum.Api.Dtos;

public class StatsResponse
{
    public int TotalTasks { get; set; }

    public int CompletedTasks { get; set; }

    public int ActiveTasks { get; set; }

    public int OverdueTasks { get; set; }

    public int CompletionRate { get; set; }

    public int CurrentStreak { get; set; }

    public DateTime MemberSince { get; set; }

    public Dictionary<string, int> ByPriority { get; set; } = new();

    public Dictionary<string, int> ByCategory { get; set; } = new();

    public List<DailyCount> LastFourteenDays { get; set; } = new();
}

public class DailyCount
{
    public string Date { get; set; } = string.Empty;

    public int Created { get; set; }

    public int Completed { get; set; }
}
