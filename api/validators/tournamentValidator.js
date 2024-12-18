export const validateTournamentData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 3) {
    errors.push('Tournament name must be at least 3 characters long');
  }

  if (!data.slug || !/^[a-zA-Z0-9-]+$/.test(data.slug)) {
    errors.push('Slug must contain only letters, numbers, and hyphens');
  }

  if (!data.type || !['single-elimination', 'double-elimination', 'round-robin'].includes(data.type)) {
    errors.push('Invalid tournament type');
  }

  const now = new Date();
  if (data.registrationStartAt && data.registrationEndAt) {
    if (now < new Date(data.registrationStartAt) || now > new Date(data.registrationEndAt)) {
      errors.push('Registration is not available');
    }
  }

  return errors;
}; 