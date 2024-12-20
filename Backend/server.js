const WebSocket = require('ws');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');


dotenv.config({ path: '.env.local' });
const PORT = process.env.PORT || 5000;


const clients = [];


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