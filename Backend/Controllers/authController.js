const jwt = require('jsonwebtoken');

require('dotenv').config();


const genToken = (username, type='access') => {
	console.log(`\tGenerating ${type} token for '${username}'`);

	if (!(username && username.trim())) {
		console.error("ERROR:\t'authController.genToken()' -> Missing required parameters");
		return;
	}

	let tokenSecret = process.env.ACCESS_TOKEN_SECRET;
	let tokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;

	if (type === 'refresh') {
		tokenSecret = process.env.REFRESH_TOKEN_SECRET;
		tokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;
	}
	else if (type !== 'access') {
		console.error(`ERROR:\t'authController.genToken()' -> Invalid token type. Expected 'access' or 'refresh' but got '${type}'`);
		return;
	}

	return jwt.sign(
		{ username },
		tokenSecret,
		{ expiresIn: tokenExpiry }
	);
}

const genTokenPair = (username) => {
	console.log(`AUTH:\tGenerating Token Pair (Access - Refresh) for '${username}'`);

	if (!(username && username.trim())) {
		console.error("ERROR:\t'authController.genToken()' -> Missing required parameters");
		return;
	}

	const accessToken = jwt.sign(
		{ username },
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
	);

	const refreshToken = jwt.sign(
		{ username },
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
	);

	return { accessToken, refreshToken };
}

const refreshAccessToken = (req, res) => {
	console.log("AUTH:\tRefreshing Access Token");

	const refreshToken = req.body.refreshToken
	const username = req.body.username

	if (!(refreshToken && username)) {
		console.error("ERROR: Missing Refresh Token or Username");
		return res.status(401).json({ message: "Refresh Token not provided", status: "error" });
	}

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err) {
			if (err.name === "TokenExpiredError") {
				console.error("WARN:\tRefresh Token expired");
				return res.status(403).json({ message: "Refresh Token expired", status: "error" });
			}

			else {
				console.error("WARN:\tInvalid Access Token");
				return res.status(403).json({ message: "Invalid Access Token", status: "error" });
			}
		}


		if (user.username !== username.trim()) {
			console.error(`WARN:\tUsername mismatch\tExprected:'${username}'  Provided:'${user.username}'`);
			return res.status(403).json({ message: "Unauthorized", status: "error" });
		}

		const newAccessToken = genToken(user.username);
		console.log(`New Access Token: generated for '${user.username}'`);
		res.json({ message: "New token generated!", status: "success", accessToken: newAccessToken })
	})
}

const authorize = (req, res, next) => {
	console.log(`AUTH:\tAuthorizing ${req.method} request to ${req.originalUrl}`);

	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		console.error("ERROR: Missing token");
		return res.status(401).json({ message: "Unauthorized", status: "error" });
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) {
			if (err.name === "TokenExpiredError") {
				console.error("WARN:\tAccess Token expired");
				return res.status(403).json({ message: "Access Token expired", status: "error" });
			}
			else {
				console.error("WARN:\tInvalid Access Token");
				return res.status(403).json({ message: "Invalid Access Token", status: "error" });
			}
		}

		req.USER = user.username
		next();
	});
}

module.exports = { genToken, genTokenPair, refreshAccessToken, authorize };
