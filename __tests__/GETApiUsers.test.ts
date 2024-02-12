import { constants } from 'http2';
import Api from '../src/api/api';
import Controller from '../src/controller/controller';
import Storage from '../src/storage/storage';
import supertest from 'supertest';

const storage = new Storage();
const api = new Api();
const controller = new Controller(storage, api);

const request = supertest(controller.createServer());

const mockid = '0325fc24-56d4-492a-b75e-fb8ab487d967';

describe('1. GETApiUsers', () => {
  it('case 1: get empty array', async () => {
    const response = await request.get('/api/users');

    expect(response.body).toHaveLength(0);
  });

  it('case 2: get error 404 on wrong endpoint', async () => {
    const response = await request.get('/api/wrong/');

    expect(response.status).toBe(constants.HTTP_STATUS_NOT_FOUND);
  });

  it('case 3: get id in response to wrong id', async () => {
    const response = await request.get(`/api/users/${mockid}`);

    expect(response.text).toBe(`id ${mockid} doesn't exist`);
  });
});
