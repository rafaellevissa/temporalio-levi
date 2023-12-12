import * as wf from '@temporalio/workflow';
import * as activities from './activities';
import { proxyActivities } from '@temporalio/workflow';

export const getMessageQuery = wf.defineQuery('getMessage');

const { signMessage } = proxyActivities<typeof activities>({ taskQueue: 'message', startToCloseTimeout: '1 minute' });

export async function messageWorkflowHandler(message: string): Promise<void> {
  const signature = await signMessage(message);

  wf.setHandler(getMessageQuery, () => signature);
}
