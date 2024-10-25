const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/dataBase');



dotenv.config();
connectDB();

const app = express();
app.use(express.json());



app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
