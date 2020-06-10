const express = require('express');
const appRouter = express.Router();
let upload = require('../config/multer.config.js');
const awsWorker = require('../controllers/aws.controller.js');

// router.get('/', (req, res)=>{
//     res.render('index', {msg: message});
// });

// home page
appRouter.get('/', awsWorker.download);

appRouter.post('/upload', upload.single("file"), awsWorker.doUpload);
 
module.exports = appRouter;