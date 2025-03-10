// Global variables
const BACKEND_HOST = window.location.hostname;

let BACKEND_PORT = "";
let PROTOCOL1 = "https";
let PROTOCOL2 = "wss";

if (BACKEND_HOST === "localhost" || BACKEND_HOST.startsWith("192.168.")) {
	BACKEND_PORT = ":5000";
	PROTOCOL1 = "http";
	PROTOCOL2 = "ws";
}

const BACKEND_URI    = `${PROTOCOL1}://${BACKEND_HOST}${BACKEND_PORT}`;
const WS_BACKEND_URI = `${PROTOCOL2}://${BACKEND_HOST}${BACKEND_PORT}/ws`;

const RECONNECT_DELAY = 5000; // ms
const MAX_RECONNECT_ATTEMPTS = 10;
