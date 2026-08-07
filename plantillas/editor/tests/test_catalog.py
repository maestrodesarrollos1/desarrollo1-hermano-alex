from __future__ import annotations

import unittest

from editor.catalog import discover_templates, flatten_values, nest_values
from editor.app import REPO_ROOT


class CatalogTests(unittest.TestCase):
    def test_flatten_and_nest_round_trip(self) -> None:
        nested = {"couple": {"partner1": "Ana", "partner2": "Leo"}, "sections": {"intro": False}}
        self.assertEqual(nest_values(flatten_values(nested)), nested)

    def test_repository_catalog_is_valid(self) -> None:
        templates = discover_templates(REPO_ROOT)
        self.assertGreaterEqual(len(templates), 1)
        self.assertTrue(templates[0].source_path.is_dir())
        self.assertTrue(templates[0].fields)


if __name__ == "__main__":
    unittest.main()
