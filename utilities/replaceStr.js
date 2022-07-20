function isString(str) {
  return Object.prototype.toString.call(str) === '[object String]';
}

/**
 * Returns a string with %key% replaced by the value of the passed object
 * ex. %person% has many %fruit% will pull person and fruit key/value pairs from the object.
 * @param {String} str String used as a replacement message for store actions.
 * @param {Object} obj Object to pull from using the keys passed in string format.
 */
export default function replaceStr(str, obj) {
  let result = 'Created Item.';
  if (str && isString(str)) {
    const match = str.match(/(%)\w+\1/g);

    result = match.reduce((_str, exp) => {
      const key = exp.slice(exp.indexOf('%') + 1, exp.lastIndexOf('%'));

      if (obj[key]) {
        _str = _str.replace(/(%)\w+\1/i, obj[key]);
      }
      return _str;
    }, str);
  }
  return result;
}
