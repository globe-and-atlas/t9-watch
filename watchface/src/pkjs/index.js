var Clay = require('@rebble/clay');

var previous = {};
try { previous = JSON.parse(localStorage.getItem('clay-settings') || '{}') || {}; } catch (error) {}
var legacyCustom = previous.UseModelColors === undefined &&
  ((previous.BackgroundColor !== undefined && Number(previous.BackgroundColor) !== 0xAAFFAA) ||
   (previous.TextColor !== undefined && Number(previous.TextColor) !== 0x000000));

var hours = [];
for (var h = 0; h < 24; h++) hours.push({label: ('0' + h).slice(-2) + ':00', value: String(h)});

var clay = new Clay([
  {type: 'heading', defaultValue: 'T9 Time'},
  {type: 'text', defaultValue: 'The hour and minute type themselves at each minute change.'},
  {type: 'select', messageKey: 'TimeFormat', label: 'Time format', defaultValue: '0', options: [
    {label: '12-hour', value: '0'},
    {label: '24-hour', value: '1'}
  ]},
  {type: 'select', messageKey: 'ZeroWording', label: 'At :00', defaultValue: '0', options: [
    {label: "O'CLOCK (2 lines)", value: '0'},
    {label: 'OH ZERO (3 lines)', value: '1'}
  ]},
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
], null, {autoHandleEvents: false});

function color(value, fallback) {
  var number = Number(value);
  return isFinite(number) && Math.floor(number) === number &&
    number >= 0 && number <= 0xFFFFFF ? number : fallback;
}

function setting(value, fallback, maximum) {
  var n = Number(value);
  return value !== undefined && isFinite(n) && Math.floor(n) === n && n >= 0 && n <= maximum ? n : fallback;
}

function sendSaved() {
  var raw = localStorage.getItem('clay-settings');
  if (!raw) return;
  var saved;
  try { saved = JSON.parse(raw) || {}; } catch (error) { return; }
  var format = Number(saved.TimeFormat);
  if (format !== 0 && format !== 1) format = 0;
  var model = Number(saved.PhoneModel);
  if (model !== 0 && model !== 1 && model !== 2) model = 2;
  Pebble.sendAppMessage({
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
  });
}

Pebble.addEventListener('ready', sendSaved);

Pebble.addEventListener('showConfiguration', function() {
  Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function(event) {
  if (!event || !event.response) return;
  try {
    var settings = clay.getSettings(event.response);
    settings.Preview = 1;
    Pebble.sendAppMessage(settings);
  } catch (error) {
    console.log('Could not read T9 Time settings: ' + error.message);
  }
});
