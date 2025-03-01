if ( ! LS_getUsername()) {
	window.location.href = './login.html';
}

if ( !LS_getRefreshToken() ) {
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
	LS_clearUsername();
	window.location.href = './login.html';
}


// HTML elements
const divMsgs = document.getElementById("messages-container");
const buttonSend = document.getElementById('sender-btn');
const inputText = document.getElementById('sender-field');

const usernameHeading = document.querySelector('#username-heading');

const searchContainer = document.querySelector('#search-container');
const searchField = document.querySelector('#input-ux-search');
const searchBtn = document.querySelector('#btn-side-search');
const btnLogout = document.querySelector('#logout-btn');


const chatsContainer = document.querySelector('#chats-container');
const channelsContainer = document.querySelector('#channels-container');

const mainContentContainer = document.querySelector('#main-content-container')

const btnNewChat = document.querySelector('#btn-new-chat');
const btnNewChannel = document.querySelector('#btn-new-channel');

const chatArea = document.getElementById('chatarea');


var sidebar = document.getElementById('sidebar');
var sbToggleImg = document.getElementById('sb-toggle-img');

var burgerIconPath = "./Res/icons/menu-burger.svg";
var crossIconPath = "./Res/icons/cross.svg";


function getUSER() {
	return LS_getUsername();
}
const USER = getUSER();

let reconnectAttempts = 0;
let SOCKET = null;
let socketID = null;  // fetched from the server

let currentActiveChat = null;
let currentActiveChannel = null;

let isMainContentVisible = true;
let isChatAreaVisible = false;


// <------ Switch Chats/Channels ------>

// TODO: Collapse sidebar on mobile view when a chat is selected
function switchChat(chatID) {
	if ( isMainContentVisible ) {
		isMainContentVisible = false;
		mainContentContainer.classList.toggle('HIDE-ELEMENT');
	}

	if ( !isChatAreaVisible ) {
		isChatAreaVisible = true;
		chatArea.classList.toggle('HIDE-ELEMENT');
	}

	if (currentActiveChat == chatID) {
		return;
	}

	const currentChatDOM = document.querySelector(`#chat-${currentActiveChat}`);
	if (currentChatDOM) {
		currentChatDOM.classList.toggle('SELECT-CONTACT');
	}

	currentActiveChat = chatID;
	const chatElement = document.querySelector(`#chat-${chatID}`);
	chatElement.classList.add('SELECT-CONTACT');

	// TODO: change chat area header name
	resetChatArea();

	// Tell server that client selected current chat
	if (SOCKET.readyState !== WebSocket.OPEN) {
		console.error("ERROR: Socket is not open. Unable to send message.");
		newWSConnection();
	}

	SOCKET.send(JSON.stringify(
		{
			type:'join-chat',
			chatID,
			username: USER,
		}
	));
}


function switchChannel() {
	// TODO: To be implemented
}



// <------ UI Updaters ------>
function resetUI() {
	// set ui to inital
	if (!isMainContentVisible) {
		isMainContentVisible = true;
		mainContentContainer.classList.toggle('HIDE-ELEMENT');
	}

	if (isChatAreaVisible) {
		isChatAreaVisible = false;
		chatArea.classList.toggle('HIDE-ELEMENT');
	}


	if (currentActiveChat) {

		const currentChatDOM = document.querySelector(`#chat-${currentActiveChat}`);

		console.log(currentChatDOM);
		currentChatDOM.classList.toggle('SELECT-CONTACT');
		console.log(currentChatDOM);

	}

	currentActiveChat = null;
}

function resetChatArea() {
	divMsgs.innerHTML = "";
}

function addNewChattoUI(chatID) {
	const chatHTML = `
		<div class="contact" id="chat-${chatID}" data-chat-id="${chatID}" onclick="switchChat('${chatID}')">
			<img src="./Res/icons/comment.svg" class="icon-img" alt="">
			<p> ${chatID}</p>
		</div>`

	chatsContainer.insertAdjacentHTML('afterbegin', chatHTML);
	// chatsContainer.innerHTML = chatHTML + chatsContainer.innerHTML;
}


