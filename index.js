console.log('Loading function');

const aws = require('aws-sdk');
const nodemailer = require('nodemailer');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const ses = new aws.SES({ region: 'eu-west-1' });

exports.handler = async (event, context, callback) => {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    console.log(`Retrieve Object : ${key} in the bucket ${bucket}`);
    const s3Object = await s3.getObject(params, function (err) {
        if (err) {
            console.log(`Error in ${context.functionName} : ${err}`);
            callback(err);
        }
    }).promise();
    
    console.log(`Object retrieved : ${s3Object.Body}`);
    const mailOptions = {
        from: 'toto@test.com',
        subject: 'This is an email sent from a Lambda function!',
        html: '<p>This is a test</p>',
        to: 'toto@test.com',
        attachments: [
            {
                filename: key.replace(/^.*[\\\/]/, ''),
                content: s3Object.Body.toString('utf-8'),
            }
        ],
    };
    
    const transporter = nodemailer.createTransport({
        SES: ses
    });
    
    console.log('Send email');
    await transporter.sendMail(mailOptions).then(data => {
        console.log('email submitted to SES', data);
        callback(null, 'Success');
    }).catch(err => {
        console.log(`Error in ${context.functionName} : ${err}`);
        callback(err);
    });
};
