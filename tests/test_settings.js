const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const source = fs.readFileSync(path.join(__dirname, '../watchface/src/pkjs/index.js'), 'utf8');
function load(saved) {
  let config, sent, sends = [], opened;
  const events = {};
  let stored = JSON.stringify(saved);
  vm.runInNewContext(source, {
    require: () => function Clay(items, custom, options) {
      config = items;
      assert.equal(options.autoHandleEvents, false);
      this.generateUrl = () => 'settings-preview-url';
      this.getSettings = response => {
        const values = JSON.parse(decodeURIComponent(response));
        stored = JSON.stringify(values);
        return values;
      };
    },
    localStorage: {getItem: () => stored},
    console: {log: () => {}},
    Pebble: {
      sendAppMessage: x => {sent = x; sends.push(x);},
      openURL: url => {opened = url;},
      addEventListener: (name, cb) => {assert(!events[name]); events[name] = cb;}
    }
  });
  events.ready();
  return {config, sent, sends, events, getOpened: () => opened};
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

x = load({});
assert.equal(x.sends.length, 1);
assert.equal(x.sent.Preview, undefined);
x.events.showConfiguration();
assert.equal(x.getOpened(), 'settings-preview-url');
x.events.webviewclosed({response: ''});
x.events.webviewclosed({});
x.events.webviewclosed(null);
assert.equal(x.sends.length, 1);
x.events.webviewclosed({response: 'malformed'});
assert.equal(x.sends.length, 1);
x.events.webviewclosed({response: encodeURIComponent(JSON.stringify({AnimationSpeed: 2, QuietEnabled: true}))});
assert.equal(x.sends.length, 2);
assert.equal(x.sends[1].AnimationSpeed, 2);
assert.equal(x.sends[1].QuietEnabled, true);
assert.equal(x.sends[1].Preview, 1);
x.events.ready();
assert.equal(x.sends.length, 3);
assert.equal(x.sends[2].Preview, undefined);
assert.equal(x.sends[2].AnimationSpeed, 2);
console.log('Save preview event tests passed');
