const AWS = require('aws-sdk');
const s3Credentials = require('./credentials.js');
 
const s3Client = new AWS.S3({
    accessKeyId: s3Credentials.AWS_ACCESS_KEY,
    secretAccessKey: s3Credentials.AWS_SECRET_ACCESS_KEY,
  region : s3Credentials.REGION
});
 
const downloadParams = {
  Bucket: s3Credentials.Bucket
}

const uploadParams = {
         Bucket: s3Credentials.Bucket, 
         Key: '', 
         Body: null,
};

const s3 = {};
s3.s3Client = s3Client;
s3.uploadParams = uploadParams;
s3.downloadParams = downloadParams;
 
module.exports = s3;