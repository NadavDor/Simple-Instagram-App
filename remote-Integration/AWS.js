const s3 = require('../config/s3.config.js');
const s3Credentials = require('../config/credentials.js');
const s3Client = s3.s3Client;

var imagesIdCounter = undefined

// download images from AWS s3 bucket
exports.download = (async (req, res) => {
    
    images = await getImagesFromS3()
    images = images.Contents

    // update the number of images value on first loadup
    if(!imagesIdCounter) imagesIdCounter = images.length

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
    console.log('images keys: ' + imageKeys)

    res.render('index', {table: urls})
})

// upload images from AWS s3 bucket
exports.upload = (async (req, res) => {
  imagesIdCounter += 1

  const uParams = s3.uploadParams;
  
  uParams.Key = `${imagesIdCounter}-${req.file.originalname}`
  uParams.Body = req.file.buffer;
  uParams.StorageClass = 'STANDARD'
  uParams.Metadata = {
    'upload-date': new Date().toString(),
  },
    
  s3Client.upload(uParams, (err, data) => {
    if (err) {
      res.status(500).json({error:"Error in uplaod: " + err});
    }
    res.redirect('/');
  })

  // balance the storage classes to fit 20/80 ratio
  balaceStorageClasses()
})


async function balaceStorageClasses(){
  let images = await getImagesFromS3()
  images = images.Contents
  
  let imageToMove = undefined 
  let stdClassCount = 0
  images.forEach(image => {
    if (image.StorageClass === 'STANDARD'){
      imageToMove = image
      stdClassCount += 1
    }
  })

  let std_Ia_Ratio = stdClassCount / images.length
  if (stdClassCount === 0 || std_Ia_Ratio < 1/4) return

  //we use the copy function to change the image's storage class 
  let cParams = s3.copyParams
  cParams.Key = imageToMove.Key
  cParams.CopySource = `${cParams.Bucket}/${imageToMove.Key}`
  cParams.StorageClass = 'STANDARD_IA'
  
  await s3Client.copyObject(cParams, function(err, data) {
    if (err) console.log(err, err.stack);  // error
    else     console.log('image copy - ', imageToMove.Key ); // deleted
  }).promise();
}

async function getImagesFromS3() {
  const params = s3.downloadParams
  let images = await s3Client.listObjectsV2({ Bucket: params.Bucket }).promise()
  return images
}
