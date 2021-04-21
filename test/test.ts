import { expect, tap } from '@pushrocks/tapbundle';
import * as smartcache from '../ts/index';

let smartcacheInstance: smartcache.SmartCache;

tap.test('should create a valid instance of SmartCache', async () => {
  smartcacheInstance = new smartcache.SmartCache();
  expect(smartcacheInstance).to.be.instanceof(smartcache.SmartCache);
});

tap.test('try to get async responses', async (tools) => {
  let response1Counter = 0;
  const getResponse = async () => {
    const response = await smartcacheInstance
      .cacheReturn(async () => {
        console.log('function 1 ran');
        response1Counter++;
        return 'hello';
      }, 1000)
      .catch((err) => {
        console.log(err);
      });
    console.log('response is:');
    console.log(response);
  };

  let response2Counter = 0;
  const getResponse2 = async () => {
    const response = await smartcacheInstance
      .cacheReturn(async () => {
        console.log('function 2 ran');
        response2Counter++;
        return 'hello there!';
      }, 1000)
      .catch((err) => {
        console.log(err);
      });
    console.log('response is:');
    console.log(response);
  };

  await getResponse();
  await getResponse();
  await getResponse2();
  await getResponse2();
  await tools.delayFor(500);
  await getResponse();
  await tools.delayFor(2000);
  await getResponse2();
});

tap.start({
  throwOnError: true,
});
