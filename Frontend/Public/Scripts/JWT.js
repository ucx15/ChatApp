// Handle JWT Related Functions


async function refreshAccessToken() {
	const refreshToken = LS_getRefreshToken();
	const username = LS_getUsername();

	if (!(refreshToken && username)) {
		console.error("ERROR: Missing Refresh Token or Username");
		return false;
	}

	try {
		const res = await fetch(`http://${BACKEND_URL}:${BACKEND_PORT}/api/refresh-token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ refreshToken, username })
		})

		const data = await res.json();
		console.log(`refreshAccessToken() -> '${data.status}' : ${data.message}`);

		if (res.ok) {
			LS_setAccessToken(data.accessToken);
			return true;
		}

		return false;
	}

	catch (error) {
		console.error('ERROR: Cannot refresh access token:', error);
		return false;
	};
}
