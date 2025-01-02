The Merged Mining Proxy with Real-Time Dashboard is a Node.js-based application designed to facilitate merged mining for multiple cryptocurrencies. It provides an intuitive real-time dashboard to monitor mining logs and visualize per-coin hash rates over a historical window of 180 minutes. This setup achieves efficient management of mining activity while offering real-time insights for system administrators and miners.
What Is Achieved
1. Merged Mining Support

The project allows miners to mine multiple cryptocurrencies (e.g., BTC, BCH, BCA) simultaneously. Hash power is distributed efficiently without conflicts, enabling miners to maximize their rewards across supported coins.
2. Real-Time Monitoring

    Logs are updated in real-time using Socket.IO.
    A live feed of miner connections, error messages, and system events ensures transparency and troubleshooting ease.

3. Historical Hash Rate Visualization

    Graphs for BTC, BCH, and BCA hash rates are displayed in the dashboard.
    Each graph shows historical hash rates for the past 180 minutes, updated every 1 minute.

4. Web-Based Dashboard

    The dashboard is accessible via any browser and provides:
        Logs section: Displays miner connections and key events.
        Graphs: Real-time visualization of mining performance for each coin.

5. Scalable Backend

    Built with Express.js and Socket.IO, the backend efficiently handles concurrent miner connections and real-time data updates.
    The modular design allows for easy expansion to support additional coins or advanced features.

How It Works

    Backend Functionality:
        The server maintains hash rate statistics and mining logs for each supported coin.
        Logs and hash rates are shared with connected clients using WebSockets for real-time updates.
        The hash rate data is refreshed every 1 minute, simulating real-world mining statistics.

    Frontend Functionality:
        The dashboard is built using HTML and Chart.js for dynamic graphing.
        Logs are displayed in a scrollable area, while the hash rates for each coin are visualized in separate graphs.
        Data is dynamically updated as the backend pushes real-time updates via Socket.IO.

Technical Stack

    Backend:
        Node.js: For efficient handling of I/O operations and miner connections.
        Express.js: Lightweight web framework for API and frontend hosting.
        Socket.IO: Real-time communication between server and client.

    Frontend:
        HTML5/CSS3: For structure and styling of the dashboard.
        Chart.js: For visualizing hash rate data in interactive, real-time graphs.
        JavaScript: For dynamic updates and interaction with the backend.

    Deployment:
        The backend runs on a server, and the frontend is served statically through the same application.

Key Features

    Efficiency: Simplifies managing multiple coins in merged mining.
    Insights: Provides miners and operators with essential mining statistics.
    Customizability: The modular architecture supports adding new coins or customizing features.
    Accessibility: The browser-based dashboard ensures ease of access.
