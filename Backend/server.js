const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const mongoose = require('mongoose');

const cors = require('cors');
const dotenv = require('dotenv');

const { v4: uuidv4 } = require('uuid');

const apiRoutes = require("./Routes/apiRoutes");
const defaultRoutes = require("./Routes/defaultRoutes");

const authController = require('./Controllers/authController');

const RoomModel = require("./Models/Room.js");
const roomController = require("./Controllers/roomController.js");


dotenv.config();
// dotenv.config({ path: '.env.local' });
// dotenv.config({ path: '.env.production' });

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;


// Database Connection
mongoose.connect(MONGO_URI)
	.then(() => console.log('DB: Connected to MongoDB'))
	.catch(err => console.error('DB Connection Error:', err));


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

// for storing the connected clients
let clients = {};


wss.on('connection', ws => {
	// Generate and send a unique client ID to Client
	const clientId = uuidv4();
	clients[clientId] = { ws, isAuthorized: false, username: null, activeRoom: null };

	ws.send(JSON.stringify({ type: 'hello', id: clientId }));
	console.log(`Client connected: ${clientId}`);

	// Code to handle incoming messages
	ws.on('message', (dataString) => {
		const data = JSON.parse(dataString)

		console.log(data); // Debugging, remove in production

		switch (data.type) {
			// Authentication

			case 'hello': {
				// TODO: impelement more robust authentication system, and token expiry
				// const user = authController.authorizeToken(data.accessToken)

				// if (!user || user !== data.username) {
				// 	ws.send(JSON.stringify(
				// 		{
				// 			type: 'error',
				// 			message: 'Invalid Access Token'
				// 		}
				// 	));
				// 	return;
				// }

				const client = clients[clientId];

				client.isAuthorized = true;
				// client.username = user;
				client.username = data.username;

				console.log(`'${data.username}' is authenticated for WS connection`);
				break;
			}

			case 'join-chat': {
				const client = clients[clientId];

				RoomModel.findRoom(data.chatID)
					.then((room) => {
						if (!room) {
							console.log("Room not found");
							return;
						}

						client.activeRoom = data.chatID;
						console.log(`'WS:\t${client.username}' joined room ${data.chatID}`);

						// Sending all of the prev msgs to client
						room.messages.forEach((msg) => {
							let msgString = JSON.stringify(
								{
									type: 'message',
									msg,
									room: data.chatID
								});

							client.ws.send(msgString);
						});

					});

				break;
			}

			case 'join-channel': {
				// TODO: implement join-channel
				break;

			}

			// Handling messages transfer
			case 'message': {
				if (!clients[clientId].isAuthorized) {
					console.log("Unauthorized Client");
					return;
				}

				// Save message to database
				roomController.addMessage(data.msg, data.room)

				// Broadcast the message to all clients
				const senderClient = clients[clientId];

				Object.values(clients).forEach((recieverClient) => {
					const reClientSock = recieverClient.ws;
					if (
						(reClientSock !== ws) &&
						(reClientSock.readyState === WebSocket.OPEN) &&
						(recieverClient.activeRoom === senderClient.activeRoom)) {
							reClientSock.send(JSON.stringify(data));
						}
				});
				break;
			}

			default: console.log("Unknown message type");
		}

	});

	ws.on('close', () => {
		console.log(`Client disconnected: ${clientId}`);
		delete clients[clientId];
	});

	ws.on('error', (error) => {
		console.error(`WebSocket error for client ${clientId}:`, error);
	});
});


// TODO: Authenticate WS connections
