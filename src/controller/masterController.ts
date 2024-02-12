import { IMasterController, IStorage } from '../data/interfaces';
import * as dotenv from 'dotenv';
import { UserStorage } from '../data/types';

dotenv.config();

export default class MasterController implements IMasterController {
  private storage: IStorage;
  // private api: IApi;

  constructor(storage: IStorage) {
    this.storage = storage;
    // this.api = api;
  }

  // private async handleMethod(
  //   res: ServerResponse<IncomingMessage>,
  //   req: IncomingMessage
  // ) {
  //   const { url, method } = req;
  //   const urlSplitted = (url as string).split('/');
  //   const uuid = urlSplitted[3];

  //   try {
  //     switch (method) {
  //       case 'GET':
  //         if (isUuidNotExist(uuid)) {
  //           const storage = JSON.stringify(await this.storage.getStorage());

  //           this.api.sendResponse(res, storage);
  //         } else {
  //           const user = await this.storage.getUser(uuid as string);

  //           if (!user) throw new NotFoundError(`id ${uuid} doesn't exist`);
  //           this.api.sendResponse(res, JSON.stringify(user));
  //         }
  //         break;

  //       case 'POST':
  //         if (isUuidNotExist(uuid)) {
  //           const body = await this.api.getBody(req);
  //           const newUser = { id: uuidv4(), ...body };
  //           await this.storage.createUser(newUser);

  //           this.api.sendResponse(
  //             res,
  //             JSON.stringify(newUser),
  //             constants.HTTP_STATUS_CREATED
  //           );
  //         } else {
  //           throw new BadRequestError();
  //         }
  //         break;

  //       case 'PUT':
  //         if (isUuidNotExist(uuid)) {
  //           throw new BadRequestError();
  //         } else {
  //           const userStored = await this.storage.getUser(uuid as string);

  //           if (!userStored)
  //             throw new NotFoundError(`id ${uuid} doesn't exist`);

  //           const body = await this.api.getBody(req);
  //           const user = { id: uuid as string, ...body };

  //           await this.storage.updateUser(user);

  //           this.api.sendResponse(res, JSON.stringify(user));
  //         }
  //         break;

  //       case 'DELETE':
  //         const user = await this.storage.getUser(uuid as string);

  //         if (!user) {
  //           throw new NotFoundError(`id ${uuid} doesn't exist`);
  //         } else {
  //           this.storage.deleteUser(uuid as string);
  //           this.api.sendResponse(
  //             res,
  //             JSON.stringify('Deleted'),
  //             constants.HTTP_STATUS_NO_CONTENT
  //           );
  //         }
  //         break;
  //     }
  //   } catch (error) {
  //     handleError(error as Error, res);
  //   }
  // }

  public async handleMessage(message: string) {
    console.log(message);
  }

  public async createUser(user: UserStorage) {
    await this.storage.createUser(user);
  }

  public async getUser(id: string) {
    const user = await this.storage.getUser(id);

    return user;
  }

  public async getStorage() {
    const storage = await this.storage.getStorage();

    return storage;
  }
}
