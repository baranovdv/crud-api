import Api from './api/api';
import Controller from './controller/controller';
import Storage from './storage/storage';

const storage = new Storage();
const api = new Api();
const controller = new Controller(storage, api);

controller.startServer();
