import { IApi } from 'data/interfaces';
import { createServer } from 'http';
import 'dotenv/config';
import handleError from '../utils/handleError';
import { HTTPMethods } from '../data/data';
import UnsupportedMethodError from '../errors/UnsupportedMethod';

export default class Api implements IApi {
  constructor() {}

  private methodCheck(method: string | undefined) {
    return HTTPMethods.includes(method ?? '');
  }

  public startServer() {
    const PORT = process.env.PORT;

    const server = createServer((req, res) => {
      const { url, method } = req;

      try {
        if (!this.methodCheck(method)) throw new UnsupportedMethodError();
      } catch (error) {
        handleError(error as Error, res);
      }

      console.log(url, method);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('Hello wrld');
    });

    server.listen(PORT, () => {
      console.log('server started');
    });
  }
}
