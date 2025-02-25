// Handle JWT Related Functions


async function refreshAccessToken() {
	const refreshToken = LS_getRefreshToken();
	const username = LS_getUsername();

	if (!(refreshToken && username)) {
		console.error("ERROR: Missing Refresh Token or Username");
		return false;
	}

	fetch(`http://${BACKEND_URL}:${BACKEND_PORT}/api/refresh-token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ username: username, refreshToken: refreshToken })
	})
		.then(response => response.json())
		.then(data => {
			if (data.status === "success") {
				console.error('ERROR: Cannot refresh access token:', data.message);
				return false;
			}

			LS_setAccessToken(data.accessToken);
			LS_setRefreshToken(data.refreshToken);
			return true;
		})
		.catch(error => {
			console.error('ERROR: Cannot refresh access token:', error);
			return false;
		});
}
