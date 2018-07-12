// import { expect, tap } from 'tapbundle';
import * as smartcache from '../ts/index';
import * as smartdelay from '@pushrocks/smartdelay';

const smartcacheInstance = new smartcache.SmartCache();
const getResponse = async () => {
  const response = await smartcacheInstance.cacheReturn(async () => {
    console.log('function ran')
    return 'hello';
  }, 1000).catch(err => {
    console.log(err);
  });
  console.log('response is:')
  console.log(response);
};

const getResponse2 = async () => {
  const response = await smartcacheInstance.cacheReturn(async () => {
    console.log('function ran')
    return 'hello';
  }, 1000).catch(err => {
    console.log(err);
  });
  console.log('response is:')
  console.log(response);
};

getResponse();
getResponse();
getResponse2();
getResponse2();
smartdelay.delayFor(1000).then(() => {
  getResponse();
  // getResponse2();
});

