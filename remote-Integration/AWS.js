const s3 = require('../config/s3.config.js');
const s3Credentials = require('../config/credentials.js');
const s3Client = s3.s3Client;

// download images from AWS s3 bucket
exports.download = (async (req, res) => {
    const params = s3.downloadParams;
    let images = await s3Client.listObjectsV2({ Bucket: params.Bucket }).promise();

    images = images.Contents;
    // sort the images by 'last modified field'
    images.sort(function(a, b) {
        var keyA = new Date(a.LastModified),
          keyB = new Date(b.LastModified);
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });

    // get the keys of the images
    let imageKeys = [];
    for (let i = 0 ; i < images.length ; i++){
        imageKeys.push(images[i].Key);
    }

    // get urls from s3
    let urls = [];
    for (let i = 0 ; i < imageKeys.length ; i++){
        const currUrl = s3Client.getSignedUrl('getObject', {
            Bucket: s3Credentials.Bucket,
            Key: imageKeys[i],
            Expires: 350
        });
        urls.push(currUrl);
    }
    
    console.log("got " + urls.length + " images from the server\n")
    res.render('index', {table: urls});
})

// upload images from AWS s3 bucket
exports.upload = (req, res) => {
  const params = s3.uploadParams;
  
  params.Key = req.file.originalname;
  params.Body = req.file.buffer;
    
  s3Client.upload(params, (err, data) => {
    if (err) {
      res.status(500).json({error:"Error in uplaod:" + err});
    }
    res.redirect('/');
  });
}
