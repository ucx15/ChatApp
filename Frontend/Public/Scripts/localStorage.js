// Getters
function LS_getAccessToken() {
	return localStorage.getItem('accessToken');
}
function LS_getRefreshToken() {
	return localStorage.getItem('refreshToken');
}
function LS_getUsername() {
	return localStorage.getItem('username');
}


// Setters
function LS_setAccessToken(token) {
	localStorage.setItem('accessToken', token);
}
function LS_setRefreshToken(token) {
	localStorage.setItem('refreshToken', token);
}
function LS_setUsername(username) {
	localStorage.setItem('username', username);
}


// Clear tokens
function LS_clearTokens() {
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
}
function LS_clearUsername() {
	localStorage.removeItem('username');
}
