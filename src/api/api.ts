import { IApi } from 'data/interfaces';
import { IncomingMessage, ServerResponse } from 'http';
import 'dotenv/config';
import handleError from '../utils/handleError';
import { HTTPMethods, endpoint } from '../data/data';
import UnsupportedMethodError from '../errors/UnsupportedMethodError';
import BadRequestError from '../errors/BadRequestError';
// import { v4 as uuidv4 } from 'uuid';
import { validate as validateuuid } from 'uuid';
import isUuidNotExist from '../utils/isUuidNotExist';
import { User } from '../data/types';
import { STATUS } from '../data/enums';

export default class Api implements IApi {
  constructor() {}

  private methodCheck(method: string | undefined): boolean {
    return HTTPMethods.includes(method ?? '');
  }

  private endpointCheck(url: string | undefined): boolean {
    if (url === undefined) return false;

    const urlSplitted = url.split('/');

    return urlSplitted[1] === endpoint[0] && urlSplitted[2] === endpoint[1];
  }

  private uuidCheck(url: string | undefined): string | null {
    if (url === undefined) return 'Bad request';

    const urlSplitted = url.split('/');

    if (isUuidNotExist(urlSplitted[3])) return null;

    return validateuuid(urlSplitted[3] ?? '') ? null : 'Non-valid id';
  }

  public checkURL(res: ServerResponse<IncomingMessage>, req: IncomingMessage) {
    const { url, method } = req;

    try {
      if (!this.methodCheck(method)) throw new UnsupportedMethodError();

      if (!this.endpointCheck(url)) throw new BadRequestError();

      const uuidValidation = this.uuidCheck(url);
      if (uuidValidation) throw new BadRequestError(uuidValidation);
    } catch (error) {
      handleError(error as Error, res);

      return STATUS.NOT_OK;
    }

    return STATUS.OK;
  }

  public async getBody(req: IncomingMessage): Promise<User> {
    return new Promise((resolve, reject) => {
      let body: string = '';

      req.on('data', (chunk: Uint8Array) => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve(result);
        } catch (error) {
          reject(new BadRequestError());
        }
      });

      req.on('error', () => {
        reject(new BadRequestError());
      });
    });
  }

  public sendResponse(res: ServerResponse<IncomingMessage>, payload: string) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(payload);
  }
}
