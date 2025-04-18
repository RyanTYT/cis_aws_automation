# cis_aws_automation

## Prerequisites

1. Docker
2. Backend server

## Starting the Frontend Server using Docker

1. Navigate to the root directory and run the following:
```bash
docker build -t capstone-frontend .
```

2. Run the Docker container
```bash
docker run -p 3000:3000 capstone-frontend
```

## Layout

1. Landing Page (Login Page)

Enter the (access key id, secret access key and region) to be stored on the backend server for the session.

2. Dashboard

Table detailing the results of the automated tests run. Table is empty initially and is populated on 'RUN' button pressed on top right. The 'RUN' button does the following:
- Retrieves the most relevant documents for the associated asset types detected
- Sends these tests to OpenAI or Anthropic for generation of bash scripts if possible
- Runs these tests in the subprocess and sends the output to the frontend
- Pie Chart shows the tests passed, failed and skipped
- Collapsible table shows hierarchical structure of tests passed for readability

3. AWS Assets

Table that dynamically shows the AWS assets detected using the AWS Key ID, Secret Access Key and Region provided.

4. Download the results in a readable PDF / MD format
