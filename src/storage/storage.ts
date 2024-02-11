import { IStorage } from 'data/interfaces';
import { UserStorage } from 'data/types';

export default class Storage implements IStorage {
  private storage: UserStorage[];

  constructor() {
    this.storage = [];
  }

  createUser() {
    console.log(this.storage);
  }

  public getStorage() {
    return this.storage;
  }
}
