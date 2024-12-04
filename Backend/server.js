const WebSocket = require('ws');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const PORT = process.env.PORT || 5000;


const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws) => {
	console.log(`Client connected`);

	// Code to handle incoming messages
	ws.on('message', (data) => {
		data = JSON.parse(data)

		// Broadcast the message to all clients
		wss.clients.forEach((client) => {
			if ((client !== ws) && (client.readyState === WebSocket.OPEN)) {
				client.send(JSON.stringify(data));
			}
		});

	});

	ws.on('close', () => {
		console.log(`Client disconnected`);
	});
});
