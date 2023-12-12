import { Worker } from '@temporalio/worker';
import * as activities from './activities';

async function startWorker() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    taskQueue: 'message',
    activities,
  });

  await worker.run();
}

startWorker().catch((err) => {
  console.error('Failed to start worker:', err);
  process.exit(1);
});
