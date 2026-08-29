const express = require('express');
const { errorHandler } = require('./middleware/errorHandler');
const userRoutes = require('./routes/userRoutes');
const newsRoutes = require('./routes/newsRoutes');

const app = express();

app.use(express.json());

app.use('/users', userRoutes);
app.use('/news', newsRoutes);

app.use(errorHandler);

module.exports = app;
