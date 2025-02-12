const WebSocket = require('ws');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const sqlite = require('sqlite3');


dotenv.config({ path: '.env.local' });
const PORT = process.env.PORT || 5000;
const DATABASE = process.env.DATABASE || 'test.db';


const clients = [];
const db = new sqlite.Database(DATABASE);


function generateTables() {
	const query = `
	CREATE TABLE IF NOT EXISTS messages (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		uuid TEXT NOT NULL,

		sender TEXT NOT NULL,
		reciever TEXT NOT NULL,
		data TEXT,
		timestamp TEXT NOT NULL
	)`;

	db.run(query, (err) => {
		if (err) {
			console.log("Error creating table");
			console.error(err);
		}
	});

}
generateTables();


function insertMessage(msg, reciever) {
	const query = `INSERT INTO messages ( uuid, sender, reciever, data, timestamp) VALUES ( ?, ?, ?, ?, ? )`;

	const msg_uuid = uuidv4();
	console.log(msg);
	console.log(query);

	db.run(query, msg_uuid, msg.sender, reciever, msg.content, msg.timestamp, (err) => {
		if (err) {
			console.log(`Error inserting message {msg}`);
			console.error(err);
		}
		else {
			console.log("Message Saved to DB");
		}
	});

}


const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws) => {

	// TODO: Replace it with persistent storage

	// Generate and send a unique client ID to Client
	const clientId = uuidv4();
	clients.push({id: clientId, ws});

	ws.send(JSON.stringify({type: 'hello', id: clientId}));
	console.log(`Client connected: ${clientId}`);


	// Code to handle incoming messages
	ws.on('message', (data) => {
		data = JSON.parse(data)
		data.type = 'message';

		insertMessage(data, "any");

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
	});
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);