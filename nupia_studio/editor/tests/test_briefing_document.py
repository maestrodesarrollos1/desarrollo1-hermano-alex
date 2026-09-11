from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from docx import Document

from editor.briefing_document import (
    BriefingDocumentError,
    create_briefing_document,
    create_global_briefing_document,
    import_briefing_document,
)
from editor.catalog import discover_templates
from editor.workspace import TEMPLATES_ROOT


class BriefingDocumentTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.templates = discover_templates(TEMPLATES_ROOT)
        cls.template = next(template for template in cls.templates if template.template_id == "boda-anillo-verde")

    def test_briefing_round_trip_imports_known_values(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "briefing.docx"
            create_briefing_document(self.template, path)
            document = Document(path)
            for table in document.tables:
                for row in table.rows[1:]:
                    if len(row.cells) >= 3 and row.cells[2].text.strip() == "couple.partner1":
                        row.cells[1].text = "Lucía"
            document.save(path)

            result = import_briefing_document(path, self.template, self.template.current_values())

        self.assertEqual(result.values["couple.partner1"], "Lucía")
        self.assertIn("couple.partner1", result.imported_fields)

    def test_briefing_rejects_a_different_template(self) -> None:
        other_template = next(template for template in self.templates if template.template_id != self.template.template_id)
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "other.docx"
            create_briefing_document(other_template, path)
            with self.assertRaises(BriefingDocumentError):
                import_briefing_document(path, self.template, self.template.current_values())

    def test_global_briefing_imports_into_any_template(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "global.docx"
            create_global_briefing_document(self.templates, path)
            result = import_briefing_document(path, self.template, self.template.current_values())

        self.assertEqual(result.template_id, "nupia-global")
        self.assertIn("theme.radius", result.imported_fields)
