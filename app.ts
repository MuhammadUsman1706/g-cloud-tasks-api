// Imports the Google Cloud Tasks library.
import { CloudTasksClient, protos } from "@google-cloud/tasks";
import dotenv from "dotenv";
dotenv.config();

// Instantiates a client.
const client = new CloudTasksClient();

async function createHttpTaskWithToken() {
  const project = process.env.G_CLOUD_PROJECT_ID as string;
  const queue = process.env.G_QUEUE_NAME as string;
  const location = process.env.G_QUEUE_LOCATION as string;
  const url = process.env.G_QUEUE_URL as string;
  const payload = { input: { name: "Muhammad Usman G" } };
  // const serviceAccountEmail = process.env.G_CLOUD_SERVICE_ACC_EMAIL;

  const parent = client.queuePath(project, location, queue);

  const task: protos.google.cloud.tasks.v2.ITask = {
    httpRequest: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AUTH_API_KEY}`,
      },
      httpMethod: "POST",
      url,
      // oidcToken: { serviceAccountEmail },
    },
  };

  if (payload)
    (task.httpRequest as protos.google.cloud.tasks.v2.IHttpRequest).body =
      Buffer.from(JSON.stringify(payload)).toString("base64");

  console.log("Sending task:");
  console.log(task);

  // Send create task request.
  const request: protos.google.cloud.tasks.v2.ICreateTaskRequest = {
    parent: parent,
    task: task,
  };

  const [response] = await client.createTask(request);

  console.log("Response:");
  console.log(response);
}

createHttpTaskWithToken();
