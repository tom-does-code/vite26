export function formatDate(value: string | null) {
  if (!value) {
    return '';
  }

  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function formatMoney(value: number) {
  return value.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2
  });
}

export function describeDueDate(dueDate: string | null) {
  if (!dueDate) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const days = Math.round((due.getTime() - today.getTime()) / 86400000);

  if (days < 0) {
    return { label: days === -1 ? '1 day overdue' : `${Math.abs(days)} days overdue`, tone: 'overdue' };
  }

  if (days === 0) {
    return { label: 'Due today', tone: 'soon' };
  }

  if (days === 1) {
    return { label: 'Due tomorrow', tone: 'soon' };
  }

  if (days <= 7) {
    return { label: `Due in ${days} days`, tone: 'normal' };
  }

  return { label: `Due ${formatDate(dueDate)}`, tone: 'normal' };
}

export function toDateInput(value: string | null) {
  if (!value) {
    return '';
  }

  return new Date(value).toISOString().slice(0, 10);
}
