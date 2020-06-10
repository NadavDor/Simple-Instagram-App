const express = require('express');
const appRoueter= require('./routes/appRoueter');
const morgan = require('morgan');

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