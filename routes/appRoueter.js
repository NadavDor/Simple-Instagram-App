const express = require('express');
const appRouter = express.Router();
let upload = require('../config/multer.config.js');
const AWS = require('../controllers/AWS.js');

// gets to html home page with 8 2 lines of pictures.
appRouter.get('/', AWS.download);

// posts a new picutre in our S3 bucket.
appRouter.post('/upload', upload.single("file"), AWS.doUpload);
 
module.exports = appRouter;