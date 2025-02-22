const RoomModel = require("../Models/Room");
const UserModel = require("../Models/User");


const makeRoom = async (req, res) => {
	console.log("POST: /api/room/make");

	try {
		const { username } = req.body;

		if (!username || !username.trim()) {
			console.error(`ERROR: Missing REQUIRED fields  username:'${username}'`);
			return res.status(400).json({ message: `ERROR: Missing REQUIRED fields  username:'${username}'`, status: "error" });
		}

		const roomID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

		await RoomModel.createRoom(roomID, username);

		// Add the user to the room
		await RoomModel.joinRoom(roomID, username);
		await UserModel.joinRoom(username, roomID);

		console.log(`\tUser '${username}' created room '${roomID}'`);
		res.json({ message: `Room:'${roomID}' creation success`, status: "success" });
	}
	catch (error) {
		console.error("ERROR:\Failed to create room", error);
		res.status(500).json({ error: "Database error" });
	}
};

const joinRoom = async (req, res) => {
	console.log("POST: /api/room/join");

	try {
		const { roomID, username } = req.body;

		if (!username || !username.trim() || !roomID || !roomID.trim()) {
			console.error(`ERROR: Missing REQUIRED fields  username:'${username}' roomID:'${roomID}'`);
			return res.status(400).json({ message: `ERROR: Missing REQUIRED fields  username:'${username}' roomID:'${roomID}'`, status: "error" });
		}

		const room = await RoomModel.findRoom(roomID);

		if (!room) {
			console.error(`ERROR: Room '${roomID}' not found`);
			return res.status(404).json({ message: `Room '${roomID}' not found`, status: "error" });
		}

		if (room.users.includes(username)) {
			console.error(`ERROR: User '${username}' already in room '${roomID}'`);
			return res.status(409).json({ message: `User '${username}' already in room '${roomID}'`, status: "error" });
		}

		await RoomModel.joinRoom(roomID, username);
		await UserModel.joinRoom(username, roomID);

		console.log(`\tUser '${username}' joined room '${roomID}'`);
		res.json({ message: `Room:'${roomID}' join success`, status: "success" });
	}
	catch (error) {
		console.error("ERROR:\Failed to join room", error);
		res.status(500).json({ error: "Database error" });
	}
};

const leaveRoom = async (req, res) => {
	console.log("POST: /api/room/leave");

	try {
		const { roomID, username } = req.body;

		if (!username || !username.trim() || !roomID || !roomID.trim()) {
			console.error(`ERROR: Missing REQUIRED fields  username:'${username}' roomID:'${roomID}'`);
			return res.status(400).json({ message: `ERROR: Missing REQUIRED fields  username:'${username}' roomID:'${roomID}'`, status: "error" });
		}

		const room = await RoomModel.findRoom(roomID);

		if (!room) {
			console.error(`ERROR: Room '${roomID}' not found`);
			return res.status(404).json({ message: `Room '${roomID}' not found`, status: "error" });
		}

		if (!room.users.includes(username)) {
			console.error(`ERROR: User '${username}' not in room '${roomID}'`);
			return res.status(409).json({ message: `User '${username}' not in room '${roomID}'`, status: "error" });
		}

		await RoomModel.leaveRoom(roomID, username);
		await UserModel.leaveRoom(username, roomID);

		console.log(`\tUser '${username}' left room '${roomID}'`);
		res.json({ message: `Room:'${roomID}' leave success`, status: "success" });
	}
	catch (error) {
		console.error("ERROR:\Failed to leave room", error);
		res.status(500).json({ error: "Database error" });
	}
};

const fetchAllRooms = async (req, res) => {
	console.log("POST: /api/room/all");

	try {
		const rooms = await RoomModel.fetchAllRooms();
		res.json({ rooms, status: "success" });
	}
	catch (error) {
		console.error("ERROR:\Failed to fetch all rooms", error);
		res.status(500).json({ error: "Database error" });
	}
};

const fetchMembers = async (req, res) => {
	console.log("POST: /api/room/members");

	try {
		const { roomID } = req.body;

		if (!roomID || !roomID.trim()) {
			console.error(`ERROR: Missing REQUIRED fields  roomID:'${roomID}'`);
			return res.status(400).json({ message: `Missing REQUIRED fields  roomID:'${roomID}'`, status: "error" });
		}

		const room = await RoomModel.findRoom(roomID);

		if (!room) {
			console.error(`ERROR: Room '${roomID}' not found`);
			return res.status(404).json({ message: `Room '${roomID}' not found`, status: "error" });
		}

		res.json({ members: room.users, status: "success" });
	}
	catch (error) {
		console.error("ERROR:\Failed to fetch members", error);
		res.status(500).json({ error: "Database error" });
	}
};

const fetchMessages = async (req, res) => {
	console.log("POST: /api/room/messages");

	try {
		const { roomID } = req.body;

		if (!roomID || !roomID.trim()) {
			console.error(`ERROR: Missing REQUIRED fields  roomID:'${roomID}'`);
			return res.status(400).json({ message: `Missing REQUIRED fields  roomID:'${roomID}'`, status: "error" });
		}

		const room = await RoomModel.findRoom(roomID);

		if (!room) {
			console.error(`ERROR: Room '${roomID}' not found`);
			return res.status(404).json({ message: `Room '${roomID}' not found`, status: "error" });
		}

		res.json({ messages: room.messages, status: "success" });
	}
	catch (error) {
		console.error("ERROR:\Failed to fetch messages", error);
		res.status(500).json({ error: "Database error" });
	}
};

const addMessage = async (msg, roomID) => {
	try {
		await RoomModel.addMessage(roomID, msg);
	}
	catch (error) {
		console.error("ERROR:\Failed to add message", error);
	}
};

module.exports = {makeRoom, joinRoom, leaveRoom, fetchAllRooms, fetchMembers, fetchMessages, addMessage};
