import { IncomingMessage, Server, ServerResponse } from 'http';
import { CRUDMethods, User, UserStorage } from './types';
import { STATUS } from './enums';

export interface IController {
  startServer: () => void;
  createServer: () => Server;
}

export interface IMasterController {
  createUser: (user: UserStorage) => Promise<void>;
  getUser: (id: string) => Promise<UserStorage | undefined>;
  getStorage: () => Promise<UserStorage[]>;
  deleteUser: (id: string) => Promise<void>;
  updateUser: (user: UserStorage) => Promise<void>;
}

export interface IStorage {
  createUser: (user: UserStorage) => Promise<void>;
  getStorage: () => Promise<UserStorage[]>;
  getUser: (id: string) => Promise<UserStorage | undefined>;
  deleteUser: (id: string) => Promise<void>;
  updateUser: (user: UserStorage) => Promise<void>;
}

export interface IApi {
  checkURL: (
    res: ServerResponse<IncomingMessage>,
    req: IncomingMessage
  ) => STATUS;
  getBody: (req: IncomingMessage) => Promise<User>;
  sendResponse: (
    res: ServerResponse<IncomingMessage>,
    payload: string,
    status?: number
  ) => void;
}

export interface IMessage {
  method: CRUDMethods;
  id?: string;
  user?: UserStorage | undefined;
  storage?: UserStorage[];
}
