const assert = require('assert');
const weather = require('../watchface/src/pkjs/weather');
const now = Date.now();
function reading(code, extra) {
  return {validUntilMs: now + 60000, instances: [{properties: Object.assign({
    condition_code: {shortText: {text: code}},
    temperature: {numericValue: {value: 16.5, unit: '°C'}}
  }, extra)}]};
}
let packet = weather.packet(reading('light_rain'), now);
assert.equal(packet.WeatherFirst, 'LIGHT');
assert.equal(packet.WeatherSecond, 'RAIN');
assert.equal(packet.WeatherDetail, '17C');
assert.equal(packet.WeatherStatus, 1);
assert.equal(weather.packet(reading('toString'), now).WeatherFirst, 'UNKNOWN');
assert.equal(weather.packet(null, now).WeatherStatus, 0);
assert.equal(weather.packet({instances: []}, now).WeatherStatus, 0);
assert.equal(weather.packet(reading('sun', {temperature: {numericValue: {value: 12, unit: 'K'}}}), now).WeatherStatus, 0);
let expired = reading('sun'); expired.validUntilMs = now - 100;
assert.equal(weather.packet(expired, now).WeatherDetail, 'STALE DATA');
let missing = reading('sun'); delete missing.validUntilMs;
assert.equal(weather.packet(missing, now).WeatherStatus, 1);
let builtin = reading('sun'); builtin.validUntilMs = null;
builtin.instances[0].properties.condition_code = {longText:{text:'light_rain'}};
assert.equal(weather.packet(builtin, now).WeatherFirst, 'LIGHT');
assert.equal(weather.packet(builtin, now).WeatherDetail, '17C');
assert.equal(weather.packet(builtin, now).WeatherValidUntil, Math.floor((now+30*60*1000)/1000));
assert.equal(weather.packet(reading('sun',{temperature:{shortText:{text:'62°F'}}}),now).WeatherDetail,'62F');
assert.equal(weather.packet(reading('sun',{temperature:{longText:{text:'−3°C'}}}),now).WeatherDetail,'-3C');
let calls = 0, unsubscribed = 0, handlers, sent = [];
const api = {subscribeToSource: options => {calls++; handlers = options; return {unsubscribe: () => unsubscribed++};},
  sendAppMessage: (message, success) => {sent.push(message); success();}};
weather.configure(api, false); assert.equal(calls, 0);
weather.configure(api, true); assert.equal(calls, 1);
assert.equal(handlers.category, "weather");
assert.equal(handlers.item, "location");
assert.equal(handlers.plugin, undefined);
handlers.onData(reading('heavy_snow')); assert.equal(sent.pop().WeatherSecond, 'SNOW');
handlers.onData(builtin); assert.equal(sent.pop().WeatherStatus,1);
handlers.onData(missing); assert.equal(sent.pop().WeatherStatus,1);
handlers.onError({code: 'PERMISSION_DENIED'}); assert.equal(sent.pop().WeatherDetail, 'ALLOW LOCATION');
const old = handlers;
weather.configure(api, false); assert.equal(unsubscribed, 1);
old.onData(reading('sun')); assert.equal(sent.length, 0);
weather.configure({sendAppMessage: api.sendAppMessage}, true);
assert.equal(sent.pop().WeatherDetail, 'ENABLE PLUGINS');
weather.configure(api, false);
console.log('Weather bridge tests passed');

// Backpressure coalesces readings; a failure retries only once.
let timers = [];
const originalSet = global.setTimeout, originalClear = global.clearTimeout;
global.setTimeout = fn => {timers.push(fn); return timers.length;};
global.clearTimeout = () => {};
let count = 0, pendingSuccess;
const slow = {subscribeToSource: options => {handlers = options; return {unsubscribe: () => {}};},
  sendAppMessage: (message, success, failure) => {count++; if (count === 1) failure(); else {sent.push(message); pendingSuccess = success;}}};
weather.configure(slow, true);
handlers.onData(reading('sun'));
handlers.onData(reading('heavy_rain'));
assert.equal(count, 1);
timers.shift()();
assert.equal(count, 2);
assert.equal(sent.pop().WeatherFirst, 'HEAVY');
pendingSuccess();
weather.configure(slow, false);
global.setTimeout = originalSet; global.clearTimeout = originalClear;
console.log('Weather backpressure tests passed');
