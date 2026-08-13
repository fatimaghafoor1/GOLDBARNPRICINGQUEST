# PricingQuest Architecture


## Main Components

The project has three main parts:

- Java backend
- Electron frontend
- SQLite database

## System Flow Chart 
 

Price Data
Java Backend -> 
HTTP Endpoint ->
Electron Fronten ->
Dashboard->
Graph - Signals - Notifications
Details: 
## Java Backend

The Java backend runs the local server on port 5000.

It sends the current gold and silver prices, the Buy/Sell/Hold signals, and the model performance information to the frontend.

The frontend gets this information through:

http://localhost:5000/pricesGandS

The information is sent as JSON.

Electron Frontend

The Electron frontend is the desktop application.

It is made using:

HTML
CSS
JavaScript
Chart.js

The HTML creates the dashboard.

The CSS controls how the dashboard looks.

The JavaScript gets the data from the Java backend and updates the dashboard.

The frontend shows:

Gold price
Silver price
Buy/Sell/Hold signals
Accuracy
Error
Training samples
Price graph
Price history table
Currency conversion
Desktop notifications
Price Updates

The frontend checks the backend repeatedly using the selected refresh rate.

The available refresh rates are:

2 seconds
4 seconds
10 seconds

When new data comes in, the prices and signals are updated and the new prices are added to the graph and table.

Graph

Chart.js is used for the graph.

The graph displays the gold and silver prices that have been collected while the application is running.

The user can switch between:

1 week
1 month
6 months
Signals

The backend sends a signal for both gold and silver.

The signals can be:

BUY
SELL
HOLD

The frontend displays the signals next to the current prices.

Notifications

The application can send desktop notifications when a new BUY or SELL signal appears.

The same signal is not repeatedly notified unless the signal changes.

Database

SQLite is included in the project and the backend connects to the stored_rates.db database.

The database is intended to store project data and can be used for keeping price information between sessions.

Overall Flow
Java Backend
     ↓
Gets price/signal data
     ↓
Local HTTP server
     ↓
Electron JavaScript
     ↓
Updates dashboard
     ↓
Graph + Table + Signals + Notifications

