import * as crypto from 'crypto';
import { AsyncCompletionClient } from '@temporalio/client';
import { CompleteAsyncError, Context } from '@temporalio/activity';

export async function signMessage(message: string): Promise<void> {
  const client = new AsyncCompletionClient();
  const taskToken = Context.current().info.taskToken;

  try {
    const { privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    const sign = crypto.createSign('SHA256');
    sign.update(message);
    sign.end();

    const signature = sign.sign(privateKey, 'base64');

    await client.complete(taskToken, { signature, message });
  } catch (e) {
    throw new CompleteAsyncError();
  }
}
