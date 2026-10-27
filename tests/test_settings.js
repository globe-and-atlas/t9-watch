const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const source = fs.readFileSync(path.join(__dirname, '../watchface/src/pkjs/index.js'), 'utf8');
function load(saved) {
  let config, sent, ready;
  vm.runInNewContext(source, {
    require: () => function Clay(items) { config = items; },
    localStorage: {getItem: () => JSON.stringify(saved)},
    Pebble: {sendAppMessage: x => {sent = x;}, addEventListener: (name, cb) => {ready = cb;}}
  });
  ready();
  return {config, sent};
}
let x = load({});
assert.equal(x.sent.AnimationSpeed, 1);
assert.equal(x.sent.WrongGuesses, 1);
assert.equal(x.sent.QuietEnabled, 0);
assert.equal(x.sent.QuietStart, 22);
assert.equal(x.sent.QuietEnd, 7);
assert.equal(x.sent.RazrPalette, 0);
for (const speed of [0, 1, 2]) {
  for (const guesses of [0, 1, 2]) {
    x = load({AnimationSpeed: String(speed), WrongGuesses: String(guesses), QuietEnabled: true,
      QuietStart: '23', QuietEnd: '6', RazrPalette: '1'});
    assert.equal(x.sent.AnimationSpeed, speed);
    assert.equal(x.sent.WrongGuesses, guesses);
    assert.equal(x.sent.QuietEnabled, 1);
    assert.equal(x.sent.QuietStart, 23);
    assert.equal(x.sent.QuietEnd, 6);
    assert.equal(x.sent.RazrPalette, 1);
  }
}
x = load({AnimationSpeed: 'bogus', WrongGuesses: 9, QuietStart: -1, QuietEnd: 24, RazrPalette: 2});
assert.equal(x.sent.AnimationSpeed, 1);
assert.equal(x.sent.WrongGuesses, 1);
assert.equal(x.sent.QuietStart, 22);
assert.equal(x.sent.QuietEnd, 7);
assert.equal(x.sent.RazrPalette, 0);
for (const key of ['AnimationSpeed', 'WrongGuesses', 'QuietEnabled', 'QuietStart', 'QuietEnd', 'RazrPalette']) {
  assert.equal(x.config.filter(item => item.messageKey === key).length, 1);
}
console.log('Settings serialization tests passed');
