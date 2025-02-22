const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true }, // Username
	password: { type: String, required: true },               // Hashed Password
	name: { type: String, default: "" },                      // Display Name
	rooms: { type: Array, default: [] },	                  // Array of room IDs
});


const User = mongoose.model("User", userSchema);


// Database Abstraction Layer

// Create a new user. Returns the created user.
const createUser = async (username, password) => {
	const user = new User({
		username,
		password,
		rooms: [],
	});
	return await user.save();
}

// Find a user by username. Returns null if not found.
const findUser = async (username) => {
	return await User.findOne({ username });
};

// Add a room to a user's rooms. Returns the updated user.
const joinRoom = async (username, roomID) => {
	const user = await User
		.findOne({ username })
		.updateOne({ $push: { rooms: roomID } });
	return user;
}

const leaveRoom = async (username, roomID) => {
	const user = await User
		.findOne
		({ username })
		.updateOne({ $pull: { rooms: roomID } });
	return user;
}

// Get a user's room. Returns an [] if not found.
const fetchRooms = async (username) => {
	const user = User.findOne({ username })
	return !user.rooms ? [] : user.rooms;
};

module.exports = { User, createUser, findUser, joinRoom, leaveRoom, fetchRooms };
