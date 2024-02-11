import { HTTPMethods } from './data';

export type HTTPMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type User = {
  username: string;
  age: number;
  hobbies: string[];
};

export type UserStorage = User & {
  id: string;
};
