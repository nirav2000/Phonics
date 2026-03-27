Project: Word Vault v4

What changed:
- Built review mode on top of the working Firebase v3 version.
- Added two review modes:
  1. Flashcards
  2. Meaning match
- Added status updates to mark words as review/secure.
- Kept reusable voice module in separate file.

Important architecture note:
- This app still uses the Firebase web client directly.
- Because of that, Firestore test mode is fine for prototyping but not safe for real deployment.
- Default Firestore production mode denies all client reads/writes, so switching to it without adding auth/rules will break the app.

Recommended next product step:
- Add Firebase Authentication
- Then write owner-based rules
- Then move off test mode

Potential next features:
- Confusion-pair review (Maisie vs messy)
- Chunk builder review mode
- Streaks/history
- Auto-generate distractors more intelligently
- Alexa review flow
