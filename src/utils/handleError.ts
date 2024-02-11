import UnsupportedMethodError from '../errors/UnsupportedMethodError';
import { IncomingMessage, ServerResponse } from 'http';
import BadRequestError from '../errors/BadRequestError';

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
  console.log(error.message);
}
