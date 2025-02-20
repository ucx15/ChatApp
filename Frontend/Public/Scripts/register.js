const inputForm = document.querySelector('#auth-form');
const inputUsername = document.querySelector('#input-username');
const inputPassword = document.querySelector('#input-password');
const inputCnfPassword = document.querySelector('#input-cnf-password');


console.log(inputForm);
console.log(inputPassword);
console.log(inputCnfPassword);


inputForm.addEventListener('submit', event => {
	event.preventDefault();

	const username    = inputUsername.value;
	const password    = inputPassword.value;
	const cnfPassword = inputCnfPassword.value;

	console.log(username);
	console.log(password);
	console.log(cnfPassword);


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
