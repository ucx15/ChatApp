/*
  API Routes
  This file contains the routes for the api/
*/

const router = require('express').Router();

const userController = require('../Controllers/userController');
const roomController = require('../Controllers/roomController');
const authController = require('../Controllers/authController');


router.get('/', (req, res) => {
	console.log("GET: /api/");
	res.json({ message: "Hellew from ChatApp API" });
});

// User Routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/refresh-token', authController.refreshAccessToken);

// Room Routes
// TODO: rename /room/x  ->  /chat/x
router.post('/user-rooms', authController.authorize, userController.fetchRooms);
router.post('/room/make', authController.authorize, roomController.makeRoom);
router.post('/room/join', authController.authorize, roomController.joinRoom);
router.post('/room/leave', authController.authorize, roomController.leaveRoom);

// WARN: remove in production
router.post('/room/all', authController.authorize, roomController.fetchAllRooms);
router.post('/room/members', authController.authorize, roomController.fetchMembers);
router.post('/room/messages', authController.authorize, roomController.fetchMessages); // TODO: use WebSocket
// router.post('/room/send',authController.authorize, roomController.addMessage);     // TODO: use WebSocket


module.exports = router;

// TODO: change fething requests to GET requests

