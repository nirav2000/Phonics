Project: Word Vault v5 consolidated

Goal:
Consolidate earlier versions into one stable build without dropping features.

Delivered in v5:
- Firebase settings are no longer hardcoded into app code
- Settings live in a modal menu, not the permanent daily UI
- Ability to paste Firebase JSON and familyId, or load config JSON file
- Voices grouped by region to reduce clutter
- Book/source tracking restored
- Import/export restored
- Auto-fill helpful info restored
- Review mode added
- Starter words auto-load from starter-words.json if present
- Reusable voice module preserved

Next priorities:
1. Add Firebase Authentication
2. Add secure Firestore rules and move away from test mode safely
3. Add richer review analytics
4. Add confusion-pair drills
5. Add Alexa integration back on top of this consolidated version
