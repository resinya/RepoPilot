#!/usr/bin/env python3
"""Read-only directory inventory. Python 3.10+, standard library only.

Prints Markdown paths and coverage; never opens target file contents or writes state.
Does not dispatch workflows, detect frameworks, or persist knowledge.
"""

import argparse
import os
import stat
import sys
from itertools import islice
from pathlib import Path

EXCLUDED_DIRS = {
    ".git", ".repopilot", ".agents", ".codex", ".claude", ".cursor", ".workbuddy", ".aws", ".ssh",
    "node_modules", "vendor", ".venv", "venv", "__pycache__", ".cache",
    ".next", ".nuxt", ".turbo", ".vite", ".build", "dist", "dev_dist", "build", "out", "target", "coverage",
    "library", "temp", "logs", "obj", "builds", "deriveddata", "pods", ".gradle",
}
MANIFESTS = {
    "package.json", "pom.xml", "build.gradle", "build.gradle.kts", "go.mod",
    "pyproject.toml", "requirements.txt", "Cargo.toml",
}
CONFIGS = {
    "pnpm-workspace.yaml", "go.work", "turbo.json", "nx.json",
    "settings.gradle", "settings.gradle.kts", "Dockerfile", "compose.yaml",
    "docker-compose.yml", "tsconfig.json", "vite.config.ts", "vite.config.js",
    "next.config.js", "next.config.mjs", "next.config.ts", "nginx.conf",
    "app.json", "app.config.js", "app.config.ts", "metro.config.js", "babel.config.js",
    "ProjectVersion.txt", "EditorBuildSettings.asset",
}


def is_link(info):
    """Include Windows junctions/reparse points, not just POSIX symlinks."""
    return stat.S_ISLNK(info.st_mode) or bool(
        getattr(info, "st_file_attributes", 0) & 0x400
    )


def private_name(name):
    lowered = name.lower()
    return (
        lowered.startswith(".env")
        or lowered in {"credentials", "secrets", "id_rsa", "id_ed25519"}
        or lowered.endswith((".pem", ".key", ".p12", ".pfx", ".crt"))
    )


def inventory(root, max_entries=10_000, max_depth=16):
    """Complete means traversal within exclusions, not complete project analysis."""
    if max_entries < 1 or max_depth < 0:
        raise ValueError("Invalid inventory limits")
    root = Path(root).absolute()
    if is_link(root.lstat()) or not root.is_dir():
        raise ValueError("Root must be a regular directory")
    root = root.resolve()
    result = {
        "status": "complete", "entries": 0, "directories": 0,
        "manifests": [], "configs": [], "docs": [], "boundaries": [],
        "diagnostics": [], "excluded": 0,
    }
    pending = [(root, 0)]
    while pending:
        directory, depth = pending.pop()
        relative = directory.relative_to(root).as_posix()
        try:
            if is_link(directory.lstat()) or not directory.resolve().is_relative_to(root):
                result["boundaries"].append((relative, "link/outside root"))
                result["status"] = "partial"
                continue
            if directory != root and os.path.lexists(directory / ".git"):
                result["boundaries"].append((relative, "nested Git/submodule"))
                result["status"] = "partial"
                continue
            remaining = max_entries - result["entries"]
            with os.scandir(directory) as iterator:
                entries = list(islice(iterator, remaining + 1))
            exhausted = len(entries) > remaining
            entries = sorted(entries[:remaining], key=lambda entry: entry.name)
            result["directories"] += 1
            result["entries"] += len(entries)
            for entry in entries:
                path = Path(entry.path).relative_to(root).as_posix()
                if entry.name.lower() in EXCLUDED_DIRS or private_name(entry.name):
                    result["excluded"] += 1
                    continue
                try:
                    info = entry.stat(follow_symlinks=False)
                    if is_link(info):
                        result["boundaries"].append((path, "link/reparse point"))
                        result["status"] = "partial"
                    elif stat.S_ISDIR(info.st_mode):
                        if depth >= max_depth:
                            result["diagnostics"].append((path, "depth limit"))
                            result["status"] = "partial"
                        else:
                            pending.append((Path(entry.path), depth + 1))
                    elif stat.S_ISREG(info.st_mode):
                        if entry.name in MANIFESTS or path == "Packages/manifest.json" or path.endswith("/Packages/manifest.json"):
                            result["manifests"].append(path)
                        elif entry.name in CONFIGS or path.startswith(".github/workflows/"):
                            result["configs"].append(path)
                        elif entry.name.lower().startswith(("readme", "contributing")):
                            result["docs"].append(path)
                except OSError:
                    result["diagnostics"].append((path, "unreadable entry"))
                    result["status"] = "partial"
            if exhausted or (result["entries"] >= max_entries and pending):
                result["diagnostics"].append((relative, "entry budget reached; pending paths not visited"))
                result["status"] = "partial"
                break
        except OSError:
            result["diagnostics"].append((relative, "unreadable directory"))
            result["status"] = "partial"
    for key in ("manifests", "configs", "docs", "boundaries", "diagnostics"):
        result[key].sort()
    return result


def code_path(value):
    return "`" + " ".join(value.replace("`", "'").split()) + "`"


def render(result):
    lines = [
        "# Repository directory inventory", "",
        f"Coverage: {result['status']}; inspected entries: {result['entries']}; "
        f"directories: {result['directories']}; excluded entries: {result['excluded']}.",
        "No target file contents were read. Candidates are not confirmed applications.",
    ]
    for title, key in [("Project manifest candidates", "manifests"),
                       ("Configuration candidates", "configs"), ("Documentation", "docs")]:
        lines.extend(["", f"## {title}", ""])
        lines.extend(f"- {code_path(path)}" for path in result[key])
        if not result[key]:
            lines.append("None discovered within the visited scope.")
    lines.extend(["", "## Boundaries and limitations", ""])
    lines.append("Fixed exclusions apply; .gitignore is not interpreted. No framework inference or persistence.")
    for path, reason in result["boundaries"] + result["diagnostics"]:
        lines.append(f"- {code_path(path)}: {reason}")
    return "\n".join(lines) + "\n"


def positive(value):
    number = int(value)
    if number < 1:
        raise argparse.ArgumentTypeError("must be positive")
    return number


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", required=True, type=Path)
    parser.add_argument("--max-entries", type=positive, default=10_000)
    parser.add_argument("--max-depth", type=positive, default=16)
    args = parser.parse_args()
    try:
        report = inventory(args.root, args.max_entries, args.max_depth)
    except (OSError, ValueError):
        print("Cannot inventory root: use an accessible regular directory.", file=sys.stderr)
        return 1
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    print(render(report), end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
