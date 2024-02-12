import UnsupportedMethodError from '../errors/UnsupportedMethodError';
import { IncomingMessage, ServerResponse } from 'http';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import { constants } from 'http2';

export default function handleError(
  error: Error,
  response: ServerResponse<IncomingMessage>
) {
  if (error instanceof UnsupportedMethodError) {
    response.writeHead(constants.HTTP_STATUS_METHOD_NOT_ALLOWED, {
      'Content-Type': 'text/html',
    });
    response.end(error.message);
    return;
  }

  if (error instanceof BadRequestError) {
    response.writeHead(constants.HTTP_STATUS_BAD_REQUEST, {
      'Content-Type': 'text/html',
    });
    response.end(error.message);
    return;
  }

  if (error instanceof NotFoundError) {
    response.writeHead(constants.HTTP_STATUS_NOT_FOUND, {
      'Content-Type': 'text/html',
    });
    response.end(error.message);
    return;
  }

  response.writeHead(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, {
    'Content-Type': 'text/html',
  });
  response.end('Internal Server Error');
}
