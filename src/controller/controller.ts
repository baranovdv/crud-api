import { IApi, IController, IStorage } from 'data/interfaces';
import { createServer } from 'http';
import 'dotenv/config';

export default class Controller implements IController {
  private storage: IStorage;
  private api: IApi;

  constructor(storage: IStorage, api: IApi) {
    this.storage = storage;
    this.api = api;
  }

  public startServer() {
    const PORT = process.env.PORT;

    console.log(PORT);
    const server = createServer((_, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('Hello wrld');
    });

    server.listen(PORT, () => {
      console.log('server started');
    });
  }

  httpRequest() {
    console.log(this.storage, this.api);
  }
}
