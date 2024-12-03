const express = require('express');
const dotenv = require('dotenv');

dotenv.config({path: '.env.local'});


PORT = process.env.PORT || 5000;


const app = express();

app.get('/', (req, res) => {
	  res.send('Hello World');
});

app.listen(PORT, () => {
	  console.log(`Backend listening on http://localhost:${PORT}`);
});
