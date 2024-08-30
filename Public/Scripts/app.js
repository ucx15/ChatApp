var msgContainer = document.getElementById("messages-container");
var senderField  = document.getElementById('sender-field');
var sidebar      = document.getElementById('sidebar');
var chatarea     = document.getElementById('chatarea');

function scrollMsgsToBottom() {
	msgContainer.scrollTop = msgContainer.scrollHeight;
}

scrollMsgsToBottom()


function sendMsg() {
	let msgContent = senderField.value;

	if (!msgContent) {
		return;
	}

	let newMsg = document.createElement('li');
	newMsg.classList.add('message');
	newMsg.classList.add('incoming-msg');
	newMsg.innerHTML = msgContent;

	msgContainer.appendChild(newMsg);
	scrollMsgsToBottom();
	senderField.reset();
}
