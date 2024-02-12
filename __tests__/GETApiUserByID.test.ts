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

const mockidWrong = 'wrongID';
const mockidNotCreated = '0325fc24-56d4-492a-b75e-fb8ab487d967';

describe('3. GETApiUserByID', () => {
  it('case 1: get user by ID', async () => {
    const responsePOST = await request.post('/api/users').send(mockUser);

    expect(responsePOST.status).toBe(constants.HTTP_STATUS_CREATED);

    const createdUserID = responsePOST.body.id;

    const responseGET = await request.get(`/api/users/${createdUserID}`);

    expect(responseGET.body.username).toBe(mockUser.username);
  });

  it('case 2: get error 400 on wrong ID', async () => {
    const responseGET = await request.get(`/api/users/${mockidWrong}`);

    expect(responseGET.status).toBe(constants.HTTP_STATUS_BAD_REQUEST);
  });

  it('case 3: get error 404 on not created ID', async () => {
    const responseGET = await request.get(`/api/users/${mockidNotCreated}`);

    expect(responseGET.status).toBe(constants.HTTP_STATUS_NOT_FOUND);
  });
});
