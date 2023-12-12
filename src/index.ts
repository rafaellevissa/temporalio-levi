import express from 'express';
import { WorkflowClient } from '@temporalio/client';
import { messageWorkflowHandler, getMessageQuery } from './workflows';
import { bodySchema } from './schemas';

const app = express();

app.use(express.json());

const client = new WorkflowClient();
const taskQueue = 'message';

app.post('/', function (req: express.Request, res: express.Response) {
  let body: any;

  try {
    body = bodySchema.validateSync(req.body);
  } catch (e) {
    const errors = e as Error;
    res.status(400).json({ errors: errors.message });
    return;
  }

  const { id, message } = body;

  const workflowId = id;
  const opts = {
    taskQueue,
    workflowId,
    args: [message],
  } as any;

  client
    .start(messageWorkflowHandler, opts)
    .then(() => res.json({ workflowId }))
    .catch((e) => res.json({ erros: (e as Error).message }));
});

app.get(`/:workflowId`, async function (req, res) {
  const { workflowId } = req.params;

  const handle = client.getHandle(workflowId);
  const wfDescription = await handle.describe();

  if (wfDescription.status.name === 'RUNNING') {
    res.json(wfDescription.status);
  } else {
    handle
      .query(getMessageQuery)
      .then((result) => res.json({ result }))
      .catch((err) => res.status(500).json({ message: err.message }));
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
