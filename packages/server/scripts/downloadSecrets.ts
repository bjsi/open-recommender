import AWS from "aws-sdk";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});

const localFilePath = "../../accounts.db";

var s3 = new AWS.S3();
const file = fs.createWriteStream(localFilePath);
const params = { Bucket: "twitter-accounts-open-rec", Key: "accounts.db" };
s3.getObject(params).createReadStream().pipe(file);
