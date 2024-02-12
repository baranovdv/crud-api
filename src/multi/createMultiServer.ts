import cluster from 'cluster';
import { cpus } from 'os';
import * as dotenv from 'dotenv';

dotenv.config();

export default function createMultiServer() {
  const numofCores = cpus().length;
  const PORT = process.env['PORT'];

  console.log(PORT);

  if (cluster.isPrimary) {
    for (let workerId = 0; workerId < numofCores - 1; workerId += 1) {
      cluster.fork();
    }
  } else {
    console.log(cluster.worker?.id);
  }
}
