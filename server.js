const express = require('express');
const app = express();
const cors = require('cors');

// import routes
const binanceRoutes = require('./routes/binance.routes');

//use in app
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connect routes

app.use('/api', binanceRoutes);
//not valid endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

//runserver on port 8000
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on Port:', 8000)
});
