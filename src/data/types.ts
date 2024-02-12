export type HTTPMethodsType = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type CRUDMethods =
  | 'GET_STORAGE'
  | 'CREATE'
  | 'GET'
  | 'DELETE'
  | 'UPDATE'
  | 'ERROR';

export type User = {
  username: string;
  age: number;
  hobbies: string[];
};

export type UserStorage = User & {
  id: string;
};
