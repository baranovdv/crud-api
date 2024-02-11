import { HTTPMethods } from './data';

export type HTTPMethods = (typeof HTTPMethods)[number];

export type User = {
  username: string;
  age: number;
  hobbies: string[];
};

export type UserStorage = User & {
  id: string;
};
