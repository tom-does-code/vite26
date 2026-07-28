import { useEffect, useState } from 'react';
import styles from '../Styles/StatsPage.module.css';
import PageHeader from '../Components/PageHeader';
import StatCard from '../Components/StatCard';
import EmptyState from '../Components/EmptyState';
import Icon from '../Components/Icon';
import { api } from '../Api/Client';
import type { Stats } from '../Api/Types';
import { formatDate, formatShortDate } from '../Utils/Format';
import { useToast } from '../Context/ToastContext';

const priorityOrder = ['high', 'medium', 'low'];

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { notify } = useToast();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setStats(await api.get<Stats>('/stats'));
      } catch (err) {
        notify(err instanceof Error ? err.message : 'Could not load your statistics.', 'error');
      }

      setLoading(false);
    };

    const timer = setTimeout(loadStats, 0);
    return () => clearTimeout(timer);
  }, [notify]);

  if (loading) {
    return (
      <>
        <PageHeader title="Statistics" subtitle="How your week is actually going." />
        <div className={styles.grid}>
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className={styles.skeleton} />
          ))}
        </div>
      </>
    );
  }

  if (!stats) {
    return (
      <>
        <PageHeader title="Statistics" subtitle="How your week is actually going." />
        <div className={styles.panel}>
          <EmptyState
            icon="cloud_off"
            title="Statistics are unavailable"
            message="We could not reach the server. Refresh the page to try again."
          />
        </div>
      </>
    );
  }

  const busiestDay = Math.max(
    1,
    ...stats.lastFourteenDays.map((day) => Math.max(day.created, day.completed))
  );

  const categories = Object.entries(stats.byCategory);
  const priorityTotal = priorityOrder.reduce((sum, key) => sum + (stats.byPriority[key] ?? 0), 0);

  return (
    <>
      <PageHeader
        title="Statistics"
        subtitle={`Tracking your progress since ${formatDate(stats.memberSince)}.`}
      />

      <div className={styles.grid}>
        <StatCard icon="inbox" label="Total tasks" value={stats.totalTasks} />
        <StatCard
          icon="check_circle"
          label="Completed"
          value={stats.completedTasks}
          hint={`${stats.completionRate}% of everything you added`}
          tone="positive"
        />
        <StatCard icon="pending_actions" label="Still active" value={stats.activeTasks} tone="warning" />
        <StatCard
          icon="event_busy"
          label="Overdue"
          value={stats.overdueTasks}
          hint={stats.overdueTasks === 0 ? 'Nothing past its due date' : 'Worth a look today'}
          tone={stats.overdueTasks === 0 ? 'positive' : 'danger'}
        />
      </div>

      {stats.totalTasks === 0 ? (
        <div className={styles.panel}>
          <EmptyState
            icon="monitoring"
            title="No data to chart yet"
            message="Once you start adding and completing tasks, your activity shows up here."
          />
        </div>
      ) : (
        <div className={styles.columns}>
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <div>
                <h2 className={styles.cardTitle}>Last 14 days</h2>
                <p className={styles.cardSubtitle}>Tasks created against tasks finished.</p>
              </div>
              <div className={styles.legend}>
                <span>
                  <i className={styles.dotCreated} />
                  Created
                </span>
                <span>
                  <i className={styles.dotCompleted} />
                  Completed
                </span>
              </div>
            </div>

            <div className={styles.chart}>
              {stats.lastFourteenDays.map((day) => (
                <div key={day.date} className={styles.chartColumn}>
                  <div className={styles.bars}>
                    <div
                      className={styles.barCreated}
                      style={{ height: `${(day.created / busiestDay) * 100}%` }}
                      title={`${day.created} created`}
                    />
                    <div
                      className={styles.barCompleted}
                      style={{ height: `${(day.completed / busiestDay) * 100}%` }}
                      title={`${day.completed} completed`}
                    />
                  </div>
                  <span className={styles.chartLabel}>{formatShortDate(day.date)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Completion rate</h2>
            <p className={styles.cardSubtitle}>Across every task on your account.</p>

            <div className={styles.ringWrap}>
              <div
                className={styles.ring}
                style={{
                  background: `conic-gradient(var(--accent) ${stats.completionRate * 3.6}deg, var(--surface-hover) 0deg)`
                }}
              >
                <div className={styles.ringInner}>
                  <span className={styles.ringValue}>{stats.completionRate}%</span>
                  <span className={styles.ringLabel}>done</span>
                </div>
              </div>
            </div>

            <div className={styles.streak}>
              <Icon name="local_fire_department" size={20} filled />
              <div>
                <p className={styles.streakValue}>
                  {stats.currentStreak} day{stats.currentStreak === 1 ? '' : 's'}
                </p>
                <p className={styles.cardSubtitle}>Current completion streak</p>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>By priority</h2>
            <p className={styles.cardSubtitle}>Where your workload sits.</p>

            <div className={styles.barList}>
              {priorityOrder.map((key) => {
                const count = stats.byPriority[key] ?? 0;
                const share = priorityTotal === 0 ? 0 : Math.round((count / priorityTotal) * 100);

                return (
                  <div key={key} className={styles.barRow}>
                    <span className={styles.barLabel}>{key}</span>
                    <div className={styles.track}>
                      <div className={`${styles.fill} ${styles[key]}`} style={{ width: `${share}%` }} />
                    </div>
                    <span className={styles.barValue}>{count}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Top categories</h2>
            <p className={styles.cardSubtitle}>The labels you use the most.</p>

            <div className={styles.barList}>
              {categories.map(([name, count]) => (
                <div key={name} className={styles.barRow}>
                  <span className={styles.barLabel}>{name}</span>
                  <div className={styles.track}>
                    <div
                      className={`${styles.fill} ${styles.accentFill}`}
                      style={{ width: `${(count / stats.totalTasks) * 100}%` }}
                    />
                  </div>
                  <span className={styles.barValue}>{count}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
