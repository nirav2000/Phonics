// Starter Alexa skill webhook for Word Vault
// Host this in AWS Lambda, Vercel, Netlify functions, or your own Node server.
// This is a starter, not a full production skill.

const WORDS_API_BASE = process.env.WORDS_API_BASE || 'https://your-word-vault-api.example.com';

async function postJson(path, body) {
  const res = await fetch(`${WORDS_API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function speak(text, reprompt = '') {
  return {
    version: '1.0',
    response: {
      outputSpeech: { type: 'PlainText', text },
      reprompt: reprompt ? { outputSpeech: { type: 'PlainText', text: reprompt } } : undefined,
      shouldEndSession: !!reprompt ? false : true
    }
  };
}

export async function handler(event) {
  try {
    const requestType = event?.request?.type;
    const intentName = event?.request?.intent?.name;
    const slots = event?.request?.intent?.slots || {};

    if (requestType === 'LaunchRequest') {
      return speak('Welcome to Word Vault. You can say, add the word blizzard from Yeti in the Playground.');
    }

    if (requestType === 'IntentRequest' && intentName === 'AddWordIntent') {
      const word = slots.word?.value;
      const source = slots.source?.value || '';
      if (!word) return speak('I did not catch the word. Please try again.', 'Say the word you want to save.');

      await postJson('/words', { word, source, status: 'new' });
      return speak(`Saved ${word}${source ? ` from ${source}` : ''}.`);
    }

    if (requestType === 'IntentRequest' && intentName === 'GetWordIntent') {
      const word = slots.word?.value;
      if (!word) return speak('Please tell me the word you want to hear about.');
      const data = await postJson('/lookup', { word });
      return speak(`${data.word}. ${data.definition} Example sentence: ${data.sentence}`);
    }

    if (requestType === 'IntentRequest' && intentName === 'AMAZON.HelpIntent') {
      return speak('Try saying, add the word assembly from my school book. Or say, what does blizzard mean?');
    }

    return speak('Sorry, I could not handle that request.');
  } catch (err) {
    console.error(err);
    return speak('Sorry, something went wrong in Word Vault.');
  }
}
