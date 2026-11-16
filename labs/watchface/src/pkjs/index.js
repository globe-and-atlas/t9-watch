var Clay = require('@rebble/clay');
var weather = require('./weather');
var peek = require('./peek');
var peekSettings = require('./peek-settings');

var previous = {};
try { previous = JSON.parse(localStorage.getItem('clay-settings') || '{}') || {}; } catch (error) {}
var legacyCustom = previous.UseModelColors === undefined &&
  ((previous.BackgroundColor !== undefined && Number(previous.BackgroundColor) !== 0xAAFFAA) ||
   (previous.TextColor !== undefined && Number(previous.TextColor) !== 0x000000));

var hours = [];
for (var h = 0; h < 24; h++) hours.push({label: ('0' + h).slice(-2) + ':00', value: String(h)});

var clay = new Clay([
  {type: 'heading', defaultValue: 'T9 Time Labs'},
  {type: 'text', defaultValue: 'The hour and minute type themselves at each minute change.'},
  {type: 'select', messageKey: 'TimeFormat', label: 'Time format', defaultValue: '0', options: [
    {label: '12-hour', value: '0'},
    {label: '24-hour', value: '1'}
  ]},
  {type: 'select', messageKey: 'ZeroWording', label: 'At :00', defaultValue: '0', options: [
    {label: "O'CLOCK (2 lines)", value: '0'},
    {label: 'OH ZERO (3 lines)', value: '1'}
  ]},
  {type: 'heading', defaultValue: 'Weather pane (experimental)'},
  {type: 'select', messageKey: 'PaneMode', label: 'Show weather', defaultValue: '0', options: [
    {label: 'Classic — time only', value: '0'},
    {label: 'Shake', value: '1'},
    {label: 'Double-tap (experimental knocks)', value: '2'},
    {label: 'Shake or double-tap (experimental)', value: '3'},
    {label: 'Weather test — show after Save', value: '4'}
  ]},
  {type: 'text', defaultValue: 'Keeps the full keypad on both panes. Weather returns to time after 8 seconds. Enable Plugins / permissions preview in the Pebble mobile app and allow Location. Uses your first weather location and preferred weather provider. Double-tap detects movement, not touchscreen input; it may miss knocks or react to other motion.'},
  {type: 'select', messageKey: 'KnockSensitivity', label: 'Knock sensitivity', defaultValue: '2', options: [
    {label: 'High — light taps', value: '2'}, {label: 'Normal', value: '1'}, {label: 'Low — firm taps', value: '0'}
  ]},
  {type: 'heading', defaultValue: 'Plugin Peek'},
  {type: 'toggle', messageKey: 'PeekEnabled', label: 'Triple-tap for Plugin Peek', defaultValue: false},
  {type: 'text', defaultValue: 'Choose Double-tap or Shake or double-tap above to use Peek. Two knocks show Weather; three show your reading. Weather waits briefly for a possible third knock. Saving previews Peek. Both return after 8 seconds. Classic stays time-only.'},
  {type: 'text', id: 'peekControls', defaultValue: 'Loading installed plugins…'},
  {type: 'heading', defaultValue: 'Typing'},
  {type: 'select', messageKey: 'AnimationSpeed', label: 'Animation speed', defaultValue: '1', options: [
    {label: 'Quick', value: '0'}, {label: 'Classic', value: '1'}, {label: 'Slow', value: '2'}
  ]},
  {type: 'select', messageKey: 'WrongGuesses', label: 'Wrong guesses', defaultValue: '1', options: [
    {label: 'Off', value: '0'}, {label: 'Occasional', value: '1'}, {label: 'Every collision', value: '2'}
  ]},
  {type: 'heading', defaultValue: 'Quiet hours'},
  {type: 'toggle', messageKey: 'QuietEnabled', label: 'Enable quiet hours', defaultValue: false},
  {type: 'text', defaultValue: 'During quiet hours the finished time appears immediately. Times use the watch clock. Equal start and end means all day.'},
  {type: 'select', messageKey: 'QuietStart', label: 'Start', defaultValue: '22', options: hours},
  {type: 'select', messageKey: 'QuietEnd', label: 'End', defaultValue: '7', options: hours},
  {type: 'heading', defaultValue: 'Display style'},
  {type: 'select', messageKey: 'PhoneModel', label: 'Style', defaultValue: '2', options: [
    {label: 'Original', value: '2'},
    {label: 'Nokia 3310', value: '0'},
    {label: 'Motorola RAZR V3', value: '1'}
  ]},
  {type: 'toggle', messageKey: 'ShowBattery', label: 'Battery icon',
    defaultValue: previous.PhoneModel === undefined ? false : true},
  {type: 'select', messageKey: 'RazrPalette', label: 'RAZR model palette', defaultValue: '0', options: [
    {label: 'Blue', value: '0'}, {label: 'Silver', value: '1'}
  ]},
  {type: 'text', defaultValue: 'The RAZR palette applies to Motorola RAZR V3 when model colors are enabled.'},
  {type: 'heading', defaultValue: 'Colors'},
  {type: 'toggle', messageKey: 'UseModelColors', label: 'Use model colors', defaultValue: !legacyCustom},
  {type: 'text', defaultValue: 'Turn off model colors to use the two color choices below.'},
  {type: 'color', messageKey: 'BackgroundColor', label: 'Background', defaultValue: 'AAFFAA', sunlight: false, allowGray: true},
  {type: 'color', messageKey: 'TextColor', label: 'Digits, words and keypad', defaultValue: '000000', sunlight: false, allowGray: true},
  {type: 'submit', defaultValue: 'Save to watch'}
], peekSettings, {autoHandleEvents: false});

