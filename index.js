const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/dataBase');

const app = express();

// Routes
const UserRoute = require('./routes/UserRoute');


dotenv.config();
connectDB();


app.use(express.json());

app.use('/api/users', UserRoute);


app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
