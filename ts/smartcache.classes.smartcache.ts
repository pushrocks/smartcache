import * as plugins from './smartcache.plugins';
import { CacheManager } from './smartcache.classes.cachemanager';

export class SmartCache {
  private _cacheManager = new CacheManager();

  async cacheReturn(asyncCachedFuncArg: () => Promise<any>, cacheDuration: number = 5000) {
    let callStack: string = new plugins.smarterror.SmartError('').cleanFullStack;
    let callHash = plugins.nodehash.sha256FromStringSync(callStack);

    // console.log(callHash);
    if (
      this._cacheManager.cacheExists(callHash) &&
      (await this._cacheManager.waitForCacheReady(callHash)) &&
      this._cacheManager.stillValid(callHash)
    ) {
      return this._cacheManager.getCache(callHash).cachedObject;
    } else {
      this._cacheManager.announceCache(callHash, cacheDuration);
      let newCachedObject = await asyncCachedFuncArg();
      this._cacheManager.setCache(callHash, newCachedObject, cacheDuration);
      return newCachedObject;
    }
  }
}
