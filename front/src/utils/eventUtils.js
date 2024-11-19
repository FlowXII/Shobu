export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

export const getEventStateLabel = (state) => {
  const states = {
    1: 'Created',
    2: 'Active',
    3: 'Completed',
    4: 'Ready',
    5: 'Canceled',
    6: 'Called',
    7: 'Completed'
  };
  return states[state] || 'Unknown';
};

export const formatEntryFee = (entryFee) => {
  if (!entryFee) return 'Free';
  if (typeof entryFee === 'number') return `$${entryFee}`;
  if (typeof entryFee === 'object' && entryFee.amount) {
    return `$${entryFee.amount}`;
  }
  return 'Free';
}; 