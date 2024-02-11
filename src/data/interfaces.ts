export interface IController {
  startServer: () => void;
  httpRequest: () => void;
}

export interface IStorage {
  createUser: () => void;
}

export interface IApi {
  startServer: () => void;
}
