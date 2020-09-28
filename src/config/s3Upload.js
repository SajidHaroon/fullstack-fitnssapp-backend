// installed  npm i aws-sdk multer-s3. Since we have used multer for image upload, we will use multer also uploading images to AWS. For  this we need above command.
// then made new file s3Upload.js in backend>config just to make an other middleware where we basically did confiurations for s3 like access credentials and bucket info etc. for handling uploads


const aws = require ('aws-sdk')
const multer = require ('multer')
const multerS3 = require('multer-s3')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

const s3 = new aws.S3({
    accessKeyId : process.env.ACCESS_KEY_ID,                        // Like we did before in server.js line 14
    secretAccessKey : process.env.SECRET_ACCESS_KEY
})


// Now we use multer suggesting where to store these and how file names should be. metadata info
// Handling the upload

module.exports = multer ({
    storage: multerS3({
        s3: s3,
        bucket: "fullstack-fitness-app",
        metadata: function(req, file, cb) {
            cb (null, {fieldName: file.fieldname})
        },
        key: function (req, file, cb) {                                             // we can get same file name and extension from upload.js, line 9 - 14
            // Browser API handle files
            const ext = path.extname(file.originalname)
            // We keep filename and extension as original
            const name = path.basename(file.originalname, ext)
            // String interpolation to replace spaces and return without spaces, and add data and extension
            cb(null, `${name.replace(/\s/g, "")}-${Date.now()}${ext}`)

        }
    })
})

// After this we'll update the routes