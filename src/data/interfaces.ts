import { IncomingMessage, ServerResponse } from 'http';
import { User, UserStorage } from './types';

export interface IController {
  startServer: () => void;
  httpRequest: () => void;
}

export interface IStorage {
  createUser: () => void;
  getStorage: () => UserStorage[];
}

export interface IApi {
  checkURL: (
    res: ServerResponse<IncomingMessage>,
    req: IncomingMessage
  ) => void;
  getBody: (req: IncomingMessage) => Promise<User[]>;
}
