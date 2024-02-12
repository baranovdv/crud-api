import { IApi, IController, IStorage } from '../data/interfaces';
import * as dotenv from 'dotenv';
import { IncomingMessage, ServerResponse, createServer } from 'http';
import isUuidNotExist from '../utils/isUuidNotExist';
import handleError from '../utils/handleError';
import { v4 as uuidv4 } from 'uuid';
import { STATUS } from '../data/enums';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';

dotenv.config();

const POST_RESPONSE_STATUS = 201;
const DELETE_RESPONSE_STATUS = 204;

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
    const uuid = urlSplitted[3];

    try {
      switch (method) {
        case 'GET':
          if (isUuidNotExist(uuid)) {
            const storage = JSON.stringify(this.storage.getStorage());

            this.api.sendResponse(res, storage);
          } else {
            const user = this.storage.getUser(uuid as string);

            if (!user) throw new NotFoundError(`id ${uuid} doesn't exist`);
            this.api.sendResponse(res, JSON.stringify(user));
          }
          break;

        case 'POST':
          if (isUuidNotExist(uuid)) {
            const body = await this.api.getBody(req);
            const newUser = { id: uuidv4(), ...body };
            this.storage.createUser(newUser);

            this.api.sendResponse(
              res,
              JSON.stringify(newUser),
              POST_RESPONSE_STATUS
            );
          } else {
            throw new BadRequestError();
          }
          break;

        case 'PUT':
          if (isUuidNotExist(uuid)) {
            throw new BadRequestError();
          } else {
            const userStored = this.storage.getUser(uuid as string);

            if (!userStored)
              throw new NotFoundError(`id ${uuid} doesn't exist`);

            const body = await this.api.getBody(req);
            const user = { id: uuid as string, ...body };

            this.storage.updateUser(user);

            this.api.sendResponse(res, JSON.stringify(user));
          }
          break;

        case 'DELETE':
          const user = this.storage.getUser(uuid as string);

          if (!user) {
            throw new NotFoundError(`id ${uuid} doesn't exist`);
          } else {
            this.storage.deleteUser(uuid as string);
            this.api.sendResponse(
              res,
              JSON.stringify('Deleted'),
              DELETE_RESPONSE_STATUS
            );
          }
          break;
      }
    } catch (error) {
      handleError(error as Error, res);
    }
  }

  public startServer() {
    const PORT = process.env['PORT'];

    const server = createServer(async (req, res) => {
      if (this.api.checkURL(res, req) !== STATUS.OK) return;

      await this.handleMethod(res, req);
    });
    server.listen(PORT, () => {
      console.log('server started');
    });
  }
}
