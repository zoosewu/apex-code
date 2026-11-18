"""驗證 api/ 下的資料（只用標準函式庫）。用法：py tools/check.py"""
import json
import re
import struct
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://zoosewu.github.io/apex-code/"
errors: list[str] = []


def err(where: str, msg: str) -> None:
    errors.append(f"{where}: {msg}")


def png_size(path: Path) -> tuple[int, int] | None:
    head = path.read_bytes()[:24]
    if head[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    return struct.unpack(">II", head[16:24])


def check_type(where: str, value, schema: dict, defs: dict) -> None:
    """支援本專案 schema 用到的 JSON Schema 子集。"""
    if "$ref" in schema:
        return check_type(where, value, defs[schema["$ref"].split("/")[-1]], defs)
    if "oneOf" in schema:
        trial = []
        for sub in schema["oneOf"]:
            before = len(errors)
            check_type(where, value, sub, defs)
            trial.append(len(errors) == before)
            del errors[before:]
        if trial.count(True) != 1:
            err(where, "不符合任何一種允許的型別")
        return
    if "enum" in schema and value not in schema["enum"]:
        err(where, f"{value!r} 不在 {schema['enum']}")
    types = schema.get("type")
    if types:
        types = types if isinstance(types, list) else [types]
        py = {"object": dict, "array": list, "string": str, "integer": int, "null": type(None)}
        if not any(isinstance(value, py[t]) and not (t == "integer" and isinstance(value, bool)) for t in types):
            return err(where, f"型別應為 {types}")
    if isinstance(value, str) and "pattern" in schema and not re.search(schema["pattern"], value):
        err(where, f"{value!r} 不符合 {schema['pattern']}")
    if isinstance(value, dict):
        for key in schema.get("required", []):
            if key not in value:
                err(where, f"缺少 {key}")
        for key, sub in schema.get("properties", {}).items():
            if key in value:
                check_type(f"{where}.{key}", value[key], sub, defs)
    if isinstance(value, list) and "items" in schema:
        for i, item in enumerate(value):
            check_type(f"{where}[{i}]", item, schema["items"], defs)


def main() -> int:
    index = json.loads((ROOT / "api/index.json").read_text(encoding="utf-8"))
    for v in index["versions"]:
        path = v["path"]
        data = json.loads((ROOT / f"api/{path}/projects.json").read_text(encoding="utf-8"))
        schema = json.loads((ROOT / f"api/{path}/schema.json").read_text(encoding="utf-8"))
        where = f"api/{path}"
        check_type(where, data, schema, schema["$defs"])

        if not data["apiVersion"].startswith(path[1:] + "."):
            err(where, f"apiVersion {data['apiVersion']} 和路徑 {path} 的主版號不一致")
        if data["apiVersion"] != v["apiVersion"]:
            err("api/index.json", f"{path} 的 apiVersion 應為 {data['apiVersion']}")

        ids = [p["id"] for p in data["projects"]]
        if len(ids) != len(set(ids)):
            err(where, "id 重複")
        for p in data["projects"]:
            pw = f"{where}:{p['id']}"
            for r in p["related"]:
                if r not in ids:
                    err(pw, f"related 找不到 {r}")
            for i, shot in enumerate(p["screenshots"]):
                for lang, url in shot["src"].items():
                    if not url.startswith(SITE):
                        continue
                    file = ROOT / url[len(SITE):]
                    if not file.exists():
                        err(pw, f"截圖不存在：{file.relative_to(ROOT)}")
                    elif (size := png_size(file)) and size != (shot["width"], shot["height"]):
                        err(pw, f"screenshots[{i}].{lang} 實際尺寸 {size} 與 width/height 不符")

    for e in errors:
        print("✗", e)
    print("OK" if not errors else f"{len(errors)} 個錯誤")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
