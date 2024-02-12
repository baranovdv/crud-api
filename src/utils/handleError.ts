import UnsupportedMethodError from '../errors/UnsupportedMethodError';
import { IncomingMessage, ServerResponse } from 'http';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';

export default function handleError(
  error: Error,
  response: ServerResponse<IncomingMessage>
) {
  if (error instanceof UnsupportedMethodError) {
    response.writeHead(405, { 'Content-Type': 'text/html' });
    response.end(error.message);
    return;
  }

  if (error instanceof BadRequestError) {
    response.writeHead(400, { 'Content-Type': 'text/html' });
    response.end(error.message);
    return;
  }

  if (error instanceof NotFoundError) {
    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end(error.message);
    return;
  }

  response.writeHead(500, { 'Content-Type': 'text/html' });
  response.end('Internal Server Error');
}
