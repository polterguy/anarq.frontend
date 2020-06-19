/*
 * AnarQ, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

  /*
   * Generic function to create QUERY arguments from specified object.
   */
export function getQueryArgs(args: any) {
  let result = '';
  for(const idx in args) {
    if (Object.prototype.hasOwnProperty.call(args, idx)) {
      const idxFilter = args[idx];
      if (idxFilter !== null && idxFilter !== undefined && idxFilter !== '') {
        if (result === '') {
          result += '?';
        } else {
          result += '&';
        }
        if (idx.endsWith('.like')) {
          result += idx + '=' + encodeURIComponent(idxFilter + '%');
        } else {
          result += idx + '=' + encodeURIComponent(idxFilter);
        }
      }
    }
  }
  return result;
}
