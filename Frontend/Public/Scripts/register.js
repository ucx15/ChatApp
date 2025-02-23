// Global variables
const BACKEND_URL = window.location.hostname || "localhost";
const BACKEND_PORT = 5000;


// HTML elements
const formAuth = document.querySelector('#auth-form');
const inputUser = document.querySelector('#input-username');
const inputPass = document.querySelector('#input-password');
const inputCnfPass = document.querySelector('#input-cnf-password');


// Event listeners
formAuth.addEventListener('submit', function (event) {
	event.preventDefault();

	const username = inputUser.value.trim();
	const password = inputPass.value.trim();
	const passwordcnf = inputCnfPass.value.trim();

	// Perform validation
	if (username === '' || password === '' || passwordcnf === '') {
		alert('Please fill in both fields.');
		return;
	}

	if (password !== passwordcnf) {
		alert('Passwords do not match.');
		return;
	}

	fetch(`http://${BACKEND_URL}:${BACKEND_PORT}/api/signup`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ username: username, password: password })
	})
		.then(response => response.json())
		.then(data => {
			if (data.status === "success") {
				// localStorage.setItem('refreshToken', data.refreshToken);
				// localStorage.setItem('accessToken', data.accessToken);
				localStorage.setItem('username', username);
				window.location.href = '/app.html';
			}

			else {
				alert('Signup failed: ' + data.message);
			}
		})

		.catch(error => {
			console.error('Error:', error);
			alert('An error occurred. Please try again.');
		});
});


// TODO: save the refresh token and access token in local storage
