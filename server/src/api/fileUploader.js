var AWS = require('aws-sdk');
var S3 = require('aws-sdk/clients/s3');

const fetch = require("node-fetch");
const region = 'eu-central-1';
console.log(S3);
function AwsFileUploader() {

}
AwsFileUploader.prototype.upload = async (file) => {
    const v3Client = new S3({ region });
    //Create an S3RequestPresigner object
    const signer = new S3RequestPresigner({ ...v3Client.config });
    // Create request
    const request =
        await createRequest(
            v3Client,
            new PutObjectCommand({ Key: 'blabla', Bucket: 'boards-files' })
        );
    // Define the duration until expiration of the presigned URL
    let signedUrl = formatUrl(await signer.presign(request, -1));
    let response = await fetch(signedUrl, {
        method: "PUT",
        headers: {
            "content-type": "application/octet-stream",
        },
        body: file.buffer,
    });
    console.log(response);
    /*let params = { Bucket: 'boards-files', Body: file.buffer, ContentType: file.mimetype, Key: 'blabla' };
    let url = await s3.getSignedUrlPromise('putObject', params);
    let putObjectPromise = await s3.putObject(params).promise();
    console.log(putObjectPromise)
    console.log(url)*/
    return url;
}

module.exports = {
    current: new AwsFileUploader()
};