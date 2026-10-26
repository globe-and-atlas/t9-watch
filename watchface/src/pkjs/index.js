var Clay = require('@rebble/clay');

var previous = {};
try { previous = JSON.parse(localStorage.getItem('clay-settings') || '{}') || {}; } catch (error) {}
var legacyCustom = previous.UseModelColors === undefined &&
  ((previous.BackgroundColor !== undefined && Number(previous.BackgroundColor) !== 0xAAFFAA) ||
   (previous.TextColor !== undefined && Number(previous.TextColor) !== 0x000000));

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
  {type: 'heading', defaultValue: 'Phone model'},
  {type: 'select', messageKey: 'PhoneModel', label: 'Style', defaultValue: '0', options: [
    {label: 'Nokia 3310', value: '0'},
    {label: 'Motorola RAZR V3', value: '1'}
  ]},
  {type: 'toggle', messageKey: 'ShowBattery', label: 'Battery icon', defaultValue: true},
  {type: 'heading', defaultValue: 'Colors'},
  {type: 'toggle', messageKey: 'UseModelColors', label: 'Use model colors', defaultValue: !legacyCustom},
  {type: 'text', defaultValue: 'Turn off model colors to use the two color choices below.'},
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
    ZeroWording: Number(saved.ZeroWording) === 1 ? 1 : 0,
    PhoneModel: Number(saved.PhoneModel) === 1 ? 1 : 0,
    ShowBattery: saved.ShowBattery === false || saved.ShowBattery === 0 ? 0 : 1,
    UseModelColors: saved.UseModelColors === undefined ? (legacyCustom ? 0 : 1) :
      (saved.UseModelColors === false || saved.UseModelColors === 0 ? 0 : 1),
    BackgroundColor: color(saved.BackgroundColor, 0xAAFFAA),
    TextColor: color(saved.TextColor, 0x000000)
  });
}

Pebble.addEventListener('ready', sendSaved);
