import createMultiServer from './multi/createMultiServer';
import Api from './api/api';
import Controller from './controller/controller';
import Storage from './storage/storage';

const isMulti = process.argv.includes('--mode-multi');

if (isMulti) {
  createMultiServer();
} else {
  const storage = new Storage();
  const api = new Api();
  const controller = new Controller(storage, api);

  controller.startServer();
}
