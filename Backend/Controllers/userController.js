const bcrypt = require("bcrypt");
const UserModel = require("../Models/User");


const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);


const signup = async (req, res) => {
	console.log('POST: /api/signup');

	try {
		const { username, password } = req.body;
		if (!username || !password || !username.trim() || !password.trim()) {
			console.error(`ERROR: Missing REQUIRED fields  username:'${username}' password:'${password}'`);
			res.status(400).json({ message: `Missing REQUIRED fields  username:'${username}' password:'${password}')`, status: "error" });
			return;
		}

		const user = await UserModel.findUser(username);
		// Check if user already exists
		if (user) {
			console.error(`ERROR:\tUser:'${username}' already exists in the database`);
			res.status(409).json({ message: `User:'${username}' already exists!`, status: "error" });
		}

		// Create new user
		else {
			const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

			await UserModel.createUser(username, hashedPassword);
			console.log(`user:'${username}' signup success.`);
			res.json({ message: `user:'${username}' signup success.`, status: "success" });
		}
	}
	catch (error) {
		console.error('ERROR: Cannot create user:', error);
		res.status(500).json({ error: "Database error" });
	}
};

const login = async (req, res) => {
	console.log('POST: /api/login');

	try {
		const { username, password } = req.body;

		if (!username || !password || !username.trim() || !password.trim()) {
			console.error(`ERROR: Missing REQUIRED fields  username:'${username}' password:'${password}'`);
			res.status(400).json({ message: `Missing REQUIRED fields  username:'${username}' password:'${password}')`, status: "error" });
			return;
		}

		const user = await UserModel.findUser(username);

		if (user) {
			if (await bcrypt.compare(password, user.password)) {
				console.log(`\t'${username}' Loggedin`);
				res.json({ message: "Login success!", status: "success" });
			}
			else {
				console.error(`ERROR:  Invalid Password for user '${username}'`);
				res.status(401).json({ message: `Invalid Password for user '${username}'`, status: "error" });
			}
		}
		else {
			console.error(`ERROR:  User '${username}' not found`);
			res.status(404).json({ message: "User not found", status: "error" });
		}
	}
	catch (error) {
		console.error('ERROR: Cannot Login:', error);
		res.status(500).json({ error: "Database error" });
	}
};

const fetchRooms = async (req, res) => {
	console.log('POST: /api/rooms');

	try {
		const { username } = req.body;

		if ( !username.trim() ) {
			console.error(`ERROR: Missing REQUIRED fields  username:'${username}'`);
			res.status(400).json({ message: `Missing REQUIRED fields  username:'${username}'`, status: "error" });
			return;
		}

		const rooms = await UserModel.fetchRooms(username);
		res.json({rooms, status: "success"});
	}
	catch (error) {
		console.error('ERROR: Cannot fetch rooms:', error);
		res.status(500).json({ error: "Database error" });
	}
};

const addRoom = async (req, res) => {
	console.log('POST: /api/addRoom');

	try {
		const { username, roomID } = req.body;

		if ( !username.trim() || !roomID.trim() ) {
			console.error(`ERROR: Missing REQUIRED fields  username:'${username}' roomID:'${roomID}'`);
			res.status(400).json({ message: `Missing REQUIRED fields  username:'${username}' roomID:'${roomID}'`, status: "error" });
			return;
		}

		// TODO: Check if user is already in the room
		

		await UserModel.joinRoom(username, roomID);
		console.log(`Room '${roomID}' added to user:'${username}'`);
		res.json({ message: `Room '${roomID}' added to user:'${username}'`, status: "success" });
	}
	catch (error) {
		console.error('ERROR: Cannot add room:', error);
		res.status(500).json({ error: "Database error" });
	}
}

module.exports = { signup, login, fetchRooms, addRoom};
