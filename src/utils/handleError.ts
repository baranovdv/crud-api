import UnsupportedMethodError from '../errors/UnsupportedMethod';
import { IncomingMessage, ServerResponse } from 'http';

export default function handleError(
  error: Error,
  response: ServerResponse<IncomingMessage>
) {
  if (error instanceof UnsupportedMethodError) {
    response.writeHead(405, { 'Content-Type': 'text/html' });
    response.end('Method not allowed');
  }
}
