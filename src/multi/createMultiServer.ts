import cluster from 'cluster';
import { cpus } from 'os';
import * as dotenv from 'dotenv';
import url from 'url';
import createWorker from './worker/worker';
import { DEFAULT_PORT } from '../data/data';
import { createServer, request } from 'http';
import { STATUS } from '../data/enums';
import checkURL from '../utils/checkURL';
import Storage from '../storage/storage';
import MasterController from '../controller/masterController';
import { IMessage } from '../data/interfaces';

dotenv.config();

export default function createMultiServer() {
  const numofCores = cpus().length;
  const PORT = +(process.env['PORT'] ?? DEFAULT_PORT);

  if (cluster.isPrimary) {
    const storage = new Storage();
    const masterController = new MasterController(storage);

    console.log(masterController);

    for (let workerId = 0; workerId < numofCores - 1; workerId += 1) {
      const worker = cluster.fork();

      worker.on('message', async (message) => {
        const messageParsed: IMessage = JSON.parse(message);

        console.log(`${messageParsed}`);

        switch (messageParsed.method) {
          case 'CREATE':
            masterController.createUser(messageParsed.user!);
            const createMessage: IMessage = {
              method: 'CREATE',
            };
            worker.send(JSON.stringify(createMessage));
            break;

          case 'GET':
            const getUser = await masterController.getUser(messageParsed.id!);

            const getMessage: IMessage = {
              method: 'GET',
              user: getUser,
            };
            worker.send(JSON.stringify(getMessage));
            break;

          case 'GET_STORAGE':
            const storage = await masterController.getStorage();

            const getStorage: IMessage = {
              method: 'GET_STORAGE',
              storage,
            };
            worker.send(JSON.stringify(getStorage));
            break;
        }
      });
    }

    cluster.on('exit', () => {
      console.log(`Worker ${cluster.worker?.process.pid} stopped. Restart`);
      cluster.fork();
    });

    const server = createServer((req, res) => {
      if (checkURL(res, req) !== STATUS.OK) return;

      const options = {
        ...url.parse(req.url ?? ''),
        port: 3005,
        headers: req.headers,
        method: req.method,
      };

      req.pipe(
        request(options, (response) => {
          res.writeHead(response.statusCode!, response.headers);
          response.pipe(res);
        })
      );
    });

    server.listen(PORT);
  } else {
    const workerPort = PORT + (cluster.worker?.id ?? 1);

    createWorker(workerPort);
  }
}
