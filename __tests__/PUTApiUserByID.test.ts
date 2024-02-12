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

const mockUserInit: User = {
  username: 'init',
  age: 77,
  hobbies: ['sleeping'],
};

const mockUserNew: User = {
  username: 'new',
  age: 78,
  hobbies: ['sleeping'],
};

const mockidWrong = 'wrongID';
const mockidNotCreated = '0325fc24-56d4-492a-b75e-fb8ab487d967';

describe('4. PUTApiUserByID', () => {
  it('case 1: update user by ID', async () => {
    const responsePOST = await request.post('/api/users').send(mockUserInit);

    expect(responsePOST.status).toBe(constants.HTTP_STATUS_CREATED);

    const createdUserID = responsePOST.body.id;

    const responseGETInit = await request.get(`/api/users/${createdUserID}`);

    expect(responseGETInit.body.username).toBe(mockUserInit.username);

    await request.put(`/api/users/${createdUserID}`).send(mockUserNew);

    const responseGETNew = await request.get(`/api/users/${createdUserID}`);

    expect(responseGETNew.body.username).toBe(mockUserNew.username);
  });

  it('case 2: get error 400 on wrong ID', async () => {
    const responsePUT = await request
      .put(`/api/users/${mockidWrong}`)
      .send(mockUserNew);

    expect(responsePUT.status).toBe(constants.HTTP_STATUS_BAD_REQUEST);
  });

  it('case 3: get error 404 on not created ID', async () => {
    const responsePUT = await request
      .put(`/api/users/${mockidNotCreated}`)
      .send(mockUserNew);

    expect(responsePUT.status).toBe(constants.HTTP_STATUS_NOT_FOUND);
  });
});
