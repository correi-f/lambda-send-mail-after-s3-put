## Lambda AWS Sending an email when a file is created in a bucket

#### First you need to download the dependency nodemailer

```
npm install
```
Then zip files and directory as below :
- index.js
- package.json
- node-modules

Upload it to AWS and give to your Lambda roles as below :
- Allow: ses:SendEmail
- Allow: ses:SendRawEmail
- Allow: s3:GetObject

Give to your lambda a S3 Trigger with PUT trigger
- Event type: ObjectCreatedByPut

Before testing your lambda by putting a file on your bucket, make sure that the email in your code is identified by Amazon.
Go to the section Email Addresses in Simple Email Service