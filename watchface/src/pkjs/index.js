var Clay = require('@rebble/clay');

var clay = new Clay([
  {type: 'heading', defaultValue: 'T9 Time'},
  {type: 'text', defaultValue: 'The hour and minute type themselves at each minute change.'},
  {type: 'select', messageKey: 'TimeFormat', label: 'Time format', defaultValue: '0', options: [
    {label: '12-hour', value: '0'},
    {label: '24-hour', value: '1'}
  ]},
  {type: 'heading', defaultValue: 'Colors'},
  {type: 'text', defaultValue: 'Choose contrasting colors so the time stays readable.'},
  {type: 'color', messageKey: 'BackgroundColor', label: 'Background', defaultValue: 'AAFFAA', sunlight: false, allowGray: true},
  {type: 'color', messageKey: 'TextColor', label: 'Digits, words and keypad', defaultValue: '000000', sunlight: false, allowGray: true},
  {type: 'submit', defaultValue: 'Save to watch'}
]);

function color(value, fallback) {
  var number = Number(value);
  return isFinite(number) && Math.floor(number) === number &&
    number >= 0 && number <= 0xFFFFFF ? number : fallback;
}

function sendSaved() {
  var raw = localStorage.getItem('clay-settings');
  if (!raw) return;
  var saved;
  try { saved = JSON.parse(raw) || {}; } catch (error) { return; }
  var format = Number(saved.TimeFormat);
  if (format !== 0 && format !== 1) format = 0;
  Pebble.sendAppMessage({
    TimeFormat: format,
    BackgroundColor: color(saved.BackgroundColor, 0xAAFFAA),
    TextColor: color(saved.TextColor, 0x000000)
  });
}

Pebble.addEventListener('ready', sendSaved);
