import { useCallback, useEffect, useState } from 'react';
import styles from '../Styles/BudgetPage.module.css';
import form from '../Styles/Form.module.css';
import PageHeader from '../Components/PageHeader';
import StatCard from '../Components/StatCard';
import Icon from '../Components/Icon';
import EmptyState from '../Components/EmptyState';
import BudgetEntryModal from '../Components/BudgetEntryModal';
import ConfirmDialog from '../Components/ConfirmDialog';
import { api } from '../Api/Client';
import type { BudgetEntry, BudgetSummary } from '../Api/Types';
import { formatDate, formatMoney } from '../Utils/Format';
import { useToast } from '../Context/ToastContext';
import { usePreferences } from '../Context/PreferencesContext';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export default function BudgetPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<BudgetEntry | null>(null);

  const { notify } = useToast();
  const { preferences } = usePreferences();

  const loadSummary = useCallback(async () => {
    try {
      setSummary(await api.get<BudgetSummary>(`/budget?month=${month}&year=${year}`));
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not load your budget.', 'error');
    }

    setLoading(false);
  }, [month, year, notify]);

  useEffect(() => {
    const timer = setTimeout(loadSummary, 0);
    return () => clearTimeout(timer);
  }, [loadSummary]);

  const shiftMonth = (step: number) => {
    const next = new Date(year, month - 1 + step, 1);
    setMonth(next.getMonth() + 1);
    setYear(next.getFullYear());
  };

  const addEntry = async (entry: {
    label: string;
    category: string;
    type: string;
    amount: number;
    occurredOn: string;
  }) => {
    await api.post<BudgetEntry>('/budget', entry);
    setModalOpen(false);
    notify('Entry added.');
    await loadSummary();
  };

  const requestDelete = (entry: BudgetEntry) => {
    if (preferences.confirmBeforeDelete) {
      setPendingDelete(entry);
      return;
    }

    deleteEntry(entry);
  };

  const deleteEntry = async (entry: BudgetEntry) => {
    setPendingDelete(null);

    try {
      await api.remove(`/budget/${entry.id}`);
      notify('Entry removed.');
      await loadSummary();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not remove the entry.', 'error');
    }
  };

  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();
  const balance = summary?.balance ?? 0;
  const saveRate =
    summary && summary.income > 0 ? Math.round(((summary.income - summary.expenses) / summary.income) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Budget"
        subtitle="What came in and what went out this month."
        action={
          <button className={`${form.button} ${form.primary}`} onClick={() => setModalOpen(true)}>
            <Icon name="add" size={19} />
            Add entry
          </button>
        }
      />

      <div className={styles.monthBar}>
        <button onClick={() => shiftMonth(-1)} aria-label="Previous month">
          <Icon name="chevron_left" size={20} />
        </button>
        <span className={styles.monthLabel}>
          {monthNames[month - 1]} {year}
        </span>
        <button onClick={() => shiftMonth(1)} disabled={isCurrentMonth} aria-label="Next month">
          <Icon name="chevron_right" size={20} />
        </button>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className={styles.skeleton} />
          ))}
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            <StatCard icon="payments" label="Income" value={formatMoney(summary?.income ?? 0)} tone="positive" />
            <StatCard
              icon="shopping_cart"
              label="Spent"
              value={formatMoney(summary?.expenses ?? 0)}
              tone="danger"
            />
            <StatCard
              icon="account_balance"
              label="Left over"
              value={formatMoney(balance)}
              hint={summary && summary.income > 0 ? `${saveRate}% of your income` : undefined}
              tone={balance >= 0 ? 'positive' : 'danger'}
            />
            <StatCard
              icon="receipt_long"
              label="Entries"
              value={summary?.entryCount ?? 0}
              hint={
                summary && summary.largestExpense > 0
                  ? `Biggest was ${formatMoney(summary.largestExpense)}`
                  : undefined
              }
            />
          </div>

          <div className={styles.columns}>
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Transactions</h2>
              <p className={styles.cardSubtitle}>Newest first.</p>

              {summary && summary.entries.length > 0 ? (
                <ul className={styles.entries}>
                  {summary.entries.map((entry) => (
                    <li key={entry.id} className={styles.entry}>
                      <span
                        className={`${styles.entryIcon} ${
                          entry.type === 'income' ? styles.incomeIcon : styles.expenseIcon
                        }`}
                      >
                        <Icon name={entry.type === 'income' ? 'trending_up' : 'trending_down'} size={18} />
                      </span>

                      <div className={styles.entryText}>
                        <span className={styles.entryLabel}>{entry.label}</span>
                        <span className={styles.entryMeta}>
                          {entry.category} · {formatDate(entry.occurredOn)}
                        </span>
                      </div>

                      <span
                        className={entry.type === 'income' ? styles.amountIncome : styles.amountExpense}
                      >
                        {entry.type === 'income' ? '+' : '-'}
                        {formatMoney(entry.amount)}
                      </span>

                      <button
                        className={styles.removeEntry}
                        onClick={() => requestDelete(entry)}
                        aria-label="Remove entry"
                      >
                        <Icon name="close" size={17} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  icon="account_balance_wallet"
                  title="Nothing logged this month"
                  message="Add an entry to start tracking where your money goes."
                  action={
                    <button className={`${form.button} ${form.primary}`} onClick={() => setModalOpen(true)}>
                      <Icon name="add" size={19} />
                      Add entry
                    </button>
                  }
                />
              )}
            </section>

            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Where it went</h2>
              <p className={styles.cardSubtitle}>Spending split by category.</p>

              {summary && summary.breakdown.length > 0 ? (
                <div className={styles.breakdown}>
                  {summary.breakdown.map((row) => (
                    <div key={row.category} className={styles.breakdownRow}>
                      <div className={styles.breakdownHead}>
                        <span>{row.category}</span>
                        <span className={styles.breakdownValue}>{formatMoney(row.total)}</span>
                      </div>
                      <div className={styles.track}>
                        <div className={styles.fill} style={{ width: `${row.share}%` }} />
                      </div>
                      <span className={styles.share}>{row.share}% of spending</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noBreakdown}>No expenses logged for this month yet.</p>
              )}
            </section>
          </div>
        </>
      )}

      {modalOpen && <BudgetEntryModal onClose={() => setModalOpen(false)} onSave={addEntry} />}

      {pendingDelete && (
        <ConfirmDialog
          title="Remove this entry?"
          message={`"${pendingDelete.label}" will be deleted from this month.`}
          confirmLabel="Remove"
          onConfirm={() => deleteEntry(pendingDelete)}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </>
  );
}
