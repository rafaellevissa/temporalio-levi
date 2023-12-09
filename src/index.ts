import express from 'express';
import { WorkflowClient } from '@temporalio/client';
import * as crypto from 'crypto';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import * as wf from '@temporalio/workflow';


const generateKeyPair = () => {
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem'},
  });

  return keyPair;
}

async function createWorkflowSignature (payload: any): Promise<string> {
  const sign = crypto.createSign("SHA256");
  sign.update(payload);
  sign.end();

  const signature = sign.sign(privateKey, "base64");
  console.log(signature)
  return signature;
}

const client = new WorkflowClient();
const { publicKey, privateKey} = generateKeyPair()

const app = express();

app.use(bodyParser.json())

app.get('/:workflowId', async (req: Request, res: Response) => {
  const {workflowId} = req.params;
  const handler = client.getHandle(workflowId);

  handler.query('getMessage')
  .then(result => res.json({ result }))
  .catch(err => res.status(500).json({ message: err.message }));
});

app.post('/', async (req: Request, res: Response) => {
  const { id, message } = req.body;

  client.start<any>(createWorkflowSignature, {
    workflowId: id.toString(),
    taskQueue: id.toString(),
    args: [message],
  }).then(() => res.json({ id }));
});

app.listen(3000);
console.log('Listening on port 3000');
