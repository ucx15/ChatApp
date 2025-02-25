if (LS_getUsername()) {
	window.location.href = '/app.html';
}


// HTML elements
const formAuth = document.querySelector('#auth-form');
const inputUser = document.querySelector('#input-username');
const inputPass = document.querySelector('#input-password');


// Event listeners
formAuth.addEventListener('submit', function (event) {
	event.preventDefault();

	const username = inputUser.value.trim();
	const password = inputPass.value.trim();

	// Validation
	if (!username || !password) {
		alert('Please fill in both fields.');
		return;
	}

	fetch(`http://${BACKEND_URL}:${BACKEND_PORT}/api/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username: username,
			password: password
		})
	})
		.then(response => response.json())
		.then(data => {
			if (data.status === "success") {
				LS_setAccessToken(data.accessToken);
				LS_setRefreshToken(data.refreshToken);
				LS_setUsername(username);

				window.location.href = '/app.html';
			}

			else {
				alert('Login failed: ' + data.message);
			}
		})

		.catch(error => {
			console.error('Error:', error);
			alert('An error occurred. Please try again.');
		});
});


// TODO: combine login.js and register.js into auth.js and refactor