const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 5000,
  })
  .then((con) => {
    console.log(`MongoDB Database connected with HOST: ${con.connection.host}`);
  })
  .catch((err) => {
    console.log(err);
  });

// Import all routes
const auth = require('./routes/auth');
const post = require('./routes/posts');
const users = require('./routes/user');
app.use('/api/auth', auth);
app.use('/api/posts', post);
app.use('/api/user', users);

const server = app.listen(process.env.PORT || 5050, () => {
  console.log(
    `Server started on Port ${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});

process.on('unhandledRejection', (err) => {
  console.log('shutting down down due to unhandled Rejection in the database');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
