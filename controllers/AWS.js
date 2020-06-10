const s3 = require('../config/s3.config.js');
const env = require('../config/s3.env.js');
const s3Client = s3.s3Client;

exports.doUpload = (req, res) => {
  const params = s3.uploadParams;
  
  params.Key = req.file.originalname;
  params.Body = req.file.buffer;
    
  s3Client.upload(params, (err, data) => {
    if (err) {
      res.status(500).json({error:"Error -> " + err});
    }

    res.redirect('/');
  });
}

exports.download = (async (req, res) => {
    const params = s3.downloadParams;
    let images = await s3Client.listObjectsV2({
        Bucket: params.Bucket
    }).promise();

    images = images.Contents;
    images.sort(function(a, b) {
        var keyA = new Date(a.LastModified),
          keyB = new Date(b.LastModified);
        // Compare the 2 dates
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });

    const keys = getKeys(images);
    const urls = getUrls(keys);

    console.log("The urls of the images:\n", urls);

  
    res.render('index', {table: urls});
})

function getKeys(images){
    keys = [];
    for (let i = 0 ; i < images.length ; i++){
        keys.push(images[i].Key);
    }

    return keys;
}

function getUrls(keys){
    urls = [];
    const signedUrlExpirationSeconds = 60 * 5;
    for (let i = 0 ; i < keys.length ; i++){
        const url = s3Client.getSignedUrl('getObject', {
            Bucket: env.Bucket,
            Key: keys[i],
            Expires: signedUrlExpirationSeconds
        });
        urls.push(url);
    }
    return urls;
}
