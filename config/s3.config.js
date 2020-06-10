const AWS = require('aws-sdk');
const env = require('./credentials.js');
 
const s3Client = new AWS.S3({
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region : env.REGION
});
 
const uploadParams = {
         Bucket: env.Bucket, 
         Key: '', // pass key
         Body: null, // pass file body
};

const downloadParams = {
  Bucket: env.Bucket
}
 
const s3 = {};
s3.s3Client = s3Client;
s3.uploadParams = uploadParams;
s3.downloadParams = downloadParams;
 
module.exports = s3;