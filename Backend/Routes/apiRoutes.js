/*
  API Routes
  This file contains the routes for the api/
*/

const router = require('express').Router();

const userController = require('../Controllers/userController');


router.get('/', (req, res) => {
	console.log("GET: /api/");
	res.json({message: "Hellew from ChatApp API"});
});

router.post('/signup', userController.userSignup);
router.post('/login', userController.userLogin);


module.exports = router;
