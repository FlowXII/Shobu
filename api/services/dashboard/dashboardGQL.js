// Queries for the dashboard

// Query for user info
export const userInfoQuery = `
query UserInfoQuery {
  currentUser {
    name
    id
    location {
      city
      state
      country
      countryId
    }
    images {
      id
      type
      url
    }
    slug
    player {
      id
      gamerTag
      prefix
    }
  }
}
`;

// Query for user tournaments
export const userTournamentsQuery = `
query UserTournamentsQuery($userName: String!) {
  currentUser {
    tournaments(query: {
      perPage: 15
    }) {
      nodes {
        id
        name
        startAt
        endAt
        venueAddress
        city
        state
        countryCode
        numAttendees
        slug
        images {
          url
          type
        }
        events {
          id
          name
          startAt
          state
          numEntrants
          slug
          videogame {
            id
          }
          entrants(query: {
            filter: { name: $userName }
          }) {
            nodes {
              id
              standing {
                placement
              }
            }
          }
        }
      }
    }
  }
}
`;

// Combined query for user tournaments and sets
export const userTournamentsAndSetsQuery = `
query UserTournamentsAndSetsQuery($userName: String!, $playerIds: [ID!]!) {
  currentUser {
    tournaments(query: {
      perPage: 15
    }) {
      nodes {
        id
        name
        startAt
        endAt
        venueAddress
        city
        state
        countryCode
        numAttendees
        slug
        images {
          url
          type
        }
        events {
          id
          name
          startAt
          state
          numEntrants
          slug
          videogame {
            id
          }
          entrants(query: {
            filter: { name: $userName }
          }) {
            nodes {
              id
              standing {
                placement
              }
            }
          }
          sets(
            page: 1
            perPage: 128
            filters: { 
              state: [1, 2, 4, 6, 7],  # Include Created, Ongoing, Ready, Called, and Completed states
              playerIds: $playerIds,
              hideEmpty: true
            }
          ) {
            nodes {
              id
              fullRoundText
              state
              station {
                id
                number
              }
              slots {
                id
                entrant {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

// // Query for user sets (for which we can call notifications afterwards)
// export const userSetsQuery = `
// query UserSetsQuery {
//   currentUser {
//     events(query: {
//       perPage: 20,
//       sortBy: "startAt desc"
//     }) {
//       nodes {
//         id
//         tournament {
//         name
//         } 
//         name
//         sets(
//           page: 1
//           perPage: 20
//           filters: { state: [2, 6] }  # State 2 is Ongoing, State 6 is Called
//         ) {
//           nodes {
//             id
//             state
//             station {
//               id
//               number
//             }
//             slots {
//               id
//               entrant {
//                 id
//                 name
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }
// `;

