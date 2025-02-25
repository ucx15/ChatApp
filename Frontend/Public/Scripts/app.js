if (LS_getUsername() == "") {
	window.location.href = './login.html';
}

if (LS_getRefreshToken() == "") {
	window.location.href = './login.html';
}

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


function logout() {
	LS_clearTokens();
	LS_setUsername("");
	window.location.href = './login.html';
}


// HTML elements
const divMsgs = document.getElementById("messages-container");
const buttonSend = document.getElementById('sender-btn');
const inputText = document.getElementById('sender-field');

const btnLogout = document.querySelector('#logout-btn');
const usernameHeading = document.querySelector('#username-heading');
var sidebar = document.getElementById('sidebar');
var chatarea = document.getElementById('chatarea');
var sbToggleImg = document.getElementById('sb-toggle-img');

var burgerIconPath = "./Res/icons/menu-burger.svg";
var crossIconPath = "./Res/icons/cross.svg";


const USER = LS_getUsername();

let reconnectAttempts = 0;
let socket = null;
let socketID = null;  // fetched from the server


// <------ UI Functions ------>
function setUserName() {
	usernameHeading.innerHTML = USER;
}

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



// <------ Message Functions ------>
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
	if (msg.sender === USER) {
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
	if (socket.readyState !== WebSocket.OPEN) {
		console.error("ERROR: Socket is not open. Unable to send message.");
		return false;
	}
	socket.send(msg.toJSONString());
	return true;
}

function sendMsg() {
	// construct the message object
	const text = inputText.value.trim();
	if (!text) return null

	const msg = new Message(
		USER,
		text,
		Date.now());

	if (!sendMsgtoServer(msg)) {
		// TODO: process the unsent message queue
		console.error(`ERROR: Unable to send ${msg}`);
	}

	addMsgtoChat(msg)

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

btnLogout.addEventListener('click', logout);


// Network
function wsConnection() {
	socket = new WebSocket(`ws://${BACKEND_URL}:${BACKEND_PORT}`);

	socket.addEventListener("open", (ev) => {
		socket.send(JSON.stringify({ type: 'hello', username: USER }));
	});

	socket.addEventListener("message", (ev) => {
		console.log("EVENT: Message received");
		const data = JSON.parse(ev.data);
		console.log(data);

		switch (data.type) {

			case 'hello':
				socketID = data.id;
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


// Control Flow
setUserName();
wsConnection();


// TODO: Send JWT "accessToken" in all requests
// TODO: Send JWT "accessToken" in ws messages also

// TODO: Fetch user chats from the server
// TODO: Message delivery status to be implemented
// TODO: Server connection status to be displayed in the UI, and reconnection attempts
// TODO: messages sent after disconnection to be sent to the server after reconnection

// TODO: Rename "ChatApp" to something more awesome!🙂