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

describe('6. GET deleted user by ID', () => {
  it('case 1: receive error after GET deleted User by ID', async () => {
    const responsePOST = await request.post('/api/users').send(mockUser);

    expect(responsePOST.status).toBe(constants.HTTP_STATUS_CREATED);

    const createdUserID = responsePOST.body.id;

    const responseDELETE = await request.delete(`/api/users/${createdUserID}`);

    expect(responseDELETE.status).toBe(constants.HTTP_STATUS_NO_CONTENT);

    const responseGET = await request.get(`/api/users/${createdUserID}`);

    expect(responseGET.status).toBe(constants.HTTP_STATUS_NOT_FOUND);
    expect(responseGET.text).toBe(`id ${createdUserID} doesn't exist`);
  });

  it('case 2: get deleted user error 400 on wrong ID', async () => {
    const responsePOST = await request.post('/api/users').send(mockUser);

    expect(responsePOST.status).toBe(constants.HTTP_STATUS_CREATED);

    const createdUserID = responsePOST.body.id;

    const responseDELETE = await request.delete(`/api/users/${createdUserID}`);

    expect(responseDELETE.status).toBe(constants.HTTP_STATUS_NO_CONTENT);

    const responseGET = await request.get(`/api/users/${mockidWrong}`);

    expect(responseGET.status).toBe(constants.HTTP_STATUS_BAD_REQUEST);
  });

  it('case 3: get deleted user error 404 on not created ID', async () => {
    const responsePOST = await request.post('/api/users').send(mockUser);

    expect(responsePOST.status).toBe(constants.HTTP_STATUS_CREATED);

    const createdUserID = responsePOST.body.id;

    const responseDELETE = await request.delete(`/api/users/${createdUserID}`);

    expect(responseDELETE.status).toBe(constants.HTTP_STATUS_NO_CONTENT);

    const responseGET = await request.get(`/api/users/${mockidNotCreated}`);

    expect(responseGET.status).toBe(constants.HTTP_STATUS_NOT_FOUND);
  });
});
