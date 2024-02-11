import { IApi, IController, IStorage } from 'data/interfaces';
import 'dotenv/config';

export default class Controller implements IController {
  private storage: IStorage;
  private api: IApi;

  constructor(storage: IStorage, api: IApi) {
    this.storage = storage;
    this.api = api;
  }

  public startServer() {
    this.api.startServer();
  }

  httpRequest() {
    console.log(this.storage, this.api);
  }
}
