# Word Vault v4 – Review Mode

This version keeps the Firebase web config already working in your v3 app and adds a real review area.

## What v4 adds
- Flashcard review mode
- Meaning-match quiz mode
- Mark words as **secure** or **still tricky**
- Review score tracking
- Same reusable voice module pattern as before

## Files
- `index.html` – main app
- `word-vault-voice.js` – reusable voice helper
- `firestore-rules-production.txt` – starter production rules example
- `CODEX-HANDOFF.md` – summary for Codex

## Current Firebase setup
This app already contains your Firebase web config inside `index.html`.
Default family ID: `shamir-son-reading`

## Important note about Firestore test mode vs production mode
### Test mode
Good for prototyping, but it allows very broad access and should not be left that way for a real app.

### Production mode
The default production rules deny all reads and writes from web/mobile clients.
That means if you switch straight to production mode today, this client-only app will stop working unless you also add Firebase Authentication and rules that allow your intended access pattern.

## Recommendation
- Keep Firestore in **test mode only while prototyping**.
- Before real use, add Firebase Authentication or move writes/reads behind a trusted backend.
- Then switch rules away from open/test rules.

## If you still want to move out of test mode now
1. In Firebase Console, open **Firestore Database**.
2. Open the **Rules** tab.
3. Replace the open/test rules with your new rules.
4. Click **Publish**.

That is effectively how you move from test mode to a more secure setup.

## Why not just click “production mode” now?
Because the current app uses the web client SDK directly. Firebase’s default production rules deny those reads and writes unless your rules explicitly allow them.

## Suggested next security upgrade
Best next step:
1. Add Firebase Authentication
2. Sign in the parent account
3. Save an `owner_uid` on each word
4. Write rules that only allow that owner to read/write

That would be a proper production-ready path.

## Voice module reuse
Include in another app:
```html
<script src="word-vault-voice.js"></script>
```

Create instance:
```js
const voice = new WordVaultVoice({ lang: 'en-GB' });
```

Load voices:
```js
const voices = await voice.getVoices();
```
Returns an array of SpeechSynthesisVoice objects.

Change voice:
```js
voice.setVoiceByIndex(0);
```
Returns the selected voice object.

Speak text:
```js
await voice.speak('blizzard', { rate: 0.9, pitch: 1.0 });
```
Returns a promise that resolves when speaking ends.

Wake up voices on iPad/browser:
```js
await voice.wakeUp();
```
Use this from a tap/click before first speech playback.
