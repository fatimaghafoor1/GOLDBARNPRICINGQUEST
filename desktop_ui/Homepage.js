const goldPrice = document.getElementById("gold-cost");
const silverPrice = document.getElementById("silver-cost");

const goldSignal = document.getElementById("gold-signal");
const silverSignal = document.getElementById("silver-signal");

const accuracy = document.getElementById("accuracy-metric");
const error = document.getElementById("error-metric");
const samples = document.getElementById("samples-metric");

const metal = document.getElementById("asset-select");
const amount = document.getElementById("asset-amount");
const currency = document.getElementById("currency-select");
const total = document.getElementById("conversion-display");

const table = document.getElementById("table-body");
const refresh = document.getElementById("polling-rate-select");

let gold = 4216.40;
let silver = 4207.46;

let range = "1w";
let history = [];
let timer = null;

const rates = {
    AED: 3.67,
    GBP: 0.79,
    CAD: 1.37,
    EUR: 0.92
};

const chart = document.getElementById("historicalTrends");
const graph = new Chart(chart.getContext("2d"), {
    type: "line",

    data: {
        labels: [],

        datasets: [
            {
                label: "Gold",
                data: [],
                borderColor: "#b89b5e",
                backgroundColor: "transparent",
                borderWidth: 2,
                pointRadius: 2,
                tension: 0.2
            },
            {
                label: "Silver",
                data: [],
                borderColor: "#777777",
                backgroundColor: "transparent",
                borderWidth: 2,
                pointRadius: 2,
                tension: 0.2
            }
        ]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                position: "top"
            }
        },

        scales: {
            x: {
                grid: {
                    display: false
                }
            },

            y: {
                beginAtZero: false
            }
        }
    }
});


function updateTotal() {
    const type = metal.value;
    const weight = parseFloat(amount.value) || 0;
    const money = currency.value;

    const price = type === "gold" ? gold : silver;
    const result = price * weight * rates[money];

    const symbols = {
        AED: "Dhs ",
        GBP: "£",
        CAD: "$",
        EUR: "€"
    };

    total.innerText = symbols[money] + result.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


let lastGoldSignal = "";
let lastSilverSignal = "";


function updateSignals(goldStatus, silverStatus) {

    goldSignal.innerText = goldStatus;
    goldSignal.className = "signal-badge " + goldStatus.toLowerCase();

    silverSignal.innerText = silverStatus;
    silverSignal.className = "signal-badge " + silverStatus.toLowerCase();


    if (goldStatus !== "HOLD" && goldStatus !== lastGoldSignal) {

        if (Notification.permission === "granted") {
            new Notification("Gold update", {
                body: "Gold trend changed to: " + goldStatus
            });
        }

        lastGoldSignal = goldStatus;
    }


    if (silverStatus !== "HOLD" && silverStatus !== lastSilverSignal) {

        if (Notification.permission === "granted") {
            new Notification("Silver update", {
                body: "Silver trend changed to: " + silverStatus
            });
        }

        lastSilverSignal = silverStatus;
    }
}


function updateGraph() {

    let data = history;

    if (range === "1w") {
        data = history.slice(-7);
    }

    if (range === "1m") {
        data = history.slice(-15);
    }

    if (range === "6m") {
        data = history.slice(-30);
    }


    graph.data.labels = data.map(item => item.time);

    graph.data.datasets[0].data =
        data.map(item => item.gold);

    graph.data.datasets[1].data =
        data.map(item => item.silver);

    graph.update();


    table.innerHTML = "";

    [...data].reverse().forEach(item => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td><b>${item.time}</b></td>
            <td>$${item.gold.toFixed(2)}</td>
            <td>$${item.silver.toFixed(2)}</td>
            <td>
                <span class="signal-badge ${item.signal.toLowerCase()}">
                    ${item.signal}
                </span>
            </td>
        `;

        table.appendChild(row);
    });
}


async function getPrices() {

    try {

        const response =
            await fetch("http://localhost:5000/pricesGandS");

        const data = await response.json();


        gold = data["pax-gold"].usd;
        silver = data["tether-gold"].usd;


        const goldStatus =
            data["gold-prediction-signal"] || "HOLD";

        const silverStatus =
            data["silver-prediction-signal"] || "HOLD";


        const stats = data["ml-performance-metrics"];

        accuracy.innerText =
            stats["accuracy-pct"].toFixed(1) + "%";

        error.innerText =
            stats["mape-error"].toFixed(2) + "%";

        samples.innerText =
            stats["training-samples"];


        goldPrice.innerText =
            gold.toLocaleString(undefined, {
                minimumFractionDigits: 2
            });

        silverPrice.innerText =
            silver.toLocaleString(undefined, {
                minimumFractionDigits: 2
            });


        updateSignals(goldStatus, silverStatus);

        updateTotal();


        const time = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });


        history.push({
            time: time,
            gold: gold,
            silver: silver,
            signal: goldStatus
        });


        if (history.length > 50) {
            history.shift();
        }


        updateGraph();

    } catch (err) {

        console.log("Could not connect: " + err.message);

    }
}


function startTimer() {

    if (timer) {
        clearInterval(timer);
    }

    const time = parseInt(refresh.value) || 4000;

    timer = setInterval(getPrices, time);
}


metal.addEventListener("change", updateTotal);

amount.addEventListener("input", updateTotal);

currency.addEventListener("change", updateTotal);

refresh.addEventListener("change", startTimer);


document.querySelectorAll(".btn").forEach(button => {

    button.addEventListener("click", function() {

        document.querySelectorAll(".btn").forEach(item => {
            item.classList.remove("active");
        });

        this.classList.add("active");

        range = this.getAttribute("data-range");

        updateGraph();
    });
});


if (Notification.permission === "default") {
    Notification.requestPermission();
}


getPrices();
startTimer();