/* Weather is supplied by the Pebble host; no direct network requests or API keys. */
var subscription = null;
var generation = 0;
var queue = null;
var sending = false;
var retryTimer = null;
var api;
var CONDITIONS = {
  sun: ['SUNNY', ''], partly_cloudy: ['PARTLY', 'CLOUDY'], cloudy: ['CLOUDY', ''],
  light_rain: ['LIGHT', 'RAIN'], heavy_rain: ['HEAVY', 'RAIN'],
  light_snow: ['LIGHT', 'SNOW'], heavy_snow: ['HEAVY', 'SNOW'],
  rain_and_snow: ['RAIN AND', 'SNOW'], unknown: ['UNKNOWN', 'SKY']
};
function text(property) {
  return property && ((property.shortText && property.shortText.text) ||
    (property.longText && property.longText.text)) || '';
}
function temperature(property) {
  var n = property && property.numericValue;
  if (n && typeof n.value === 'number' && isFinite(n.value) &&
      (n.unit === '°C' || n.unit === '°F'))
    return Math.round(n.value) + (n.unit === '°C' ? 'C' : 'F');
  // Some preview providers expose only text shapes (as the official demo reads).
  var value = text(property).replace(/\u2212/g, '-').trim();
  var match = /^(-?\d+(?:\.\d+)?)\s*°?\s*([CF])$/i.exec(value);
  return match ? Math.round(Number(match[1])) + match[2].toUpperCase() : '';
}
function packet(envelope, now) {
  if (!envelope || !Array.isArray(envelope.instances) || !envelope.instances.length) return unavailable('NO LOCATION');
  var p = (envelope.instances[0] && envelope.instances[0].properties) || {};
  var code = text(p.condition_code);
  var words = Object.prototype.hasOwnProperty.call(CONDITIONS, code) ? CONDITIONS[code] : CONDITIONS.unknown;
  var temp = temperature(p.temperature);
  var feels = temperature(p.feels_like);
  var rawExpiry = envelope.validUntilMs;
  // The built-in streaming provider deliberately sets null (often omitted in JSON).
  var expiry = rawExpiry === null || rawExpiry === undefined ? now + 30 * 60 * 1000 : Number(rawExpiry);
  if (!isFinite(expiry)) return unavailable('BAD WEATHER DATA');
  if (expiry <= now) return unavailable('STALE DATA');
  if (!temp) return unavailable('NO TEMPERATURE');
  return {WeatherFirst: words[0], WeatherSecond: words[1],
    WeatherDetail: temp + (feels ? ' FEELS ' + feels : ''),
    WeatherValidUntil: Math.floor(Math.min(expiry, now + 30 * 60 * 1000) / 1000), WeatherStatus: 1};
}
function unavailable(reason) {
  return {WeatherFirst: 'NO', WeatherSecond: 'WEATHER', WeatherDetail: reason || 'CHECK PHONE',
    WeatherValidUntil: 0, WeatherStatus: 0};
}
function flush() {
  if (sending || retryTimer || !queue) return;
  var pending = queue;
  queue = null;
  sending = true;
  var attempt = generation;
  function finish() { sending = false; flush(); }
  api.sendAppMessage(pending, finish, function() {
    if (attempt !== generation) { finish(); return; }
    // One delayed retry of the newest reading, with bounded failure handling.
    retryTimer = setTimeout(function() {
      retryTimer = null;
      if (attempt !== generation) { finish(); return; }
      var latest = queue || pending;
      queue = null;
      api.sendAppMessage(latest, finish, finish);
    }, 1500);
  });
}
function send(value) { queue = value; flush(); }
function configure(pebble, enabled) {
  api = pebble;
  generation++;
  var current = generation;
  if (subscription) subscription.unsubscribe();
  subscription = null;
  queue = null;
  if (retryTimer) { clearTimeout(retryTimer); sending = false; }
  retryTimer = null;
  if (!enabled) return;
  if (typeof api.subscribeToSource !== 'function') { send(unavailable('ENABLE PLUGINS')); return; }
  try {
    subscription = api.subscribeToSource({category: 'weather', item: 'location',
      properties: ['condition_code', 'condition', 'temperature', 'feels_like'],
      onData: function(data) { if (current === generation) send(packet(data, Date.now())); },
      onError: function(error) {
        if (current !== generation) return;
        send(unavailable(error && error.code === 'PERMISSION_DENIED' ? 'ALLOW LOCATION' : 'CHECK PHONE'));
      }
    });
  } catch (error) { send(unavailable('ENABLE PLUGINS')); }
}
module.exports = {configure: configure, packet: packet};
