export default function isUuidNotExist(uuid: string | undefined) {
  return !uuid || uuid === '';
}
