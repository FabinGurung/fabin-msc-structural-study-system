# Data Dictionary v0.1

- `program_id`: stable identifier for the MSc program.
- `subject_id`: stable internal subject identifier (`MTH504-NMA`).
- `unit_id`: stable official syllabus unit identifier (`NMA-U01`...`NMA-U07`).
- `topic_id`: stable topic identifier nested under a unit.
- `source_id`: stable pointer to the evidence source. Raw source may remain outside GitHub.
- `question_id`: permanent question identifier to be assigned only after duplicate/source-page review.
- `verification_status`: RAW / TRANSCRIBED / CLASSIFIED / SOLVED / VERIFIED / UNCLEAR_SOURCE / CONFLICTING_SOURCES.

IDs must not be renumbered merely because new sources are added later.
