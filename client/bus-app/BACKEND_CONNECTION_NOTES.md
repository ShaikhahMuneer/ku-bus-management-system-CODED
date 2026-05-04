# Backend Connection Notes

## Current frontend flow

The React prototype is currently using one shared state source in `src/App.js`:

- `trips`
- `reports`
- `pickupStatus`
- `studentTripStatus`

These values are passed down to the Student, Driver, and Admin dashboards. This means changes inside one role can be reflected in the others while they are inside the same running React app:

- Student check-in updates the shared `trips` passenger count.
- Driver status updates change the same shared trip object.
- Student reports are stored in shared `reports`.
- Admin report status updates now update the shared `reports` directly, so the student report status can reflect the admin change.
- Admin analytics now calculates values from shared `trips`, `reports`, and `fleet` instead of hard-coded numbers.

## What changes when MongoDB + backend are added

Right now, the data is inside React memory, so it resets on refresh and only works inside the same browser session.

Later, React state should be replaced by backend API calls:

- `GET /api/trips` gets all trips for Student, Driver, and Admin.
- `PATCH /api/trips/:id/status` lets the driver update trip status.
- `POST /api/checkins` lets the student check in.
- `POST /api/reports` lets the student submit a report.
- `PATCH /api/reports/:id/status` lets the admin update report status.
- `GET /api/analytics` or frontend calculations from `GET /api/trips` create the admin charts.

## For different computers / real-time updates

If the admin page is open on one computer and the student page is open on another computer, they will not share React memory. They must share the same MongoDB database through the backend.

For instant updates without refresh, use Socket.IO:

1. Student checks in.
2. Backend updates MongoDB.
3. Backend emits `tripUpdated`.
4. Admin and Driver dashboards receive the event and update instantly.

Without Socket.IO, the pages can still sync by refreshing or by polling every few seconds.