function color(value, fallback) {
  var number = Number(value);
  return isFinite(number) && Math.floor(number) === number &&
    number >= 0 && number <= 0xFFFFFF ? number : fallback;
}

function setting(value, fallback, maximum) {
  var n = Number(value);
  return value !== undefined && isFinite(n) && Math.floor(n) === n && n >= 0 && n <= maximum ? n : fallback;
}

function sendSaved(preview) {
  var raw = localStorage.getItem('clay-settings');
  if (!raw) return;
  var saved;
  try { saved = JSON.parse(raw) || {}; } catch (error) { return; }
  var format = Number(saved.TimeFormat);
  if (format !== 0 && format !== 1) format = 0;
  var model = Number(saved.PhoneModel);
  if (model !== 0 && model !== 1 && model !== 2) model = 2;
  var payload = {
    PeekEnabled: saved.PeekEnabled === true || saved.PeekEnabled === 1 ? 1 : 0,
    KnockSensitivity: setting(saved.KnockSensitivity, 2, 2),
    PaneMode: setting(saved.PaneMode, 0, 4),
    AnimationSpeed: setting(saved.AnimationSpeed, 1, 2),
    WrongGuesses: setting(saved.WrongGuesses, 1, 2),
    QuietEnabled: saved.QuietEnabled === true || saved.QuietEnabled === 1 ? 1 : 0,
    QuietStart: setting(saved.QuietStart, 22, 23),
    QuietEnd: setting(saved.QuietEnd, 7, 23),
    RazrPalette: setting(saved.RazrPalette, 0, 1),
    TimeFormat: format,
    ZeroWording: Number(saved.ZeroWording) === 1 ? 1 : 0,
    PhoneModel: model,
    ShowBattery: saved.ShowBattery === undefined ? (model === 2 ? 0 : 1) :
      (saved.ShowBattery === false || saved.ShowBattery === 0 ? 0 : 1),
    UseModelColors: saved.UseModelColors === undefined ? (legacyCustom ? 0 : 1) :
      (saved.UseModelColors === false || saved.UseModelColors === 0 ? 0 : 1),
    BackgroundColor: color(saved.BackgroundColor, 0xAAFFAA),
    TextColor: color(saved.TextColor, 0x000000)
  };
  if(preview === true)payload.Preview=1;
  Pebble.sendAppMessage(payload);
}

function syncWeather() {
  var saved;
  try { saved = JSON.parse(localStorage.getItem('clay-settings') || '{}') || {}; } catch (error) { saved = {}; }
  var mode=setting(saved.PaneMode,0,4);
  weather.configure(Pebble, mode !== 0);
  peek.configure(Pebble, (saved.PeekEnabled === true || saved.PeekEnabled === 1) && (mode===2 || mode===3));
}
Pebble.addEventListener('configmessage',function(event){peek.handle(event.data || {},function(reply){event.respond(reply);});});
Pebble.addEventListener('ready', function() { sendSaved(); syncWeather(); });

Pebble.addEventListener('showConfiguration', function() {
  Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function(event) {
  if (!event || !event.response) {peek.cancel();return;}
  try {
    clay.getSettings(event.response);
    peek.commit();
    sendSaved(true);
    syncWeather();
  } catch (error) {
    peek.cancel();
    console.log('Could not read T9 Time settings: ' + error.message);
  }
});
