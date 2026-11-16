"""Publish only the isolated T9 Time Labs identity."""
from __future__ import annotations
import argparse,json,subprocess,os,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
LABS_UUID="25e30e2c-4605-46fd-96be-3bfe5fb7a110"

def main() -> None:
    parser=argparse.ArgumentParser(description=__doc__)
    mode=parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--dry-run",action="store_true")
    mode.add_argument("--publish",action="store_true")
    args=parser.parse_args()
    metadata=json.loads((ROOT/"labs/watchface/package.json").read_text())
    stable=json.loads((ROOT/"watchface/package.json").read_text())
    assert metadata["pebble"]["uuid"]==LABS_UUID
    assert stable["pebble"]["uuid"]!=LABS_UUID
    assert metadata["pebble"]["displayName"]=="T9 Time Labs"
    artifact=ROOT/"dist/t9-time-labs.pbw"
    with zipfile.ZipFile(artifact) as archive:
        app=json.loads(archive.read("appinfo.json"))
        assert app["uuid"]==LABS_UUID
        assert not app.get("plugin")
        assert app["watchapp"]["watchface"] is True
    screenshots=[ROOT/".tmp/labs-store"/name for name in ["emery_time.png","emery_weather.png","emery_peek.png"]]
    assert len(screenshots)==3
    assert all(p.is_file() for p in screenshots)
    command=["uv","tool","run","--python","3.13","--from","pebble-tool==5.1.1","pebble","publish",
        "--non-interactive","--is-published","--no-gif-all-platforms","--name","T9 Time Labs",
        "--description",(ROOT/"release/labs-description.txt").read_text(),"--category","faces",
        "--release-notes","Add Plugin Peek: choose an installed plugin, reading and item in settings. Triple-knock opens Peek; double-knock keeps Weather with a brief third-tap wait. Full keypad on every pane. Typed settings Save applies immediately. Stable T9 Time unchanged.",
        "--replace-screenshots","--screenshots"]+[str(p) for p in screenshots]
    if args.dry_run:
        print(json.dumps({"name":"T9 Time Labs","uuid":LABS_UUID,"version":metadata["version"],"category":"faces","bundled_plugin":False,"screenshots":[p.name for p in screenshots]},indent=2))
        return
    environment={k:v for k,v in os.environ.items() if not k.startswith("T9_FIXTURE_")}
    result=subprocess.run(command,cwd=ROOT/"labs/watchface",env=environment,text=True,capture_output=True,timeout=240)
    (ROOT/".tmp/labs-publish.log").write_text(result.stdout+result.stderr)
    print(result.stdout+result.stderr)
    if result.returncode: raise SystemExit(result.returncode)
    # Publish rebuilds the PBW. Preserve precisely that artifact for public verification.
    import shutil
    shutil.copy2(ROOT/"labs/watchface/build/watchface.pbw",artifact)

if __name__=="__main__": main()
