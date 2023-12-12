# Challenge

## Overview

This documentation details the functionalities, structure, and configuration of the project's code, including activities, workflows, Worker configuration, and server endpoints.

## Code Structure

The code is organized into different files, each performing specific roles:

- **`activities.ts`**: Defines activities executed by the Temporal Worker.
- **`workflows.ts`**: Defines workflows' behavior and their interactions with activities.
- **`worker.ts`**: Configures and starts the Temporal Worker.
- **`index.ts`**: Defines HTTP endpoints to interact with the workflows.

## Activities (`activities.ts`)

The `activities.ts` file contains the logic for activities executed by Temporal.

- **`signMessage`**: Asynchronous activity to sign a message using RSA encryption. It uses the `crypto` module to generate a base64 signature of the provided message. The `AsyncCompletionClient` of Temporal is used to complete the activity by sending the signature and message as the result.

## Workflows (`workflows.ts`)

The `workflows.ts` file defines the behavior of workflows and their interactions with activities.

- **`getMessageQuery`**: Defines a query used to obtain the message's signature.

- **`messageWorkflowHandler`**: Orchestrates the workflow, using the `signMessage` activity defined earlier to sign the received message and configuring the `getMessageQuery` to return the signature.

## Worker Configuration (`worker.ts`)

The `worker.ts` file configures and starts the Temporal Worker to execute tasks related to workflows and activities.

- **Worker Initialization**: Creates a Worker instance and configures it with:

  - The path to the files containing workflow definitions.
  - The task queue associated with the Worker.
  - The available activities for execution by the Worker.

- **Starting Worker Execution**: Initiates the execution of the Worker to monitor and execute tasks as required.

## Server Endpoints (`index.ts`)

The `index.ts` file implements HTTP endpoints to interact with the Temporal workflows.

- **Route `POST /`**

  - Receives requests and validates the message body using the defined schema.
  - Initiates a new workflow with the received data.
  - Handles errors and returns appropriate codes in case of failure.

- **Route `GET /:workflowId`**

  - Queries the status of a workflow by the provided ID.
  - If the workflow is running, returns the current status.
  - If completed, returns the obtained result.

## Running the Project

To run the project:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Worker:

   ```bash
   npm start
   ```

3. The server endpoints will be available at:

   - `POST /` to start a new workflow.
   - `GET /:workflowId` to query the status of a workflow.
