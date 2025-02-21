const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});



const User = mongoose.model("User", userSchema);


// Database Abstraction Layer
const createUser = async (username, password) => {
	const user = new User({ username, password });
	return await user.save();
}

const findUser = async (username) => {
	return await User.findOne({ username });
};

const getUserContacts = async (username) => {
	return await User.findOne({ username }).contacts;
};

module.exports = { User, createUser, findUser, getUserContacts };