// <------ UI Handlers ------>
async function handleFetchUserChats() {
	const res = await fetch(`${BACKEND_URI}/api/user-rooms`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${LS_getAccessToken()}`
		},
		body: JSON.stringify({ username: USER })
	});

	const data = await res.json();
	console.log(`handleFetchUserChats() -> '${data.status}' : ${data.message}`);

	if (res.ok) {
		data.rooms.forEach((room) => {
			addNewChattoUI(room);
		});
		return;
	}

	else if (res.status === 403) {
		if (await refreshAccessToken()) {
			handleFetchUserChats();
		}
	}
}

// TODO: To be implemented
async function handleFetchUserChannels() {}


async function handleNewChat() {
	try {
		const res = await fetch(`${BACKEND_URI}/api/room/make`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${LS_getAccessToken()}`
			},
			body: JSON.stringify({ username: USER })
		});

		const data = await res.json();
		console.log(`HandleNewChat() -> '${data.status}' : ${data.message}`);

		if (res.ok) {
			addNewChattoUI(data.roomID);
			return;
		}

		else if (res.status === 403) {
			if (await refreshAccessToken()) {
				handleNewChat();
			}
		}
	}

	catch (err) {
		console.error(err);
	};

}

// TODO: To be implemented
async function handleNewChannel() {}



// <------ UI Functions ------>
function setUsernameHeading() {
	usernameHeading.innerHTML = LS_getUsername();
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
	if (SOCKET.readyState !== WebSocket.OPEN) {
		console.error("ERROR: Socket is not open. Unable to send message.");
		return false;
	}
	SOCKET.send(JSON.stringify(
		{
			type:'message',
			msg,
			room: currentActiveChat,
		}
	));
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

	// reset layout when escape key is pressed
	if (event.key === "Escape") {
		resetUI();
	}
});

inputText.addEventListener('keyup', function (event) {
	if (event.key === "Enter") sendMsg()
});


buttonSend.addEventListener('click', sendMsg);

btnLogout.addEventListener('click', logout);


// TODO: Switch to new room created
btnNewChat.addEventListener('click', handleNewChat);

btnNewChannel.addEventListener('click', handleNewChannel);


// Network
function newWSConnection() {
	if ( SOCKET ) {
		SOCKET.close();
	}

	SOCKET = new WebSocket(WS_BACKEND_URI);
}

function wsHandle() {
	SOCKET.addEventListener("open", (ev) => {
		SOCKET.send(JSON.stringify(
			{
				type: 'hello',
				username: USER,
				accessToken: LS_getAccessToken()
			}
		));
	});

	SOCKET.addEventListener("message", (ev) => {
		console.log("EVENT: Message received");
		const data = JSON.parse(ev.data);
		console.log(data);

		switch (data.type) {

			case 'hello':
				socketID = data.id;
				break;

			case 'message':
				addMsgtoChat(Message.fromJSON(data.msg));
				break;

			case 'error':
				if (data.message === "Invalid Access Token") {
					console.warn("WARN: Invalid Access Token. refreshing the token.");
					if ( refreshAccessToken() ) {
						newWSConnection();
					}
				}
				break;

			default:
				console.warn(`Unknown message type ${data.type}`);
		}
	});

	SOCKET.addEventListener("error", (ev) => {
		// TODO: Display error message in GUI and make it unusable 💀
		console.error("WebSocket error:", ev);

	});

	SOCKET.addEventListener("close", (ev) => {
		// TODO: Display connection closed error in GUI 😊
		// alert("Connection to the chat server has been closed. Please refresh the page to reconnect.");
		console.log("WebSocket connection closed. Trying to reconnect", ev);

		// Reconnect
		if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
			console.error("Maximum reconnection attempts reached. Please refresh the page to reconnect.");
			return;
		}
		reconnectAttempts++;
		setTimeout(() => {
			newWSConnection();
			wsHandle();
		}, RECONNECT_DELAY);

	});
}

function wsHandleReconnect() {
	// TODO: to be implemented
}


// Control Flow
setUsernameHeading();

handleFetchUserChats();
handleFetchUserChannels();


newWSConnection();
wsHandle();



// TODO: Send JWT "accessToken" in ws messages also

// TODO: Fetch user chats from the server
// TODO: Message delivery status to be implemented
// TODO: Server connection status to be displayed in the UI, and reconnection attempts
// TODO: messages sent after disconnection to be sent to the server after reconnection

// TODO: Rename "ChatApp" to something more awesome!🙂