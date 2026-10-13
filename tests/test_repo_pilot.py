"""Behavior checks for the optional tool and complete copy of the Skill."""

import importlib.util
import os
import re
import shutil
import stat
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

REPO = Path(__file__).resolve().parents[1]
SKILL = REPO / "skills" / "repo-pilot"
TOOL = SKILL / "scripts" / "inventory.py"
spec = importlib.util.spec_from_file_location("inventory_tool", TOOL)
tool = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tool)


class InventoryTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="repopilot-tests-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)

    def file(self, path, content=""):
        target = self.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")
        return target

    def test_multiple_ecosystems_are_candidates_not_framework_inference(self):
        for path in ("package.json", "apps/前端/package.json", "services/java/pom.xml",
                     "services/go/go.mod", "services/python/pyproject.toml", "client/Packages/manifest.json"):
            self.file(path)
        self.file("pnpm-workspace.yaml")
        self.file("client/BadPackages/manifest.json")
        self.file("client/ProjectSettings/ProjectVersion.txt")
        self.file("apps/native/app.json")
        self.file("README.md")
        result = tool.inventory(self.root)
        self.assertEqual(result["status"], "complete")
        self.assertEqual(len(result["manifests"]), 6)
        self.assertEqual(result["configs"], ["apps/native/app.json", "client/ProjectSettings/ProjectVersion.txt", "pnpm-workspace.yaml"])
        self.assertEqual(result["docs"], ["README.md"])
        self.assertNotIn(str(self.root), tool.render(result))

    def test_never_reads_contents_or_executes_scripts(self):
        self.file("package.json", '{"scripts":{"scan":"create SENTINEL"},"secret":"SECRET_VALUE"}')
        self.file("next.config.js", "throw new Error('EXECUTED')")
        with patch("builtins.open", side_effect=AssertionError("File read")), \
             patch.object(Path, "open", side_effect=AssertionError("File read")):
            report = tool.render(tool.inventory(self.root))
        self.assertNotIn("SECRET_VALUE", report)
        self.assertFalse((self.root / "SENTINEL").exists())

    def test_generated_dependencies_credentials_and_knowledge_are_excluded(self):
        for directory in ("node_modules", "dist", "dev_dist", "coverage", ".vite", ".cursor",
                          ".workbuddy", ".git", ".repopilot", "技术栈demo", ".aws", "vendor", ".venv",
                          "Library", "Temp", "Logs", "Obj", "Builds", "Pods", ".gradle"):
            self.file(f"{directory}/package.json")
        self.file(".env.local")
        self.file("private.key")
        self.file("src/package.json")
        self.assertEqual(tool.inventory(self.root)["manifests"], ["src/package.json"])

    def test_nested_git_directory_and_submodule_file_are_boundaries(self):
        self.file("nested/.git/config")
        self.file("nested/package.json")
        self.file("module/.git", "gitdir: /outside/private")
        self.file("module/go.mod")
        result = tool.inventory(self.root)
        self.assertEqual(result["status"], "partial")
        self.assertEqual(result["manifests"], [])
        self.assertEqual(len(result["boundaries"]), 2)

    def test_symlink_is_not_followed(self):
        target = self.root / "source"
        target.mkdir()
        self.file("source/package.json")
        linked = self.root / "linked"
        try:
            linked.symlink_to(target, target_is_directory=True)
        except OSError:
            self.skipTest("OS does not permit symlinks")
        result = tool.inventory(self.root)
        self.assertEqual(result["manifests"], ["source/package.json"])
        self.assertIn(("linked", "link/reparse point"), result["boundaries"])
        with self.assertRaises(ValueError):
            tool.inventory(linked)

    def test_windows_reparse_points_are_links(self):
        self.assertTrue(tool.is_link(SimpleNamespace(st_mode=stat.S_IFDIR, st_file_attributes=0x400)))

    def test_budget_and_depth_limits_report_partial(self):
        for index in range(6):
            self.file(f"app{index}/package.json")
        result = tool.inventory(self.root, max_entries=2)
        self.assertEqual(result["status"], "partial")
        self.assertLessEqual(result["entries"], 2)
        self.assertEqual(tool.inventory(self.root, max_depth=0)["status"], "partial")

    def test_unreadable_directory_is_reported_without_error_values(self):
        with patch.object(tool.os, "scandir", side_effect=PermissionError("PRIVATE_PATH")):
            result = tool.inventory(self.root)
        self.assertEqual(result["status"], "partial")
        self.assertNotIn("PRIVATE_PATH", tool.render(result))

    def test_cli_is_read_only_and_handles_invalid_input(self):
        self.file("package.json")
        before = sorted(path.relative_to(self.root).as_posix() for path in self.root.rglob("*"))
        result = subprocess.run([sys.executable, "-B", str(TOOL), "--root", str(self.root)],
                                capture_output=True, encoding="utf-8")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("`package.json`", result.stdout)
        after = sorted(path.relative_to(self.root).as_posix() for path in self.root.rglob("*"))
        self.assertEqual(before, after)
        invalid = subprocess.run([sys.executable, "-B", str(TOOL), "--root", str(self.root),
                                  "--max-entries", "0"], capture_output=True)
        self.assertEqual(invalid.returncode, 2)
        missing = subprocess.run([sys.executable, "-B", str(TOOL), "--root", str(self.root / "missing")],
                                capture_output=True)
        self.assertEqual(missing.returncode, 1)

    def test_unusual_filenames_cannot_inject_report_lines(self):
        self.assertEqual(tool.code_path("src/`bad\n# injected"), "`src/'bad # injected`")

    def test_complete_copy_is_independent_of_development_repository(self):
        installed = self.root / "installed"
        shutil.copytree(SKILL, installed)
        target = self.root / "target"
        target.mkdir()
        (target / "go.mod").write_text("module example", encoding="utf-8")
        result = subprocess.run([sys.executable, "-B", str(installed / "scripts/inventory.py"),
                                 "--root", str(target)], cwd=target, capture_output=True, encoding="utf-8")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("`go.mod`", result.stdout)
        self.assertEqual(sorted(path.name for path in target.iterdir()), ["go.mod"])


class ResourceTests(unittest.TestCase):
    def test_all_markdown_references_stay_inside_complete_skill(self):
        # Each independently distributed Skill must keep its resources after copying.
        with tempfile.TemporaryDirectory(prefix="repopilot-resources-") as temporary:
            for entry in (REPO / "skills").glob("*/SKILL.md"):
                installed = Path(temporary) / entry.parent.name
                shutil.copytree(entry.parent, installed)
                for document in installed.rglob("*.md"):
                    for link in re.findall(r"\[[^\]]+\]\(([^)]+)\)", document.read_text(encoding="utf-8")):
                        if link.startswith(("https://", "http://", "#")):
                            continue
                        resolved = (document.parent / link.split("#")[0]).resolve()
                        self.assertTrue(resolved.is_relative_to(installed.resolve()), document)
                        self.assertTrue(resolved.is_file(), (document, link))


if __name__ == "__main__":
    unittest.main()
