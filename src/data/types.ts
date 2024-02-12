export type HTTPMethodsType = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type User = {
  username: string;
  age: number;
  hobbies: string[];
};

export type UserStorage = User & {
  id: string;
};
