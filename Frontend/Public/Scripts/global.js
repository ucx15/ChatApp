// Global variables
const BACKEND_HOST = window.location.hostname;

let BACKEND_PORT = 80;
if (BACKEND_HOST === "localhost") {
	BACKEND_PORT = 5000;
}

const BACKEND_URI = `http://${BACKEND_HOST}:${BACKEND_PORT}`;
const WS_BACKEND_URI = `ws://${BACKEND_HOST}:${BACKEND_PORT}`;

const RECONNECT_DELAY = 5000; // ms
const MAX_RECONNECT_ATTEMPTS = 10;
