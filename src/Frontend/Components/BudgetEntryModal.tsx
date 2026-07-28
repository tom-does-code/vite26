import { useState } from 'react';
import Modal from './Modal';
import Icon from './Icon';
import form from '../Styles/Form.module.css';
import styles from '../Styles/BudgetEntryModal.module.css';

interface BudgetEntryModalProps {
  onClose: () => void;
  onSave: (entry: {
    label: string;
    category: string;
    type: string;
    amount: number;
    occurredOn: string;
  }) => Promise<void>;
}

const expenseCategories = ['Rent', 'Food', 'Transport', 'Bills', 'Subscriptions', 'Fun', 'Other'];
const incomeCategories = ['Salary', 'Freelance', 'Refund', 'Other'];

export default function BudgetEntryModal({ onClose, onSave }: BudgetEntryModalProps) {
  const [type, setType] = useState('expense');
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [occurredOn, setOccurredOn] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  const switchType = (next: string) => {
    setType(next);
    setCategory(next === 'income' ? 'Salary' : 'Food');
  };

  const handleSave = async () => {
    const value = Number(amount);

    if (label.trim().length < 2) {
      setError('Give this entry a short name.');
      return;
    }

    if (!Number.isFinite(value) || value <= 0) {
      setError('Enter an amount greater than zero.');
      return;
    }

    setBusy(true);
    setError('');

    try {
      await onSave({
        label: label.trim(),
        category,
        type,
        amount: value,
        occurredOn: new Date(`${occurredOn}T00:00:00Z`).toISOString()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this entry.');
      setBusy(false);
    }
  };

  return (
    <Modal
      title="Add entry"
      subtitle="Log money coming in or going out."
      onClose={onClose}
      width={470}
      footer={
        <>
          <button className={`${form.button} ${form.ghost}`} onClick={onClose}>
            Cancel
          </button>
          <button className={`${form.button} ${form.primary}`} onClick={handleSave} disabled={busy}>
            {busy ? 'Saving' : 'Add entry'}
          </button>
        </>
      }
    >
      {error && (
        <div className={form.error}>
          <Icon name="error" size={17} />
          {error}
        </div>
      )}

      <div className={form.field}>
        <span className={form.label}>Type</span>
        <div className={styles.typeRow}>
          <button
            type="button"
            className={type === 'expense' ? `${styles.typeButton} ${styles.expense}` : styles.typeButton}
            onClick={() => switchType('expense')}
          >
            <Icon name="trending_down" size={18} />
            Expense
          </button>
          <button
            type="button"
            className={type === 'income' ? `${styles.typeButton} ${styles.income}` : styles.typeButton}
            onClick={() => switchType('income')}
          >
            <Icon name="trending_up" size={18} />
            Income
          </button>
        </div>
      </div>

      <div className={form.field}>
        <label className={form.label} htmlFor="entry-label">
          Description
        </label>
        <input
          id="entry-label"
          className={form.input}
          value={label}
          maxLength={60}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={type === 'income' ? 'October salary' : 'Weekly food shop'}
        />
      </div>

      <div className={form.row}>
        <div className={form.field}>
          <label className={form.label} htmlFor="entry-amount">
            Amount
          </label>
          <input
            id="entry-amount"
            className={form.input}
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className={form.field}>
          <label className={form.label} htmlFor="entry-date">
            Date
          </label>
          <input
            id="entry-date"
            className={form.input}
            type="date"
            value={occurredOn}
            onChange={(e) => setOccurredOn(e.target.value)}
          />
        </div>
      </div>

      <div className={form.field}>
        <label className={form.label} htmlFor="entry-category">
          Category
        </label>
        <select
          id="entry-category"
          className={form.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </Modal>
  );
}
