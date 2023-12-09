import * as wf from '@temporalio/workflow';

export const getCountQuery = wf.defineQuery('getCount');

export async function counterWorkflow(): Promise<void> {
  let count = 0;

  wf.setHandler(getCountQuery, () => count);

  await wf.condition(() => false);
}