# Simple-Instagram-App
this is avery simple instagral like app that can upload and download pictures using an AWS S3 bucket.
We balance our files between STANDARD and STANDARD_IA storage classes with a ratio of 20/80 respectivly.
By that we can make the newer files more accessable and mantain cost.

out images key are constructed of an numeral counter, concatenates with the file's name.
In every upload action we check the ration of the storage classes. If it exided out target ratio, we find that oldest picture in our
STANDARD class and move it to the STANDARD_IA. we do it be using the s3.copyObject() method of aws's API.