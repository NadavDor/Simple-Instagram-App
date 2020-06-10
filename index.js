const express = require('express');
const morgan = require('morgan');
const appRoueter= require('./routes/home');

app = express();
app.set('view engine', 'ejs');

// add middleware to the app
// use morgan for logging requests
app.use(morgan('tiny'));

// Routers
app.use('/', appRoueter);

// start listening for requests
const port = process.env.PORT || 3000;
app.listen(port, ()=>{console.log(`listening on port ${port}`)});