/*
  Default Routes
  This file contains the routes for the /
*/

const router = require('express').Router();

router.get('/', (req, res) => {
	res.json({ message: "Heluu from ChatApp Backend" });
});
router.get('*', (req, res) => {
	console.log("ERROR: No Route for  GET: ", req.url);
	res.status(404).json({ message: "404: Not Found" });
});

module.exports = router;
