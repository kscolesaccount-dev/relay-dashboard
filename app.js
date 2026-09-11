// TODO: replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// DOM elements
const relayStateEl = document.getElementById("relay-state");
const relayToggleBtn = document.getElementById("relay-toggle");
const connectionStatusEl = document.getElementById("connection-status");

// Path in Realtime Database where relay state is stored
// Example: { relay1: "ON" | "OFF" }
const relayRef = db.ref("relay1");

// Listen for relay state changes
relayRef.on(
  "value",
  (snapshot) => {
    const value = snapshot.val();
    if (value === "ON" || value === "OFF") {
      relayStateEl.textContent = value;
      relayToggleBtn.textContent = value === "ON" ? "Turn OFF" : "Turn ON";
    } else {
      relayStateEl.textContent = "Unknown";
      relayToggleBtn.textContent = "Set to ON";
    }
    setConnectionStatus(true);
  },
  (error) => {
    console.error("Error reading relay state:", error);
    setConnectionStatus(false);
  }
);

// Toggle relay on button click
relayToggleBtn.addEventListener("click", async () => {
  try {
    const current = relayStateEl.textContent;
    const next = current === "ON" ? "OFF" : "ON";
    await relayRef.set(next);
  } catch (err) {
    console.error("Error writing relay state:", err);
    setConnectionStatus(false);
  }
});

// Simple connection indicator
function setConnectionStatus(online) {
  if (online) {
    connectionStatusEl.textContent = "Online";
    connectionStatusEl.classList.remove("status-offline");
    connectionStatusEl.classList.add("status-online");
  } else {
    connectionStatusEl.textContent = "Offline";
    connectionStatusEl.classList.remove("status-online");
    connectionStatusEl.classList.add("status-offline");
  }
}
