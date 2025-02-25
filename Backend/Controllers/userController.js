const bcrypt = require("bcrypt");
const UserModel = require("../Models/User");

const authController = require("./authController");


const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);


const signup = async (req, res) => {
	console.log('\nPOST: /api/signup');

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
			return res.status(409).json({ message: `User:'${username}' already exists!`, status: "error" });
		}

		// Create new user
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

		await UserModel.createUser(username, hashedPassword);

		const { accessToken, refreshToken } = authController.genTokenPair(username);

		console.log(`user:'${username}' signed up.`);
		res.json({ message: `user:'${username}' signed up successfully.`, status: "success", accessToken, refreshToken });

	}
	catch (error) {
		console.error('ERROR: Cannot create user:', error);
		res.status(500).json({ error: "Database error" });
	}
};

const login = async (req, res) => {
	console.log('\nPOST: /api/login');

	try {
		const { username, password } = req.body;

		if (!username || !password || !username.trim() || !password.trim()) {
			console.error(`ERROR: Missing REQUIRED fields  username:'${username}' password:'${password}'`);
			return res.status(400).json({ message: `Missing REQUIRED fields  username:'${username}' password:'${password}')`, status: "error" });
		}

		const user = await UserModel.findUser(username);
		if (!user) {
			console.error(`ERROR:  User:'${username}' not found`);
			return res.status(404).json({ message: "User not found", status: "error" });
		}

		if ( !(await bcrypt.compare(password, user.password)) ) {
			console.error(`ERROR:  Invalid Password for user '${username}'`);
			return res.status(401).json({ message: `Invalid Password for user '${username}'`, status: "error" });
		}

		// const accessToken = authController.genToken(username, 'access');
		// const refreshToken = authController.genToken(username, 'refresh');

		const { accessToken, refreshToken } = authController.genTokenPair(username);

		console.log(`\t'${username}' logged in.`);
		res.json({
			message: "Login success!",
			status: "success",
			accessToken,
			refreshToken
		});
	}

	catch (error) {
		console.error('ERROR: Cannot Login:', error);
		res.status(500).json({ error: "Database error" });
	}
};

const logout = async (req, res) => {
	console.log('\nPOST: /api/logout');
	// TODO: Implement logout
	// NOTE: Can be implemented by removing the refresh token from the database
}

const fetchRooms = async (req, res) => {
	console.log('\nPOST: /api/rooms');

	try {
		const { username } = req.body;

		if (!username.trim()) {
			console.error(`ERROR: Missing REQUIRED fields  username:'${username}'`);
			res.status(400).json({ message: `Missing REQUIRED fields  username:'${username}'`, status: "error" });
			return;
		}

		const rooms = await UserModel.fetchRooms(username);
		res.json({ rooms, status: "success" });
	}
	catch (error) {
		console.error('ERROR: Cannot fetch rooms:', error);
		res.status(500).json({ error: "Database error" });
	}
};

const addRoom = async (req, res) => {
	console.log('\nPOST: /api/addRoom');

	try {
		const { username, roomID } = req.body;

		if (!username.trim() || !roomID.trim()) {
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

module.exports = { signup, login, logout, fetchRooms, addRoom };

// TODO: When logging in or signing up, save refresh token in user's document in the database
