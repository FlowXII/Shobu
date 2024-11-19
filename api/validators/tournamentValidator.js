export const validateTournamentData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 3) {
    errors.push('Tournament name must be at least 3 characters long');
  }

  // ... rest of the validation logic moved from service ...

  return errors;
}; 