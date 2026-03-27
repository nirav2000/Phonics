# Word Vault v3 – Full Setup Guide

This guide gives COMPLETE, step-by-step instructions for:
- Firebase setup
- Web app setup
- Voice module usage
- Alexa integration

---

# 1. FIREBASE SETUP

## Create project
Go to: https://console.firebase.google.com

- Click "Create project"
- Name: word-vault
- Disable analytics (optional)

---

## Create Web App
- Click "</>" icon
- Name: word-vault-web

You will get config:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
};
```

### WHERE TO PUT THIS
In index.html:

Replace:
```js
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
};
```

---

## Enable Firestore
- Go to Firestore Database
- Create database
- Start in TEST MODE

---

## Firestore Structure

Collection:
words

Fields:
- family_id
- word
- definition
- sentence
- phonics
- notes
- created_at

---

## Rules (temporary)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /words/{docId} {
      allow read, write: if true;
    }
  }
}
```

---

## Deploy (IMPORTANT FOR SPEECH)

Install CLI:
```
npm install -g firebase-tools
firebase login
```

Init:
```
firebase init hosting
```

Deploy:
```
firebase deploy
```

---

# 2. VOICE MODULE

## Include file
```html
<script src="word-vault-voice.js"></script>
```

## Initialise
```js
const voice = new WordVaultVoice({ lang: "en-GB" });
```

## Load voices
```js
voice.getVoices().then(voices => {
  console.log(voices);
});
```

## Speak
```js
voice.speak("blizzard");
```

## With options
```js
voice.speak("indefinitely", { rate: 0.85, pitch: 1 });
```

## Change voice
```js
voice.setVoiceByIndex(0);
```

---

# 3. ALEXA SETUP

Go to:
https://developer.amazon.com/alexa/console/ask

## Create Skill
- Name: Word Vault
- Type: Custom
- Backend: AWS Lambda

---

## Lambda setup

Go to AWS Lambda:
- Create function (Node 18)

Paste alexa-skill-lambda-firebase.js

---

## Firebase Admin Key

Firebase:
- Project settings → Service Accounts
- Generate key

Paste into:

```js
const serviceAccount = {
  projectId: "",
  clientEmail: "",
  privateKey: ""
};
```

---

## Connect Alexa to Lambda
- Copy Lambda ARN
- Paste into Alexa endpoint

---

## Test
Say:
Alexa, add word blizzard

---

# 4. ARCHITECTURE

Web App → Firestore ← Alexa

All use same:
family_id

---

# 5. COMMON ISSUES

Speech not working:
- Must be hosted (NOT local file)
- Must click button first

Voices not loading:
- Async issue → reload or click again

Firestore empty:
- Check family_id

Alexa not saving:
- Check Firebase admin key

---

# 6. NEXT STEPS

- Add review mode
- Add phonics trainer
- Add confusion pairs
- Add analytics

