export interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  category: string;
  isCompleted: boolean;
  createdAt: string;
  dueDate: string | null;
  completedAt: string | null;
}

export interface TaskInput {
  title: string;
  description: string;
  priority: string;
  category: string;
  dueDate: string | null;
}

export interface TaskFilters {
  search: string;
  priority: string;
  category: string;
  status: string;
  sortBy: string;
}

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface DailyCount {
  date: string;
  created: number;
  completed: number;
}

export interface Stats {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  overdueTasks: number;
  completionRate: number;
  currentStreak: number;
  memberSince: string;
  byPriority: Record<string, number>;
  byCategory: Record<string, number>;
  lastFourteenDays: DailyCount[];
}

export interface Profile {
  firstName: string;
  lastName: string;
  contactEmail: string;
  bio: string;
  username: string;
  memberSince: string;
}

export interface Preferences {
  theme: string;
  accentColour: string;
  defaultPriority: string;
  confirmBeforeDelete: boolean;
}

export interface BudgetEntry {
  id: number;
  label: string;
  category: string;
  type: string;
  amount: number;
  occurredOn: string;
}

export interface CategoryTotal {
  category: string;
  total: number;
  share: number;
}

export interface BudgetSummary {
  income: number;
  expenses: number;
  balance: number;
  largestExpense: number;
  entryCount: number;
  breakdown: CategoryTotal[];
  entries: BudgetEntry[];
}
