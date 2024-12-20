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
let CLIENT_ID = null;  // fetched from the server
const BACKEND_URL = window.location.hostname || "localhost";
const BACKEND_PORT = 5000;
const SOCKET = new WebSocket(`ws://${BACKEND_URL}:${BACKEND_PORT}`);


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
	if (msg.sender === CLIENT_ID) {
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
	inputText.value = "";
}
function sendMsgtoServer(msg) {
	console.log("EVENT: Sending message");

	// TODO: Send message to the server using the WebSocket
	SOCKET.send(msg.toJSONString());
}
function sendMsg() {
	// construct the message object
	const text = inputText.value.trim();
	if (!text) return null

	const msg = new Message(
		CLIENT_ID,
		text,
		Date.now());

	// process the message
	addMsgtoChat(msg)
	sendMsgtoServer(msg);
	inputText.focus();
}


// <------ Event Listeners ------>

// UI
document.addEventListener('keydown', (event) => {
	// Automatically focus on the text input when typing starts
	if (document.activeElement !== inputText && event.key.length === 1) {
		inputText.focus();
	}
});

// Network
SOCKET.addEventListener("open", (ev) => {

	inputText.addEventListener('keyup', function (event) {
		if (event.key === "Enter") sendMsg()
	});

	buttonSend.addEventListener('click', sendMsg);
});

SOCKET.addEventListener("message", (ev) => {
	console.log("EVENT: Message received");
	const data = JSON.parse(ev.data);
	console.log(data);

	switch (data.type) {

		case 'hello':
			CLIENT_ID = data.id;
			break;

		case 'message':
			addMsgtoChat(Message.fromJSON(data));
			break;

		default:
			console.warn(`Unknown message type ${data.type}`);
	}
});
