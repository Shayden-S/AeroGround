# AeroGround prototype

React/Vite frontend for ground support equipment operations. The backend folder is a starter only; operational records currently use browser localStorage and sample data.

## Run locally

1. Open a terminal in `client`.
2. Run `npm install`.
3. Run `npm run dev` and open the address Vite prints.

Implemented routes: `/login`, `/dashboard`, `/equipment`, `/fault-reports`, `/maintenance`, `/assignments`, `/inspections`, `/reports`, `/users`, and `/settings`.

The dashboard area buttons switch between the gate map, hangar equipment, and remote stand equipment. The top location selector switches the same view and the Equipment page uses that location as a filter. Terminal 2 displays an empty state because the prototype has no Terminal 2 records. The dashboard KPI cards and charts remain fleet-wide sample totals.

Faults, work orders, assignments, inspection results, staff demo records and settings persist only in the current browser. The dashboard and equipment inventory still use their original mock data, so their summary numbers do not recalculate from new records. Authentication and role restrictions, shared records, notifications, and database synchronization require the MERN backend.

To reset prototype records, clear this site's browser storage.
