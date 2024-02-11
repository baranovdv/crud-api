import { IApi, IController, IStorage } from 'data/interfaces';
import 'dotenv/config';
import { IncomingMessage, ServerResponse, createServer } from 'http';
import isUuidNotExist from '../utils/isUuidNotExist';
import handleError from '../utils/handleError';

export default class Controller implements IController {
  private storage: IStorage;
  private api: IApi;

  constructor(storage: IStorage, api: IApi) {
    this.storage = storage;
    this.api = api;
  }

  private async handleMethod(
    res: ServerResponse<IncomingMessage>,
    req: IncomingMessage
  ) {
    const { url, method } = req;
    const urlSplitted = (url as string).split('/');

    try {
      switch (method) {
        case 'GET':
          if (isUuidNotExist(urlSplitted[3])) {
            const storage = JSON.stringify(this.storage.getStorage());

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(storage);
          }
          break;

        case 'POST':
          const body = await this.api.getBody(req);
          console.log(body);
          res.end();
          break;
      }
    } catch (error) {
      handleError(error as Error, res);
    }
  }

  public startServer() {
    const PORT = process.env.PORT;

    const server = createServer(async (req, res) => {
      this.api.checkURL(res, req);

      await this.handleMethod(res, req);
    });
    server.listen(PORT, () => {
      console.log('server started');
    });
  }

  httpRequest() {
    console.log(this.storage, this.api);
  }
}
