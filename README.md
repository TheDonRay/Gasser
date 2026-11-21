# ⛽ Gasser

Tankwise is a weekly gas tracker that logs every fill-up by day and fuel grade, along with the gallons pumped and the money spent. Live statistics, a daily spending breakdown and an AI "pit stop" powered by OpenAI help you see where your gas money goes and how to spend less of it.

---

## Features

- **Log fill-ups by grade.** Pick a day, then tap **Regular**, **Midgrade** or **Premium** to log a fill-up.
- **Edit any day.** Each day card has gallons and dollar fields you can change at any time, and shows that day's price per gallon.
- **Live statistics.** Total fill-ups, a count for each grade, total gallons, total spent, average $/gal, your most expensive day and your premium share.
- **Daily breakdown.** A list of the days you've logged, sortable by week order, most spent or most gallons.
- **AI pit stop.** Summarize your week, get saving tips, or ask your own question about your gas spending.
- **My ride.** Shows a photo of your car next to this week's gallons and fuel cost.
- **Dark mode**, a responsive layout, and data saved in the browser (`localStorage`) so a page refresh doesn't wipe your week.

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React 18, Vite 5, plain CSS (Poppins font) |
| Backend | Node.js, Express, OpenAI API |

The OpenAI key lives only on the backend. The browser never sees it: the frontend calls `/api/insights`, and Vite forwards that request to the Express server.

## Project structure

```
GasTrackerAnalzyer/
├── backend/                 Express server (OpenAI proxy)
└── frontend/
    ├── car-photos/          Put your car's photo here
    ├── index.html
    ├── vite.config.js       Proxies /api to localhost:3001
    └── src/
        ├── App.jsx          State and all event handlers
        ├── App.css          Design tokens, light/dark themes, layout
        ├── stats.js         Shared totals and formatting helpers
        └── components/
            ├── Button.jsx           Stateless button (handler passed in as a prop)
            ├── Statistics.jsx       Stats table, or an empty-state message
            ├── StatisticLine.jsx    One row of the stats table
            ├── WeekGrid.jsx / DayCard.jsx
            ├── LogPanel.jsx         Day picker and grade buttons
            ├── DailyBreakdown.jsx
            ├── AiInsights.jsx
            ├── CarCard.jsx
            ├── Header.jsx / Sidebar.jsx / Icon.jsx
```

## Getting started

**Requirements:** Node.js 18 or newer.

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

### 2. Backend (for AI insights)

```bash
cd backend
npm install
```

Create `backend/.env`:

```
OPENAI_API_KEY=your-key-here
```

Start the server on port **3001**, then use the AI pit stop in the app. Everything else in the app works without the backend.

### 3. Your car photo (optional)

Put a `.jpg`, `.png` or `.webp` file in `frontend/car-photos/` and restart `npm run dev`.

## API

### `POST /api/insights`

Request:

```json
{
  "week": [{ "day": "Mon", "gallons": 10.2, "spent": 34.5, "fillUps": 1 }],
  "grades": { "regular": 3, "midgrade": 0, "premium": 1 },
  "question": "How can I spend less on gas next week?"
}
```

`question` is optional. Without it, the backend returns a general summary of the week.

Response: `{ "insight": "..." }` on success, or `{ "error": "..." }` with a 4xx/5xx status.

## How it meets the assignment requirements

| Requirement | Where |
|---|---|
| Multiple components | `src/components/`: `Button`, `StatisticLine`, `Statistics` and more |
| `useState` for 3+ click categories | `regular`, `midgrade` and `premium` in `App.jsx` |
| Props | Counts and week data are passed from `App` to `LogPanel` → `Statistics` → `StatisticLine` |
| Event handlers in the parent | `logRegular`, `logMidgrade`, `logPremium`, `updateDay` and `resetWeek` are defined in `App` and passed to the stateless `Button` |
| Conditional rendering | `Statistics` shows "No fill-ups logged yet" until a grade is clicked |

## Author

Rayat Chowdhury
