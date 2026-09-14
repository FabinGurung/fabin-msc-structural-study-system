# Governed deployment

This source folder is not itself a live release.

1. Freeze the whole folder in canonical MTH504 Drive with a file manifest and checksums.
2. Register source folder, frozen ZIP, manifest and checkpoint in the Drive Index / Artifact Registry / lineage graph / RunLog / VersionLog.
3. Use Google Colab as the bounded GitHub writer.
4. Create a **new branch** from the exact approved base. Do not modify `main` and do not overwrite `mth504-v1.2-beta`.
5. Push this entire folder to a distinct bounded repo route.
6. Independently read the remote commit/tree/files back through GitHub.
7. Run desktop/mobile/browser and content-safety QA.
8. Only after approval: immutable prerelease tag + Release.
9. Pages is a separate promotion gate with beta.1/stable rollback preserved.
