"""Verify the stable T9 multi-platform production bundle."""
from pathlib import Path
import json,zipfile
ROOT=Path(__file__).resolve().parents[1]
def main():
 package=json.loads((ROOT/'watchface/package.json').read_text())
 assert package['pebble']['targetPlatforms']==['emery','chalk','gabbro']
 with zipfile.ZipFile(ROOT/'dist/t9-watch.pbw') as bundle:
  info = json.loads(bundle.read('appinfo.json'))
  assert info['uuid'] == package['pebble']['uuid']
  assert info['versionLabel'] == package['version']
  assert info['targetPlatforms'] == package['pebble']['targetPlatforms']
  for platform in ['emery','chalk','gabbro']:
   assert bundle.read(platform+'/pebble-app.bin')==(ROOT/'watchface/build'/platform/'pebble-app.bin').read_bytes()
  assert 'pebble-js-app.js' in bundle.namelist()
 print('PASS: stable T9 identity and three native production binaries')
if __name__=='__main__':main()
