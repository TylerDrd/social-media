import aws from 'aws-sdk'
import dotenv from 'dotenv'
import crypto from 'crypto'
import { promisify } from 'util'
const randomBytes = promisify(crypto.randomBytes)
dotenv.config()

const region = "ap-south-1"
const bucketName = process.env.S3_BUCKET_NAME
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion:'v4'
})

export async function generateUploadURL(contentType){
    
    const rawBytes = await randomBytes(16)
    const imageName = rawBytes.toString('hex')

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60, // amount of time in seconds for the user to use this url. after which she will have to request new temporary url
        // ContentType: contentType
    })


    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    return uploadURL
}