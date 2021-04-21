import * as plugins from './smartcache.plugins';
import { SmartError } from '@pushrocks/smarterror';

export interface ICacheMap {
  [key: string]: {
    timer: plugins.smarttime.Timer;
    cachedDeferred: plugins.smartpromise.Deferred<any>;
    cachedObject: any;
  };
}

export class CacheManager {
  private _cacheMap: ICacheMap = {};

  cacheExists(identifierArg): boolean {
    if (this._cacheMap[identifierArg]) {
      return true;
    }
    return false;
  }

  stillValid(identifierArg: string): boolean {
    if (
      this.cacheExists(identifierArg) &&
      this._cacheMap[identifierArg].timer.startedAt.isYoungerThanMilliSeconds(
        this._cacheMap[identifierArg].timer.timeInMilliseconds
      )
    ) {
      return true;
    }
    return false;
  }

  // announce the caching of something
  announceCache(identifierArg: string, validForArg: number) {
    this._cacheMap[identifierArg] = {
      timer: new plugins.smarttime.Timer(validForArg),
      cachedDeferred: new plugins.smartpromise.Deferred(),
      cachedObject: null,
    };
    this._cacheMap[identifierArg].timer.start();
    this._cacheMap[identifierArg].timer.completed.then(() => {
      this.deleteCache(identifierArg);
    });
  }

  /**
   * waits for the cache to be ready
   */
  async waitForCacheReady(identifierArg: string) {
    await this._cacheMap[identifierArg].cachedDeferred.promise;
    return true;
  }

  setCache(identifierArg: string, cachedObjectArg: any, validForArg = 1000) {
    if (!this.cacheExists(identifierArg)) {
      console.log(
        new SmartError(`Cache for ${identifierArg} has not been announced or timed out!`)
      );
    }
    this._cacheMap[identifierArg].cachedObject = cachedObjectArg;
    this._cacheMap[identifierArg].cachedDeferred.resolve();
  }

  getCache(identifierArg: string) {
    return this._cacheMap[identifierArg];
  }

  async deleteCache(identifierArg: string) {
    delete this._cacheMap[identifierArg];
  }
}
