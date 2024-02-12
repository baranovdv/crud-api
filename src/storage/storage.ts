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

  public deleteUser(id: string): void {
    const indexOfUser = this.storage.indexOf(
      this.storage.find((user) => user.id === id) ?? ({} as UserStorage)
    );

    this.storage.splice(indexOfUser, 1);
  }

  public updateUser(user: UserStorage): void {
    const indexOfUser = this.storage.indexOf(
      this.storage.find((storageUser) => storageUser.id === user.id) ??
        ({} as UserStorage)
    );

    this.storage[indexOfUser] = user;
  }

  public getStorage() {
    return this.storage;
  }
}
