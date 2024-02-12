import { IApi, IController, IStorage } from '../data/interfaces';
import * as dotenv from 'dotenv';
import { IncomingMessage, ServerResponse, createServer } from 'http';
import isUuidNotExist from '../utils/isUuidNotExist';
import handleError from '../utils/handleError';
import { v4 as uuidv4 } from 'uuid';
import { STATUS } from '../data/enums';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import { constants } from 'http2';
import { DEFAULT_PORT } from '../data/data';
import checkURL from '../utils/checkURL';

dotenv.config();

export default class Controller implements IController {
  private storage: IStorage;
  private api: IApi;
  private envPort = +(process.env['PORT'] ?? DEFAULT_PORT);

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
    const uuid = urlSplitted[3];

    try {
      switch (method) {
        case 'GET':
          if (isUuidNotExist(uuid)) {
            const storage = JSON.stringify(await this.storage.getStorage());

            this.api.sendResponse(res, storage);
          } else {
            const user = await this.storage.getUser(uuid as string);

            if (!user) throw new NotFoundError(`id ${uuid} doesn't exist`);
            this.api.sendResponse(res, JSON.stringify(user));
          }
          break;

        case 'POST':
          if (isUuidNotExist(uuid)) {
            const body = await this.api.getBody(req);
            const newUser = { id: uuidv4(), ...body };
            await this.storage.createUser(newUser);

            this.api.sendResponse(
              res,
              JSON.stringify(newUser),
              constants.HTTP_STATUS_CREATED
            );
          } else {
            throw new BadRequestError();
          }
          break;

        case 'PUT':
          if (isUuidNotExist(uuid)) {
            throw new BadRequestError();
          } else {
            const userStored = await this.storage.getUser(uuid as string);

            if (!userStored)
              throw new NotFoundError(`id ${uuid} doesn't exist`);

            const body = await this.api.getBody(req);
            const user = { id: uuid as string, ...body };

            await this.storage.updateUser(user);

            this.api.sendResponse(res, JSON.stringify(user));
          }
          break;

        case 'DELETE':
          const user = await this.storage.getUser(uuid as string);

          if (!user) {
            throw new NotFoundError(`id ${uuid} doesn't exist`);
          } else {
            this.storage.deleteUser(uuid as string);
            this.api.sendResponse(
              res,
              JSON.stringify('Deleted'),
              constants.HTTP_STATUS_NO_CONTENT
            );
          }
          break;
      }
    } catch (error) {
      handleError(error as Error, res);
    }
  }

  public createServer() {
    return createServer(async (req, res) => {
      if (checkURL(res, req) !== STATUS.OK) return;

      await this.handleMethod(res, req);
    });
  }

  public startServer(port = this.envPort) {
    const server = this.createServer();

    server.listen(port, () => {
      console.log(`Server started on port ${port} pid ${process.pid}`);
    });
  }
}
