# API Documentation

## Authentication Routes

### User Authentication
- `POST /api/auth/register`
  - Register a new user
  - Body: `{ username, email, password }`
  - Returns: User object with JWT token in cookie

- `POST /api/auth/login`
  - Login existing user
  - Body: `{ email, password }`
  - Returns: User object with JWT token in cookie

- `POST /api/auth/logout`
  - Logout user
  - Requires: Authentication
  - Clears auth cookies

### Start.gg Authentication
- `GET /api/auth/startgg`
  - Initiate Start.gg OAuth flow
  - Requires: Authentication
  - Redirects to Start.gg authorization page

- `GET /api/auth/startgg/callback`
  - Start.gg OAuth callback handler
  - Handles OAuth code and stores tokens
  - Redirects to frontend profile page

- `POST /api/auth/startgg/disconnect`
  - Disconnect Start.gg integration
  - Requires: Authentication
  - Returns: Success message

## Tournament Routes

### Tournament Management
- `POST /api/tournaments`
  - Create new tournament
  - Requires: Authentication
  - Body: `{ name, description, date, location, etc }`
  - Returns: Created tournament object

- `GET /api/tournaments`
  - Get all tournaments
  - Optional query params for filtering/pagination
  - Returns: Array of tournament objects

- `GET /api/tournaments/:id`
  - Get specific tournament details
  - Returns: Tournament object with events

- `PUT /api/tournaments/:id`
  - Update tournament details
  - Requires: Authentication, Tournament Organizer
  - Body: Updated tournament fields
  - Returns: Updated tournament object

- `DELETE /api/tournaments/:id`
  - Delete tournament
  - Requires: Authentication, Tournament Organizer
  - Returns: Success message

### Tournament Registration
- `POST /api/tournaments/:id/register`
  - Register for tournament
  - Requires: Authentication
  - Returns: Updated tournament object

- `POST /api/tournaments/:id/checkin/:userId`
  - Check in attendee
  - Requires: Authentication, Tournament Organizer
  - Returns: Updated tournament object

- `DELETE /api/tournaments/:id/register`
  - Cancel tournament registration
  - Requires: Authentication
  - Returns: Updated tournament object

## Event Routes

### Event Management
- `POST /api/tournaments/:tournamentId/events`
  - Create new event
  - Requires: Authentication, Tournament Organizer
  - Body: `{ name, game, format, maxEntrants, etc }`
  - Returns: Created event object

- `GET /api/events/:eventId`
  - Get event details
  - Returns: Event object with tournament context

- `GET /api/tournaments/:tournamentId/events`
  - Get all events for a tournament
  - Returns: Array of event objects

- `PUT /api/events/:eventId`
  - Update event details
  - Requires: Authentication, Tournament Organizer
  - Body: Updated event fields
  - Returns: Updated event object

- `DELETE /api/events/:eventId`
  - Delete event
  - Requires: Authentication, Tournament Organizer
  - Returns: Success message

### Event Registration
- `POST /api/events/:eventId/register`
  - Register for event
  - Requires: Authentication
  - Returns: Updated event object

## Station Management Routes

### Station Viewer
- `GET /api/:eventId/stations`
  - Get stations for event
  - Returns: Array of station objects with matches

### Station Reporting
- `POST /api/sets/report`
  - Report set results
  - Requires: Authentication, Tournament Organizer
  - Body: `{ setId, player1Score, player2Score, etc }`
  - Returns: Updated set object

- `POST /api/sets/reset`
  - Reset set results
  - Requires: Authentication, Tournament Organizer
  - Body: `{ setId, resetDependentSets }`
  - Returns: Updated set object

- `POST /api/sets/called`
  - Mark set as called
  - Requires: Authentication, Tournament Organizer
  - Body: `{ setId }`
  - Returns: Updated set object

- `POST /api/sets/in-progress`
  - Mark set as in progress
  - Requires: Authentication, Tournament Organizer
  - Body: `{ setId }`
  - Returns: Updated set object

## Dashboard Routes

- `GET /api/dashboard`
  - Get user's Start.gg dashboard data
  - Requires: Authentication, Start.gg Connection
  - Returns: User's tournaments and events from Start.gg

## Social Routes

### Posts
- `POST /api/posts`
  - Create new post
  - Requires: Authentication
  - Body: `{ content }`
  - Returns: Created post object

- `GET /api/posts/feed`
  - Get posts feed
  - Optional query params: `page`, `limit`
  - Returns: Array of posts with pagination

## Push Notification Routes

- `POST /api/notifications/subscribe`
  - Subscribe to push notifications
  - Body: `{ subscription }`
  - Returns: Success message

## Upcoming Tournaments Routes

- `GET /api/tournaments/upcoming`
  - Get upcoming tournaments
  - Query params: `countryCode`, `perPage`, `videogameId`
  - Returns: Array of upcoming tournaments

## Ticket Routes

### Ticket Management
- `POST /api/tournaments/:tournamentId/tickets`
  - Create new ticket
  - Requires: Authentication
  - Body: `{ title, description, priority, assignedTo }`
  - Returns: Created ticket object

- `GET /api/tournaments/:tournamentId/tickets`
  - Get all tickets for a tournament
  - Requires: Authentication
  - Returns: Array of ticket objects

- `GET /api/tickets/:ticketId`
  - Get specific ticket details
  - Requires: Authentication
  - Returns: Ticket object with comments

- `PATCH /api/tickets/:ticketId/status`
  - Update ticket status
  - Requires: Authentication
  - Body: `{ status }` (PENDING, IN_PROGRESS, or RESOLVED)
  - Returns: Updated ticket object

- `POST /api/tickets/:ticketId/comments`
  - Add comment to ticket
  - Requires: Authentication
  - Body: `{ content }`
  - Returns: Updated ticket object with new comment

## Error Responses

All routes may return the following error responses:

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error response format: 