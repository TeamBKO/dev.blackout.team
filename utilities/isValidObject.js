import isObjectLike from 'lodash/isObjectLike';
export default function isValidObject(obj) {
  return isObjectLike(obj) && Object.keys(obj).length && !Array.isArray(obj);
}
