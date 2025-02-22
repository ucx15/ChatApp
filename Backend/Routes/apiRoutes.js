/*
  API Routes
  This file contains the routes for the api/
*/

const router = require('express').Router();

const userController = require('../Controllers/userController');
const roomController = require('../Controllers/roomController');


router.get('/', (req, res) => {
	console.log("GET: /api/");
	res.json({message: "Hellew from ChatApp API"});
});

// User Routes
// TODO: change fething requests to GET requests, auth by JWT
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/user-rooms', userController.fetchRooms);

// Room Routes
router.post('/room/make', roomController.makeRoom);
router.post('/room/join', roomController.joinRoom);
router.post('/room/leave', roomController.leaveRoom);

// WARN: remove in production
router.post('/room/all', roomController.fetchAllRooms);
router.post('/room/members', roomController.fetchMembers);
router.post('/room/messages', roomController.fetchMessages); // TODO: use WebSocket
// router.post('/room/send', roomController.addMessage);     // TODO: use WebSocket


module.exports = router;
