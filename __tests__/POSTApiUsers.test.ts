import { User } from '../src/data/types';
import Api from '../src/api/api';
import Controller from '../src/controller/controller';
import Storage from '../src/storage/storage';
import supertest from 'supertest';
import { constants } from 'http2';

const storage = new Storage();
const api = new Api();
const controller = new Controller(storage, api);

const request = supertest(controller.createServer());

const mockUser: User = {
  username: 'mockName',
  age: 77,
  hobbies: ['sleeping'],
};

const mockUserFailData = {
  username: 'mockName',
  age: '77',
  hobbies: ['sleeping'],
};

const mockUserFailLength = {
  username: 'mockName',
  age: 77,
  hobbies: ['sleeping'],
  dummy: 'dummy',
};

describe('2. POSTApiUsers', () => {
  it('case 1: create new user', async () => {
    const responsePOST = await request.post('/api/users').send(mockUser);

    expect(responsePOST.status).toBe(constants.HTTP_STATUS_CREATED);

    const createdUserID = responsePOST.body.id;

    const responseGET = await request.get(`/api/users/${createdUserID}`);

    expect(responseGET.body.age).toBe(mockUser.age);
  });

  it('case 2: get error 400 on wrong data', async () => {
    const responsePOST = await request
      .post('/api/users')
      .send(mockUserFailData);

    expect(responsePOST.status).toBe(constants.HTTP_STATUS_BAD_REQUEST);
  });

  it('case 3: get error 400 on wrong data length', async () => {
    const responsePOST = await request
      .post('/api/users')
      .send(mockUserFailLength);

    expect(responsePOST.status).toBe(constants.HTTP_STATUS_BAD_REQUEST);
  });
});
