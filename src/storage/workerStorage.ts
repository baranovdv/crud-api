/* eslint-disable @typescript-eslint/no-explicit-any */
import cluster from 'cluster';
import { IMessage, IStorage } from '../data/interfaces';
import { CRUDMethods, User, UserStorage } from '../data/types';
import NotFoundError from '../errors/NotFoundError';

export default class WorkerStorage implements IStorage {
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

        switch (messageParsed.method) {
          case 'GET':
            resolve(messageParsed.user);

          case 'CREATE':
            resolve('');

          case 'DELETE':
            resolve('');

          case 'UPDATE':
            resolve('');

          case 'GET_STORAGE':
            resolve(messageParsed.storage);

          case 'GET_STORAGE':
            reject(new Error());

          default:
            reject(new NotFoundError());
        }
      });
    });
  }

  public async createUser(user: UserStorage): Promise<void> {
    await this.sendMessageToMain('CREATE', '_', user);
  }

  public async getUser(id: string): Promise<UserStorage | undefined> {
    const user = await this.sendMessageToMain('GET', id);

    return user;
  }

  public async deleteUser(id: string): Promise<void> {
    await this.sendMessageToMain('DELETE', id);
  }

  public async updateUser(user: UserStorage): Promise<void> {
    await this.sendMessageToMain('UPDATE', '_', user);
  }

  public async getStorage() {
    const storage = await this.sendMessageToMain('GET_STORAGE');

    return storage;
  }
}
