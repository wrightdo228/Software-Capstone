const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const config = new aws.Config({
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: 'us-east-2',
});

const s3 = new aws.S3(config);

const upload = multer({
    storage: multerS3({
        s3,
        bucket: 'capstone-images',
        acl: 'public-read',
        metadata(req, file, cb) {
            cb(null, { fieldName: 'TESTING_META_DATA!' });
        },
        key(req, file, cb) {
            cb(null, Date.now().toString());
        },
    }),
});

module.exports = upload;
