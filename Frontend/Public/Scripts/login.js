const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', function(event) {
	event.preventDefault();

	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	// Perform validation
	if (username === '' || password === '') {
		alert('Please fill in both fields.');
		return;
	}

	// Simulate login request
	const loginData = {
		username: username,
		password: password
	};

	console.log('Logging in with:', loginData);

	// Here you would typically send a request to your server
	// Example using fetch:
	/*
	fetch('/api/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(loginData)
	})
	.then(response => response.json())
	.then(data => {
		if (data.success) {
			// Redirect to another page or show success message
			window.location.href = '/dashboard.html';
		} else {
			alert('Login failed: ' + data.message);
		}
	})
	.catch(error => {
		console.error('Error:', error);
		alert('An error occurred. Please try again.');
	});
	*/
});
