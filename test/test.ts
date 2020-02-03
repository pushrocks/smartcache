import { expect, tap } from '@pushrocks/tapbundle';
import * as smartcache from '../ts/index';
import * as smartdelay from '@pushrocks/smartdelay';

let smartcacheInstance: smartcache.SmartCache;

tap.test('should create a valid instance of SmartCache', async () => {
  smartcacheInstance = new smartcache.SmartCache();
  expect(smartcacheInstance).to.be.instanceof(smartcache.SmartCache);
});

tap.test('try to get async responses', async () => {
  const getResponse = async () => {
    const response = await smartcacheInstance
      .cacheReturn(async () => {
        console.log('function 1 ran');
        return 'hello';
      }, 1000)
      .catch(err => {
        console.log(err);
      });
    console.log('response is:');
    console.log(response);
  };

  const getResponse2 = async () => {
    const response = await smartcacheInstance
      .cacheReturn(async () => {
        console.log('function 2 ran');
        return 'hello there!';
      }, 1000)
      .catch(err => {
        console.log(err);
      });
    console.log('response is:');
    console.log(response);
  };

  await getResponse();
  await getResponse();
  await getResponse2();
  await getResponse2();
  await smartdelay.delayFor(2000).then(async () => {
    await getResponse();
    await getResponse2();
  });
});

tap.start({
  throwOnError: true
});
