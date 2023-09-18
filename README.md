
# AWS Lambda API for Web Screenshots

This project is an AWS Lambda function that captures a screenshot of a web page and uploads it to an AWS S3 bucket using Puppeteer and the Serverless Framework.

## Prerequisites

Before you begin, make sure you have the following prerequisites installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)
- [Serverless Framework](https://www.serverless.com/framework/docs/getting-started/) (v3 or later)
- [AWS CLI](https://aws.amazon.com/cli/) (configured with your AWS credentials)

## Installation and Local Testing

1. **Clone this repository to your local machine:**

   ```bash
   git clone <repository-url>
   ```

2. **Change into the project directory:**

   ```bash
   cd lambda-screenshot
   ```

3. **Install project dependencies:**

   ```bash
   npm install
   ```

4. **Configure your AWS credentials locally by running:**

   ```bash
   aws configure
   ```

   This command will prompt you to enter your AWS access key ID, secret access key, default region, and default output format.

5. **Start the serverless-offline plugin for local testing:**

   ```bash
   serverless offline start
   ```

6. **The HTTP endpoint for capturing screenshots will be available locally at `http://localhost:3000/captureScreenshot`.**

7. **To test the Lambda function locally, you can use a tool like [curl](https://curl.se/) or [Postman](https://www.postman.com/) to make a POST request to `http://localhost:3000/captureScreenshot` with a JSON payload containing the URL to capture a screenshot:**

   ```bash
   curl -X POST http://localhost:3000/captureScreenshot -d '{"url": "https://example.com"}'
   ```

   Replace `"https://example.com"` with the URL you want to capture.

## Deployment to AWS Lambda

1. **Deploy the function to AWS Lambda using the Serverless Framework:**

   ```bash
   serverless deploy
   ```

   This command packages and deploys your Lambda function to your AWS account.

2. **After the deployment is complete, you will receive the HTTP endpoint URL for your AWS Lambda function. You can find it in the output of the `serverless deploy` command.**

3. **To capture a screenshot using the deployed Lambda function, make a POST request to the provided endpoint URL with a JSON payload containing the URL to capture.**

## Cleanup

To remove the deployed resources from AWS Lambda and S3, you can use the following command:

```bash
serverless remove
```

This will delete the AWS resources created by the Serverless Framework.

## AWS Configuration

Certainly, here's a guide on how to set up an AWS account, obtain AWS access keys, and configure the required permissions to run the `serverless.yml` for your Lambda function.

### Setting Up an AWS Account

1. **Create an AWS Account:**

   If you don't already have an AWS account, you can create one by going to the [AWS Sign-Up Page](https://aws.amazon.com/).

2. **Sign In to AWS Console:**

   After creating an account, sign in to the [AWS Management Console](https://aws.amazon.com/console/).

### Obtaining AWS Access Keys

To deploy and manage AWS resources using the Serverless Framework, you'll need AWS access keys, which consist of an Access Key ID and a Secret Access Key.

1. **Open AWS IAM (Identity and Access Management):**

   In the AWS Management Console, search for "IAM" or navigate to "Services" > "IAM."

2. **Create an IAM User:**

   - In the IAM dashboard, click "Users" from the left navigation pane.
   - Click the "Add user" button.

3. **Set User Details:**

   - Enter a username for the new user.
   - Choose "Programmatic access" as the access type.

4. **Set Permissions:**

   - Attach existing policies directly. You can attach policies like `AdministratorAccess` for full access or create a custom policy with the necessary permissions. For your Lambda function, you'll need permissions for Lambda, S3, and IAM.
   
5. **Add Tags (Optional):**

   You can add tags if needed for organizational purposes.

6. **Review and Create User:**

   Review the user details and permissions, and click "Create user."

7. **Access Key ID and Secret Access Key:**

   After creating the user, you will see a screen with the user's details. Here, you can download the user's credentials (Access Key ID and Secret Access Key). Keep these keys secure; they are needed to configure AWS CLI and the Serverless Framework.

### Configuring AWS CLI

1. **Install AWS CLI:**

   If you haven't already installed the AWS CLI, you can download and install it from the [official AWS CLI page](https://aws.amazon.com/cli/).

2. **Configure AWS CLI:**

   Open a terminal and run:

   ```bash
   aws configure
   ```

   - Enter the Access Key ID and Secret Access Key when prompted.
   - Set your preferred default region (e.g., `us-east-1`) and output format (e.g., `json`).

The AWS CLI is now configured with your credentials, and you can interact with AWS services using the CLI.

### Configuring Permissions for Serverless Framework

To deploy your Lambda function using the Serverless Framework, you need to configure the appropriate permissions. This usually involves creating an AWS IAM role and attaching policies that grant access to Lambda, S3, and other required services. Here's how:

1. **Create an AWS IAM Role:**

   - In the AWS Management Console, go to the IAM dashboard.
   - Click "Roles" from the left navigation pane.
   - Click "Create role."
   - Select "Lambda" as the trusted entity type.
   - Attach policies that provide the necessary permissions. At a minimum, you will need `AWSLambda_FullAccess` for Lambda and `AmazonS3FullAccess` for S3.

2. **Attach the IAM Role to Your Lambda Function:**

   In your `serverless.yml`, you can specify the `iamRoleStatements` to grant the necessary permissions to your Lambda function. For example:

   ```yaml
   functions:
     captureScreenshot:
       handler: handler.captureScreenshot
       iamRoleStatements:
         - Effect: Allow
           Action:
             - s3:PutObject
           Resource: arn:aws:s3:::your-bucket-name/*
   ```

   Ensure you replace `your-bucket-name` with your actual S3 bucket name and add other permissions as needed.

With these steps, your AWS account is set up with access keys, AWS CLI is configured, and your Serverless Framework permissions are defined. You can now deploy and manage your Lambda function with ease.