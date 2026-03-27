# Word Vault v3 Firebase – Setup Guide

This folder now includes your Firebase web config already inserted into `index.html`.

## Exact place where the Firebase config is now stored

- File: `index.html`
- Starts at line: `95`
- Ends at line: `103`

The app initialises Firebase immediately after that:
- `initializeApp(firebaseConfig)` is on line `105`
- `getFirestore(app)` is on line `107`

## What is already incorporated

These values are already in `index.html`:

```js
const firebaseConfig = {
  apiKey: "AIzaSyBNW1VgFn_cdkcsXEYEkgoKByBmStd86fA",
  authDomain: "word-vault-b0ebb.firebaseapp.com",
  projectId: "word-vault-b0ebb",
  storageBucket: "word-vault-b0ebb.firebasestorage.app",
  messagingSenderId: "196919947356",
  appId: "1:196919947356:web:7433d030a26bfb74c5b699",
  measurementId: "G-EE5KDH4HEK"
};
```

## Quick start for Firebase

1. In Firebase console, open project `word-vault-b0ebb`.
2. Create Firestore Database if you have not already.
3. Start in **test mode** for initial setup.
4. Create a collection called `words`.
5. Host the app somewhere real such as Firebase Hosting or GitHub Pages. Do not rely on file preview for speech testing on iPad.

## Firestore rules for first test

Use this only for early setup and testing:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /words/{docId} {
      allow read, write: if true;
    }
  }
}
```

## What fields the app writes

Each saved word writes a document into `words` with fields like:
- `family_id`
- `word`
- `source`
- `phonics`
- `definition`
- `sentence`
- `similar`
- `notes`
- `created_at`

## Voice module – exact usage in another app

### File
- `word-vault-voice.js`

### How to include it

```html
<script src="word-vault-voice.js"></script>
```

### How to create an instance

```js
const voice = new WordVaultVoice({ lang: 'en-GB', rate: 0.9, pitch: 1 });
```

### What methods are available

#### `await voice.getVoices()`
Returns an array of browser voice objects.

Example:
```js
const voices = await voice.getVoices();
console.log(voices);
```

#### `await voice.wakeUp()`
Useful on iPad/iPhone before first real speech playback.

Example:
```js
await voice.wakeUp();
```

#### `voice.setVoiceByIndex(index)`
Sets the active voice using the index from the voices array.

Example:
```js
voice.setVoiceByIndex(0);
```

#### `voice.setVoiceByName(name)`
Sets the active voice by name.

Example:
```js
voice.setVoiceByName('Daniel');
```

#### `await voice.speak(text, options)`
Speaks the supplied text.

Example:
```js
await voice.speak('blizzard', { rate: 0.85, pitch: 1.0 });
```

### Minimal example for another app

```html
<select id="voiceSelect"></select>
<button id="testBtn">Speak</button>
<script src="word-vault-voice.js"></script>
<script>
  const voice = new WordVaultVoice({ lang: 'en-GB' });

  async function setupVoices() {
    const voices = await voice.getVoices();
    const select = document.getElementById('voiceSelect');
    select.innerHTML = '';
    voices.forEach((v, i) => {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `${v.name} (${v.lang})`;
      select.appendChild(option);
    });
  }

  document.getElementById('voiceSelect').addEventListener('change', (e) => {
    voice.setVoiceByIndex(e.target.value);
  });

  document.getElementById('testBtn').addEventListener('click', async () => {
    await voice.speak('This is a test word.', { rate: 0.9, pitch: 1 });
  });

  setupVoices();
</script>
```

## Alexa – step-by-step setup

### What you need first
- Amazon developer account
- AWS account
- Alexa app signed into the same Amazon account if you want to test on a real device

### Step 1 – open the Alexa developer console
Go to the Alexa developer console and sign in.

### Step 2 – create a new skill
1. Click **Create Skill**.
2. Skill name: `Word Vault`.
3. Choose **Custom** for the model.
4. Choose **Provision your own** for the backend.
5. Click **Create skill**.

### Step 3 – set the invocation name
In the Build tab, choose an invocation name such as:
- `word vault`

This is what the child says after “Alexa, open ...”.

### Step 4 – create the interaction model
1. Open **Build** > **JSON Editor**.
2. Paste your interaction model JSON there.
3. Save.
4. Click **Build Model**.
5. Wait until it says the model built successfully.

### Step 5 – create the Lambda function in AWS
1. Open AWS Lambda.
2. Click **Create function**.
3. Choose **Author from scratch**.
4. Function name: `word-vault-skill`.
5. Runtime: **Node.js 18.x** or the latest supported Node.js runtime available in Lambda.
6. Create the function.

### Step 6 – paste the Alexa backend code
1. In the Lambda code editor, paste your Alexa skill backend code.
2. Deploy the Lambda function.

### Step 7 – add Firebase Admin credentials to Lambda
For Alexa, do not use the browser web config. Use a Firebase service account JSON.

Get it from Firebase:
1. Open Firebase console.
2. Project settings.
3. Service accounts.
4. Generate new private key.
5. Download the JSON.

In Lambda, either:
- paste the JSON values into code, or
- better, store them in environment variables and build the service account object from those variables.

### Step 8 – copy the Lambda ARN
In AWS Lambda, copy the function ARN from the top-right area of the function page.

### Step 9 – connect Alexa to Lambda
Back in Alexa developer console:
1. Open **Build** > **Endpoint**.
2. Under **AWS Lambda ARN**, choose the correct region.
3. Paste the Lambda ARN into the **Default Region** box.
4. Save endpoints.

### Step 10 – test the skill
1. Open the **Test** tab in Alexa developer console.
2. Turn testing on for development.
3. Try:
   - `open word vault`
   - `ask word vault to add the word blizzard`

### If the skill does not respond
Check these in order:
1. Model built successfully.
2. Lambda deployed successfully.
3. Correct Lambda ARN pasted into Endpoint.
4. Lambda region matches the endpoint region you selected.
5. Firebase Admin credentials are valid inside Lambda.

## Notes for iPad Chrome

Chrome on iPad can still behave differently from desktop Chrome for speech. If voices do not show immediately:
1. Open the hosted page, not a local preview.
2. Tap **Wake up voice**.
3. Tap **Refresh voices**.
4. Then test the word again.
