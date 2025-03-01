const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
	id: { type: String, required: true, unique: true },   // Room ID
	name: { type: String, required: true, unique: true }, // Room Name
	admin: { type: String, required: true },               // Admin username

	timestamp: { type: Date, default: Date.now }, // Timestamp of the room creation

	users: [{ type: String }], // List of users in the room
	messages: [{
		sender: { type: String, required: true },     // Username of the sender
		content: { type: String, required: true },    // The message content
		timestamp: { type: Date, default: Date.now }, // Timestamp of the message
	},],
});

const Room = mongoose.model("Room", roomSchema);

// Database Abstraction Layer

const createRoom = async (roomID, username) => {
	const room = new Room({
		id: roomID,
		name: roomID,
		admin: username,
		users: [username],
		messages: [],
	});
	return await room.save();
}

const joinRoom = async (roomID, username) => {
	return await Room.findOneAndUpdate(
		{ id: roomID },
		{ $push: { users: username } }
	);
}

const leaveRoom = async (roomID, username) => {
	return await Room.findOneAndUpdate(
		{ id: roomID },
		{ $pull: { users: username } }
	);
}

const findRoom = async (roomID) => {
	return await Room.findOne({ id: roomID });
}


const fetchAllRooms = async () => {
	return await Room.find();
}

const addMessage = async (roomID, message) => {
	return await Room.findOneAndUpdate(
		{ id: roomID },
		{ $push: { messages: message } }
	);
}

module.exports = { Room, createRoom, findRoom, joinRoom, leaveRoom, fetchAllRooms, addMessage };
