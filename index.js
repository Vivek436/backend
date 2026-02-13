const express = require('express');
const userRouter = require('./Router/userRoutes')
const connectDB = require('./DB/UserDb')
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();
connectDB();
app.use(cors(
  {
    origin: 'http://localhost:5173',
    credentials: true,
  }
));
app.use(cookieParser());
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/users', userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});