// Function to process and combine user, tournament, and set data
export const processData = (userData, tournamentsAndSetsData) => {
  const processedTournaments = (tournamentsAndSetsData || []).map(tournament => {
    if (!tournament) return null;

    const processedEvents = (tournament.events || []).map(event => {
      if (!event) return null;

      const hasUserEntrant = event.entrants?.nodes?.length > 0;
      if (!hasUserEntrant) return null;

      const processedSets = (event.sets?.nodes || []).map(set => {
        if (!set) return null;
        return {
          id: set.id,
          state: parseInt(set.state, 10),
          station: set.station,
          fullRoundText: set.fullRoundText || 'Unknown Round',
          slots: (set.slots || []).map(slot => ({
            id: slot?.id,
            entrantName: slot?.entrant?.name || 'Unknown'
          }))
        };
      }).filter(Boolean);

      return {
        ...event,
        sets: processedSets,
        userParticipating: true
      };
    }).filter(Boolean);

    const videogameId = processedEvents.length > 0 ? processedEvents[0].videogame?.id : null;

    return { ...tournament, events: processedEvents, videogameId };
  }).filter(tournament => tournament && tournament.events && tournament.events.length > 0);

  return {
    user: userData ? {
      name: userData.name || 'Unknown',
      location: userData.location || {},
      images: userData.images || [],
      slug: userData.slug || '',
      player: userData.player || {},
      bio: userData.bio || '',
      genderPronoun: userData.genderPronoun || ''
    } : null,
    tournaments: processedTournaments
  };
};

/*
Updated Data structure:
{
  user: {
    name: string,
    location: {
      city: string,
      state: string,
      country: string,
      countryId: number
    },
    images: Array<{id: string, type: string, url: string}>,
    slug: string,
    player: {
      id: string,
      gamerTag: string,
      prefix: string
    },
    bio: string,
    genderPronoun: string
  },
  tournaments: Array<{
    id: string,
    name: string,
    startAt: number,
    endAt: number,
    venueAddress: string,
    city: string,
    state: string,
    countryCode: string,
    numAttendees: number,
    slug: string,
    images: Array<{url: string, type: string}>,
    videogameId: string,
    events: Array<{
      id: string,
      name: string,
      startAt: number,
      numEntrants: number,
      slug: string,
      videogame: {id: string},
      userParticipating: boolean,
      sets: Array<{
        id: string,
        state: number, // Set state is an integer
        station: {id: string, number: number},
        slots: Array<{id: string, entrantName: string}>
      }>
    }>
  }>
}
*/
