/* eslint-disable @typescript-eslint/no-explicit-any */
import cluster from 'cluster';
import { IMessage, IStorage } from '../data/interfaces';
import { CRUDMethods, User, UserStorage } from '../data/types';
import NotFoundError from '../errors/NotFoundError';

export default class WorkerStorage implements IStorage {
  private storage: UserStorage[];

  constructor() {
    this.storage = [];
  }

  private async sendMessageToMain(
    method: CRUDMethods,
    id?: string,
    user?: User
  ): Promise<any> {
    return await new Promise((resolve, reject) => {
      const message = {
        method,
        id: id ?? 'noid',
        user: user ?? ({} as User),
      };

      process.send!(JSON.stringify(message));

      cluster.worker!.once('message', (message: string) => {
        const messageParsed: IMessage = JSON.parse(message);
        console.log(message);

        switch (messageParsed.method) {
          case 'GET':
            resolve(messageParsed.user);

          case 'CREATE':
            resolve('');

          case 'GET_STORAGE':
            resolve(messageParsed.storage);

          default:
            reject(new NotFoundError());
        }
      });
    });
  }

  public async createUser(user: UserStorage): Promise<void> {
    await this.sendMessageToMain('CREATE', '_', user);
    this.storage.push(user);
  }

  public async getUser(id: string): Promise<UserStorage | undefined> {
    const user = await this.sendMessageToMain('GET', id);
    console.log(user);
    // const user = await this.sendMessageToMain('GET', id);
    // const user = this.storage.find((user) => user.id === id);

    return user;
  }

  public async deleteUser(id: string): Promise<void> {
    const indexOfUser = this.storage.indexOf(
      this.storage.find((user) => user.id === id) ?? ({} as UserStorage)
    );

    this.storage.splice(indexOfUser, 1);
  }

  public async updateUser(user: UserStorage): Promise<void> {
    const indexOfUser = this.storage.indexOf(
      this.storage.find((storageUser) => storageUser.id === user.id) ??
        ({} as UserStorage)
    );

    this.storage[indexOfUser] = user;
  }

  public async getStorage() {
    const storage = await this.sendMessageToMain('GET_STORAGE');

    return storage;
  }
}
