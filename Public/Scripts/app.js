var msgContainer = document.getElementById("messages-container");
var senderField = document.getElementById('sender-field');
var sidebar = document.getElementById('sidebar');
var chatarea = document.getElementById('chatarea');
var sbToggle = document.getElementById('sb-toggle');

var dateObj = new Date();


function toggleSidebar() {
	let view = sidebar.dataset.expanded;

	if (view == "true") {
		sidebar.dataset.expanded = "false";
		// sbToggle.innerHTML = "<img src='./Res/icons/menu-burger.svg' class='icon-img' id='sb-toggle-img'>";
		sbToggle.style.backgroundImage = "url(./Res/icons/menu-burger.svg)";
	}

	else {
		sidebar.dataset.expanded = "true";
		// sbToggle.innerHTML = "<img src='./Res/icons/cross.svg' class='icon-img' id='sb-toggle-img'>";
		sbToggle.style.backgroundImage = "url(./Res/icons/angle-up.svg)";
	}
}


function scrollMsgsToBottom() {
	msgContainer.scrollTop = msgContainer.scrollHeight;
}

function getCurrentTime() {
	return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function sendMsg() {
	let msgContent = senderField.value;

	if (!msgContent) {
		return;
	}

	let newMsg = document.createElement('li');

	let msgSenderDiv = document.createElement('div');
	let msgContentDiv = document.createElement('div');
	let msgTimeDiv = document.createElement('div');

	let currentTimestamp = getCurrentTime();

	msgContentDiv.innerHTML = msgContent;
	msgTimeDiv.innerHTML = currentTimestamp

	newMsg.classList.add('message');
	newMsg.classList.add('outgoing-msg');

	msgSenderDiv.classList.add('msg-sender');
	msgContentDiv.classList.add('msg-content');
	msgTimeDiv.classList.add('msg-time');

	newMsg.appendChild(msgSenderDiv);
	newMsg.appendChild(msgContentDiv);
	newMsg.appendChild(msgTimeDiv);


	msgContainer.appendChild(newMsg);
	scrollMsgsToBottom();
	senderField.value = "";
}


// Test function to add random messages
function addRandomMessages(count) {
	let messages = [
		'Hello, how are you?',
		'I am fine, thank you.',
		'What are you doing?',
		'Nothing much, just chilling.',
		'How is the weather today?',
		'It is very hot today.',
		'What are you doing tomorrow?',
		'I have a meeting tomorrow.',
		'What about you?',
		'I am going to the beach tomorrow.',
		'Nice, have fun!',
		'Thanks!',
		'Goodbye!',
		'Goodbye!',
	];

	let sender = "Alfred";
	let time =getCurrentTime();

	for (let i = 0; i < count; i++) {
		let newMsg = document.createElement('li');

		let msgSender = document.createElement('div');
		let msgContent = document.createElement('div');
		let msgTime = document.createElement('div');

		newMsg.classList.add('message');
		if (i % 2 == 0) {
			newMsg.classList.add('outgoing-msg');
		} else {
			newMsg.classList.add('incoming-msg');
			msgSender.innerHTML = sender;
		}

		msgContent.innerHTML = messages[i];
		msgTime.innerHTML = time;

		msgSender.classList.add('msg-sender');
		msgContent.classList.add('msg-content');
		msgTime.classList.add('msg-time');

		newMsg.appendChild(msgSender);
		newMsg.appendChild(msgContent);
		newMsg.appendChild(msgTime);

		msgContainer.appendChild(newMsg);
	}
	scrollMsgsToBottom();
}

scrollMsgsToBottom();
addRandomMessages(10);
