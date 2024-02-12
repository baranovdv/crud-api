import { ENDPOINT, HTTPMethods } from '../data/data';
import isUuidNotExist from './isUuidNotExist';
import { validate as validateuuid } from 'uuid';
import { IncomingMessage, ServerResponse } from 'http';
import UnsupportedMethodError from '../errors/UnsupportedMethodError';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import handleError from './handleError';
import { STATUS } from '../data/enums';

function methodCheck(method: string | undefined): boolean {
  return HTTPMethods.includes(method ?? '');
}

function endpointCheck(url: string | undefined): boolean {
  if (url === undefined) return false;

  const urlSplitted = url.split('/');

  return urlSplitted[1] === ENDPOINT[0] && urlSplitted[2] === ENDPOINT[1];
}

function uuidCheck(url: string | undefined): string | null {
  if (url === undefined) return 'Bad request';

  const urlSplitted = url.split('/');

  if (isUuidNotExist(urlSplitted[3])) return null;

  return validateuuid(urlSplitted[3] ?? '') ? null : 'Non-valid id';
}

export default function checkURL(
  res: ServerResponse<IncomingMessage>,
  req: IncomingMessage
) {
  const { url, method } = req;

  try {
    if (!methodCheck(method)) throw new UnsupportedMethodError();

    if (!endpointCheck(url)) throw new NotFoundError('No such endpoint');

    const uuidValidation = uuidCheck(url);
    if (uuidValidation) throw new BadRequestError(uuidValidation);
  } catch (error) {
    handleError(error as Error, res);

    return STATUS.NOT_OK;
  }

  return STATUS.OK;
}
