# Porac Pricing DSS

A basic React dashboard for monitoring agricultural commodity prices, market movement, and regional signals.

## Run without npm

You can launch this app directly in a browser without installing Node or running any package manager.

Option 1: open the file directly
- Double-click `index.html`, or
- open it from your browser via File > Open

Option 2: use the included helper script
- On Windows, run `run.bat`

For the mobile entry point, open `mobile.html`. It uses the same dashboard logic as `index.html` and lets the existing responsive layout adapt to the device width without maintaining a second copy of the app.

This version loads React from CDN and keeps the dashboard fully browser-based.

## Included

- Overview KPI cards for price, volume, markets, and alerts
- Commodity, region, and time-period filters
- Eight-month price movement chart
- Regional price comparison
- Filterable market watchlist with status signals
- Responsive desktop and mobile layout

The current data is representative sample data. Replace the arrays in `src/App.tsx` with your DSS or API data source when the backend contract is ready.
