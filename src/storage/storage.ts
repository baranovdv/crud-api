import { IStorage } from '../data/interfaces';
import { UserStorage } from '../data/types';

export default class Storage implements IStorage {
  private storage: UserStorage[];

  constructor() {
    this.storage = [];
  }

  public async createUser(user: UserStorage) {
    this.storage.push(user);
  }

  public async getUser(id: string): Promise<UserStorage | undefined> {
    const user = this.storage.find((user) => user.id === id);

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
    return this.storage;
  }
}
