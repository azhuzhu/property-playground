"""Generate language models from the canonical OpenAPI document."""

from __future__ import annotations

import argparse
import filecmp
import os
import shutil
import subprocess
import uuid
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GENERATOR_IMAGE = os.getenv(
    "OPENAPI_GENERATOR_IMAGE",
    "docker.io/openapitools/openapi-generator-cli:v7.14.0",
)
CONTAINER_CLIENT = os.getenv("CONTAINER_CLIENT", "docker")


@dataclass(frozen=True)
class GenerationTarget:
    language: str
    arguments: tuple[str, ...]
    generated_path: Path
    repository_path: Path


TARGETS = (
    GenerationTarget(
        language="Python",
        arguments=(
            "-g",
            "python",
            "--package-name",
            "property_playground_contracts",
            "--additional-properties=hideGenerationTimestamp=true",
            "--global-property=models,modelDocs=false,modelTests=false,supportingFiles=__init__.py",
        ),
        generated_path=Path("python/property_playground_contracts/models"),
        repository_path=Path("contracts/generated/python/property_playground_contracts/models"),
    ),
    GenerationTarget(
        language="Java",
        arguments=(
            "-g",
            "spring",
            "--model-package",
            "com.propertyplayground.contracts",
            "--additional-properties=useSpringBoot3=true,useJakartaEe=true,"
            "openApiNullable=false,hideGenerationTimestamp=true",
            "--global-property=models,modelDocs=false,modelTests=false",
        ),
        generated_path=Path("java/src/main/java/com/propertyplayground/contracts"),
        repository_path=Path(
            "services/market-api/src/main/java/com/propertyplayground/contracts"
        ),
    ),
    GenerationTarget(
        language="TypeScript",
        arguments=(
            "-g",
            "typescript-fetch",
            "--additional-properties=modelPropertyNaming=original,hideGenerationTimestamp=true",
            "--global-property=models,modelDocs=false,modelTests=false,supportingFiles=runtime.ts",
        ),
        generated_path=Path("typescript"),
        repository_path=Path("portal/lib/generated/openapi"),
    ),
)


def generate(target: GenerationTarget, temporary_root: Path) -> None:
    """Run the official generator for one language."""
    relative_output = temporary_root.relative_to(ROOT) / target.language.lower()
    command = [
        CONTAINER_CLIENT,
        "run",
        "--rm",
        "-v",
        f"{ROOT}:/local",
        GENERATOR_IMAGE,
        "generate",
        "-i",
        "/local/contracts/openapi.yaml",
        "-o",
        f"/local/{relative_output}",
        *target.arguments,
    ]
    subprocess.run(command, cwd=ROOT, check=True)


def normalize_generated_sources(directory: Path) -> None:
    """Remove generator-template whitespace without changing generated semantics."""
    for path in directory.rglob("*"):
        if path.suffix not in {".java", ".py", ".ts"}:
            continue
        lines = path.read_text(encoding="utf-8").splitlines()
        content = "\n".join(line.rstrip() for line in lines).rstrip() + "\n"
        path.write_text(content, encoding="utf-8")


def directories_match(generated: Path, committed: Path) -> bool:
    """Compare generated source trees recursively, excluding generator metadata."""
    if not generated.is_dir() or not committed.is_dir():
        return False
    comparison = filecmp.dircmp(
        generated,
        committed,
        ignore=[".openapi-generator", "__pycache__"],
    )
    if comparison.left_only or comparison.right_only or comparison.diff_files:
        return False
    return all(
        directories_match(generated / name, committed / name)
        for name in comparison.common_dirs
    )


def sync_directory(generated: Path, destination: Path) -> None:
    """Replace one committed generated tree with fresh generator output."""
    if destination.exists():
        shutil.rmtree(destination)
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(generated, destination, ignore=shutil.ignore_patterns(".openapi-generator"))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail when generated models are stale")
    options = parser.parse_args()
    temporary_root = ROOT / "contracts" / f".openapi-generator-tmp-{uuid.uuid4().hex}"
    temporary_root.mkdir(parents=True)
    try:
        for target in TARGETS:
            generate(target, temporary_root)
            normalize_generated_sources(temporary_root / target.language.lower())

        stale: list[str] = []
        for target in TARGETS:
            generated = temporary_root / target.generated_path
            destination = ROOT / target.repository_path
            if options.check:
                if not directories_match(generated, destination):
                    stale.append(target.language)
            else:
                sync_directory(generated, destination)
        if stale:
            raise SystemExit(
                f"Generated {'/'.join(stale)} contracts are stale. Run `make contracts`."
            )
    finally:
        shutil.rmtree(temporary_root, ignore_errors=True)


if __name__ == "__main__":
    main()
