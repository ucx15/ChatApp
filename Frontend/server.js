const express = require('express');
const path = require('path');


require("dotenv").config();
const PORT = process.env.PORT || 3000;


const app = express();


app.use(express.static(path.join(__dirname, 'Public')));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
