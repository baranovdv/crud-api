import { IMasterController, IStorage } from '../data/interfaces';
import { UserStorage } from '../data/types';

export default class MasterController implements IMasterController {
  private storage: IStorage;

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  public async createUser(user: UserStorage) {
    await this.storage.createUser(user);
  }

  public async getUser(id: string) {
    const user = await this.storage.getUser(id);

    return user;
  }

  public async deleteUser(id: string) {
    await this.storage.deleteUser(id);
  }

  public async getStorage() {
    const storage = await this.storage.getStorage();

    return storage;
  }

  public async updateUser(user: UserStorage) {
    await this.storage.updateUser(user);
  }
}
