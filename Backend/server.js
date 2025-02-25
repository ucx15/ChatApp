const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const mongoose = require('mongoose');
// const sqlite = require('sqlite3').verbose();
const cors = require('cors');
const dotenv = require('dotenv');

const { v4: uuidv4 } = require('uuid');

const apiRoutes = require("./Routes/apiRoutes");
const defaultRoutes = require("./Routes/defaultRoutes");

// const RoomModel = require("./Models/Room.js");
// const roomController = require("./Controllers/roomController.js");


dotenv.config();
// dotenv.config({ path: '.env.local' });
// dotenv.config({ path: '.env.production' });

const PORT = process.env.PORT;
// const DATABASE = process.env.DATABASE || 'test.db';
const MONGO_URI = process.env.MONGO_URI;


// Database Connection
mongoose.connect(MONGO_URI)
	.then(() => console.log('DB: Connected to MongoDB'))
	.catch(err => console.error('DB Connection Error:', err));


// const db = new sqlite.Database(DATABASE);


// function generateTables() {
// 	const query = `
// 	CREATE TABLE IF NOT EXISTS messages (
// 		id INTEGER PRIMARY KEY AUTOINCREMENT,
// 		uuid TEXT NOT NULL,

// 		sender TEXT NOT NULL,
// 		receiver TEXT NOT NULL,
// 		content TEXT,
// 		timestamp INTEGER NOT NULL
// 	);`;

// 	db.run(query, (err) => {
// 		if (err) {
// 			console.log("Error creating table");
// 			console.error(err);
// 		}
// 	});

// }
// generateTables();


// function fetchMessagesfromDB(callback) {
// 	const query = `select * from messages;`;

// 	db.all(query, (err, rows) => {
// 		if (err) {
// 			console.error(`Error fetching messages ${err}`);
// 			return callback([])
// 		}

// 		else {
// 			console.log("FETCHED all messages");
// 			return callback(rows);
// 		}
// 	});

// }

// function addMessagetoDB(msg, receiver) {
// 	const query = `INSERT INTO messages ( uuid, sender, receiver, content, timestamp) VALUES ( ?, ?, ?, ?, ? )`;

// 	const msg_uuid = uuidv4();
// 	console.log(msg);

// 	db.run(query, msg_uuid, msg.sender, receiver, msg.content, msg.timestamp, (err) => {
// 		if (err) {
// 			console.log(`Error inserting message ${msg}`);
// 			console.error(err);
// 		}
// 		else {
// 			console.log("Message Saved to DB");
// 		}
// 	});

// }

// function _constructMessage(data) {
// 	return {
// 		sender: data.sender,
// 		content: data.content,
// 		timestamp: data.timestamp
// 	}
// }


// Express Setup
const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());


// Routing
app.use('/api', apiRoutes);
app.use('/', defaultRoutes);


// HTTP Server
const server = http.createServer(app);

server.listen(PORT, () => {
	console.log(`HTTP Server @ http://localhost:${PORT}`);
});


// WebSocket Server

const wss = new WebSocket.Server({ server });

// Array to store connected clients
let clients = [];

wss.on('connection', (ws) => {

	// Generate and send a unique client ID to Client
	const clientId = uuidv4();
	clients.push({ id: clientId, ws });

	ws.send(JSON.stringify({ type: 'hello', id: clientId }));
	console.log(`Client connected: ${clientId}`);

	// TODO: Send saved messages to client
	// NOTE: Currently using SQLite3 but migrate to MongoDB

	// const messages = await RoomModel.getRoomMessages(roomID);
	// socket.emit('room_messages', messages);

	// fetchMessagesfromDB((msgs) => {
	// 	if (msgs) {
	// 		msgs.forEach((msg) => {
	// 			msg = _constructMessage(msg);
	// 			msg.type = "message";
	// 			let msgString = JSON.stringify(msg);

	// 			clients.forEach((client) => {
	// 				client = client.ws;
	// 				if ((client.readyState === WebSocket.OPEN)) {
	// 					client.send(msgString);
	// 				}
	// 			});

	// 		})
	// 	}

	// });

	// Code to handle incoming messages
	ws.on('message', (data) => {
		data = JSON.parse(data)
		data.type = 'message';

		// TODO: Save the message to DB, currently using SQLite3 but migrate to MongoDB
		// addMessagetoDB(data, "any");
		// await RoomModel.addMessageToRoom(roomID, username, message);


		// Broadcast the message to all clients
		clients.forEach((client) => {
			client = client.ws;
			if ((client !== ws) && (client.readyState === WebSocket.OPEN)) {
				client.send(JSON.stringify(data));
			}
		});

	});

	ws.on('close', () => {
		console.log(`Client disconnected: ${clientId}`);
		clients = clients.filter(client => client.id !== clientId);
	});

	ws.on('error', (error) => {
		console.error(`WebSocket error for client ${clientId}:`, error);
	});
});


// TODO: Authenticate WS connections

// NOTE: Currently using ws id as client id, but need to implement a user based system
// TODO: implement a user based message system
