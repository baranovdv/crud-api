import { IStorage } from 'data/interfaces';
import { UserStorage } from 'data/types';

export default class Storage implements IStorage {
  private storage: UserStorage[];

  constructor() {
    this.storage = [];
  }

  public createUser(user: UserStorage) {
    this.storage.push(user);
  }

  public getUser(id: string): UserStorage | undefined {
    const user = this.storage.find((user) => user.id === id);

    return user;
  }

  public getStorage() {
    return this.storage;
  }
}
