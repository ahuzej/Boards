const AWS = require("aws-sdk");

function AwsFileUploader() {}
AwsFileUploader.prototype.upload = async (file, key) => {
  let s3 = new AWS.S3();

  let params = {
    Bucket: "boards-files",
    Body: file.buffer,
    ContentType: file.mimetype,
    Key: key,
    ACL: "public-read",
  };
  await s3.putObject(params).promise();
  let url = `${process.env.AWS_CLOUDFRONT_URL}${key}`;
  return url;
};

module.exports = {
  current: new AwsFileUploader(),
};
