const puppeteer = require('puppeteer');
const { S3 } = require('aws-sdk');

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

exports.captureScreenshot = async (event, context, callback) => {
  const { url } = JSON.parse(event.body);
  const timestamp = new Date().toISOString();
  const key = `screenshots/${timestamp}.png`;

  // Check if running locally (serverless-offline)
  const isLocal = process.env.IS_LOCAL === 'true';

  // Use the new Headless mode only if running in Lambda environment
  const browser = await puppeteer.launch({ headless: isLocal ? "new" : true });

  const page = await browser.newPage();

  // Set a larger viewport size
  await page.setViewport({ width: 1200, height: 1080 }); // Adjust width and height as needed

  await page.goto(url);

  // Capture a full-page screenshot
  const screenshotBuffer = await page.screenshot({ fullPage: true });

  await browser.close();

  const params = {
    Bucket: 'jobs-screenshot',
    Key: key,
    ContentType: 'image/png', // Set content type to PNG
    ACL: 'public-read', // Make the object publicly accessible
    Body: screenshotBuffer, // Use the screenshot buffer
  };

  try {
    // Attempt to upload to S3
    const uploadResponse = await s3.upload(params).promise();

    // Log success and return the S3 URL
    const s3Url = uploadResponse.Location;
    console.log('Screenshot uploaded to S3:', s3Url);

    // Check if running locally (serverless-offline) and use a different callback function for local testing
    if (isLocal) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Screenshot uploaded to S3', s3Url }),
      };
    } else {
      // Send a success response
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({ message: 'Screenshot uploaded to S3', s3Url }),
      });
    }
  } catch (error) {
    // Log the error
    console.error('Error uploading screenshot to S3:', error);

    // Send an error response
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error uploading screenshot to S3' }),
    });
  }
};
