from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from editor.component_catalog import (
    ComponentFormatError,
    install_component,
    load_components,
    parse_component,
    rebuild_generated_catalog,
    set_component_enabled,
)


def example_payload() -> dict[str, object]:
    return {
        "format": "plantilla-compt",
        "formatVersion": 2,
        "id": "componente-prueba",
        "name": "Componente de prueba",
        "version": "1.0.0",
        "description": "Componente utilizado por las pruebas.",
        "variant": "feature",
        "slot": "before-rsvp",
        "height": 360,
        "enabled": True,
        "code": {
            "html": "<section><h2>Título</h2></section>",
            "css": "section{padding:2rem}",
            "js": "console.info('component-ready');",
        },
    }


class ComponentCatalogTests(unittest.TestCase):
    @staticmethod
    def create_template(root: Path, template_id: str = "demo") -> Path:
        template_root = root / template_id / "source"
        template_root.mkdir(parents=True)
        (template_root / "package.json").write_text('{}\n', encoding="utf-8")
        descriptor = {
            "id": template_id,
            "name": template_id.title(),
            "source": "source",
            "valuesFile": "src/generated/template-values.json",
            "fields": [],
        }
        (root / template_id / "template.json").write_text(
            json.dumps(descriptor), encoding="utf-8"
        )
        return template_root

    def test_valid_component_is_parsed(self) -> None:
        raw = json.dumps(example_payload()).encode()
        component = parse_component(raw)
        self.assertEqual(component.component_id, "componente-prueba")
        self.assertEqual(component.variant, "feature")

    def test_script_tag_outside_js_is_rejected(self) -> None:
        payload = example_payload()
        payload["code"] = {
            "html": "<script>alert(1)</script>",
            "css": "body{color:black}",
            "js": "console.info('safe-place');",
        }
        with self.assertRaises(ComponentFormatError):
            parse_component(json.dumps(payload).encode())

    def test_html_css_and_js_are_all_required(self) -> None:
        payload = example_payload()
        payload["code"] = {"html": "<section></section>", "css": "section{}"}
        with self.assertRaises(ComponentFormatError):
            parse_component(json.dumps(payload).encode())

    def test_install_toggle_and_generate(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            template_root = self.create_template(root)
            component = install_component(root, json.dumps(example_payload()).encode(), "test.compt")
            self.assertTrue(component.enabled)
            set_component_enabled(root, component.component_id, False)
            installed, errors = load_components(root)
            self.assertFalse(errors)
            self.assertFalse(installed[0].enabled)
            generated = rebuild_generated_catalog(root)
            self.assertEqual(generated, [template_root / "src" / "generated" / "installed-components.json"])
            self.assertTrue(generated[0].is_file())
            payload = json.loads(generated[0].read_text(encoding="utf-8"))
            self.assertFalse(payload[0]["enabled"])

    def test_component_catalog_is_shared_by_every_template(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            first = self.create_template(root, "first")
            second = self.create_template(root, "second")
            install_component(root, json.dumps(example_payload()).encode(), "shared.compt")

            outputs = rebuild_generated_catalog(root)
            self.assertEqual(
                outputs,
                [
                    first / "src" / "generated" / "installed-components.json",
                    second / "src" / "generated" / "installed-components.json",
                ],
            )
            for output in outputs:
                payload = json.loads(output.read_text(encoding="utf-8"))
                self.assertEqual(payload[0]["id"], "componente-prueba")


if __name__ == "__main__":
    unittest.main()
