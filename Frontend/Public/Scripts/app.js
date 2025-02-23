class Message {
	constructor(sender, content, timestamp) {
		this.sender = sender;
		this.content = content;
		this.timestamp = timestamp;
	}

	static fromJSON(obj) {
		return new Message(obj.sender, obj.content, obj.timestamp);
	}

	toJSON() {
		return {
			sender: this.sender,
			content: this.content,
			timestamp: this.timestamp
		};
	}

	toJSONString() {
		return JSON.stringify(this.toJSON());
	}
}


// Global variables
const BACKEND_URL = window.location.hostname || "localhost";
const BACKEND_PORT = 5000;
const RECONNECT_DELAY = 3000; // ms
const MAX_RECONNECT_ATTEMPTS = 5;
// const USER = localStorage.getItem('user') || "Anonymous";

let reconnectAttempts = 0;
let socket = null;
let clientID = null;  // fetched from the server


// HTML elements
const divMsgs = document.getElementById("messages-container");
const buttonSend = document.getElementById('sender-btn');
const inputText = document.getElementById('sender-field');

var sidebar = document.getElementById('sidebar');
var chatarea = document.getElementById('chatarea');
var sbToggleImg = document.getElementById('sb-toggle-img');

var burgerIconPath = "./Res/icons/menu-burger.svg";
var crossIconPath = "./Res/icons/cross.svg";

function toggleSidebar() {
	let view = sidebar.dataset.expanded;

	if (view == "true") {
		sidebar.dataset.expanded = "false";
		sbToggleImg.src = burgerIconPath;
	}

	else {
		sidebar.dataset.expanded = "true";
		sbToggleImg.src = crossIconPath;
	}
}

function scrollMsgsToBottom() {
	divMsgs.scrollTop = divMsgs.scrollHeight;
}

// Message Functions
function addMsgtoChat(msg) {
	const msgContent = msg.content;

	if (!msgContent) {
		return;
	}

	// HTML elements
	let divContainer = document.createElement('div');
	let divSender = document.createElement('div');
	let divContent = document.createElement('div');
	let divTime = document.createElement('div');

	// Set the content of the elements
	divSender.innerHTML = msg.sender;
	divContent.innerHTML = msg.content;
	divTime.innerHTML = new Date(msg.timestamp).toLocaleTimeString();

	// Add classes to the elements
	divContainer.classList.add('message');
	if (msg.sender === clientID) {
		divContainer.classList.add('outgoing-msg');
	}
	else {
		divContainer.classList.add('incoming-msg');
	}

	divSender.classList.add('msg-sender');
	divContent.classList.add('msg-content');
	divTime.classList.add('msg-time');

	// Append the elements to the message container
	divContainer.appendChild(divSender);
	divContainer.appendChild(divContent);
	divContainer.appendChild(divTime);

	divMsgs.appendChild(divContainer);
	scrollMsgsToBottom();
}

function sendMsgtoServer(msg) {
	console.log("EVENT: Sending message");

	// TODO: Send message to the server using the WebSocket
	socket.send(msg.toJSONString());
}

function sendMsg() {
	// construct the message object
	const text = inputText.value.trim();
	if (!text) return null

	const msg = new Message(
		clientID,
		text,
		Date.now());

	// process the message
	addMsgtoChat(msg)
	sendMsgtoServer(msg);
	inputText.focus();
	inputText.value = "";
}


// <------ Event Listeners ------>

// UI
document.addEventListener('keydown', (event) => {
	// Automatically focus on the text input when typing starts
	if (document.activeElement !== inputText && event.key.length === 1) {
		inputText.focus();
	}
});


inputText.addEventListener('keyup', function (event) {
	if (event.key === "Enter") sendMsg()
});

buttonSend.addEventListener('click', sendMsg);



// Network

function wsConnection() {
	socket = new WebSocket(`ws://${BACKEND_URL}:${BACKEND_PORT}`);

	socket.addEventListener("open", (ev) => {
	});

	socket.addEventListener("message", (ev) => {
		console.log("EVENT: Message received");
		const data = JSON.parse(ev.data);
		console.log(data);

		switch (data.type) {

			case 'hello':
				clientID = data.id;
				break;

			case 'message':
				addMsgtoChat(Message.fromJSON(data));
				break;

			default:
				console.warn(`Unknown message type ${data.type}`);
		}
	});

	socket.addEventListener("error", (ev) => {
		// TODO: Display error message in GUI and make it unusable 💀
		console.error("WebSocket error:", ev);

	});

	socket.addEventListener("close", (ev) => {
		// TODO: Display connection closed error in GUI 😊
		// alert("Connection to the chat server has been closed. Please refresh the page to reconnect.");
		console.log("WebSocket connection closed. Trying to reconnect", ev);

		// Reconnect
		if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
			console.error("Maximum reconnection attempts reached. Please refresh the page to reconnect.");
			return;
		}
		setTimeout(() => wsConnection(), RECONNECT_DELAY);

	});
}

// Initial WS Connection
wsConnection();


// TODO: save logged in user details in the local storage
// TODO: Fetch user chats from the server
// TODO: Message delivery status to be implemented
// TODO: Server connection status to be displayed in the UI, and reconnection attempts
// TODO: messages sent after disconnection to be sent to the server after reconnection
