import { IncomingMessage, ServerResponse } from 'http';
import { User, UserStorage } from './types';
import { STATUS } from './enums';

export interface IController {
  startServer: () => void;
  httpRequest: () => void;
}

export interface IStorage {
  createUser: (user: UserStorage) => void;
  getStorage: () => UserStorage[];
  getUser: (id: string) => UserStorage | undefined;
}

export interface IApi {
  checkURL: (
    res: ServerResponse<IncomingMessage>,
    req: IncomingMessage
  ) => STATUS;
  getBody: (req: IncomingMessage) => Promise<User>;
  sendResponse: (res: ServerResponse<IncomingMessage>, payload: string) => void;
}
