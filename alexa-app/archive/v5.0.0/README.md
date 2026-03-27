# Word Vault v5

This version consolidates earlier features instead of removing them.

## Included
- add, edit, delete, search, and filter words
- book/source tracking restored
- import and export restored
- auto-fill helpful info restored
- review mode with flashcards and meaning quiz
- optional Firebase sync
- voice settings hidden in Settings
- voices grouped by region
- reusable voice module in `word-vault-voice.js`
- auto-load starter words from `starter-words.json` if present

## Firebase
Nothing is hardcoded into app code.

1. Open Settings in the app.
2. Paste your Firebase web config JSON only.
3. Add a family ID like `shamir-son-reading`.
4. Save settings.

Or load a config file shaped like `firebase-config-template.json`.

## Voice module reuse
```js
import { WordVaultVoice } from './word-vault-voice.js';
const voice = new WordVaultVoice({ lang: 'en-GB' });
await voice.getVoices();
voice.setVoiceByURI('some-voice-uri');
voice.speak('blizzard', { rate: 0.95, pitch: 1 });
```

Methods:
- `await voice.wake()`
- `await voice.getVoices()`
- `voice.setVoiceByIndex(index)`
- `voice.setVoiceByURI(voiceURI)`
- `voice.speak(text, options)`

## Firestore test mode
Fine for prototyping. For real use, move away from test mode after adding Firebase Authentication and proper security rules.
