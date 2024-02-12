import Controller from '../../controller/controller';
import Api from '../../api/api';
import WorkerStorage from '../../storage/workerStorage';

export default function createWorker(port: number) {
  const storage = new WorkerStorage();
  const api = new Api();
  const controller = new Controller(storage, api);

  controller.startServer(port);
}
