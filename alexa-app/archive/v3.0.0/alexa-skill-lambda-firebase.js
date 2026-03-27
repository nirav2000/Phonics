const Alexa = require('ask-sdk-core');
const admin = require('firebase-admin');
const crypto = require('crypto');

let app;
function getAdmin(){
  if (app) return admin.firestore();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  app = admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey })
  });
  return admin.firestore();
}

function now(){ return new Date().toISOString(); }
function normalize(value){ return String(value || '').trim(); }
function makeId(){ return crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex'); }

const LaunchRequestHandler = {
  canHandle(handlerInput){
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput){
    return handlerInput.responseBuilder
      .speak('Word Vault is ready. You can say, add the word blizzard from Yeti in the Playground.')
      .reprompt('Try saying, add the word blizzard from Yeti in the Playground.')
      .getResponse();
  }
};

const AddWordIntentHandler = {
  canHandle(handlerInput){
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AddWordIntent';
  },
  async handle(handlerInput){
    const slots = handlerInput.requestEnvelope.request.intent.slots || {};
    const word = normalize(slots.word?.value);
    const source = normalize(slots.source?.value);
    const familyId = normalize(slots.familyId?.value) || process.env.WORD_VAULT_DEFAULT_FAMILY_ID;

    if (!word) {
      return handlerInput.responseBuilder
        .speak('I did not catch the word. Please say, add the word blizzard.')
        .reprompt('Say, add the word blizzard.')
        .getResponse();
    }

    if (!familyId) {
      return handlerInput.responseBuilder
        .speak('The family ID is not configured yet. Add WORD_VAULT_DEFAULT_FAMILY_ID to the Lambda environment or say the family ID in the request.')
        .getResponse();
    }

    const firestore = getAdmin();
    const id = makeId();
    const payload = {
      id,
      family_id: familyId,
      word,
      source,
      status: 'new',
      child_age: '9',
      category: '',
      phonics: '',
      definition: '',
      sentence: '',
      similar: '',
      not_this: '',
      notes: 'Added by Alexa.',
      created_at: now(),
      updated_at: now(),
      created_by: 'alexa'
    };

    await firestore.collection('words').doc(id).set(payload, { merge:true });

    const sourceSpeech = source ? ` from ${source}` : '';
    return handlerInput.responseBuilder
      .speak(`Saved the word ${word}${sourceSpeech}.`)
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput){
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput){
    return handlerInput.responseBuilder
      .speak('You can say, add the word blizzard from Yeti in the Playground.')
      .reprompt('Try saying, add the word blizzard from Yeti in the Playground.')
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput){
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && ['AMAZON.CancelIntent', 'AMAZON.StopIntent'].includes(Alexa.getIntentName(handlerInput.requestEnvelope));
  },
  handle(handlerInput){
    return handlerInput.responseBuilder.speak('Goodbye.').getResponse();
  }
};

const ErrorHandler = {
  canHandle(){ return true; },
  handle(handlerInput, error){
    console.error(error);
    return handlerInput.responseBuilder
      .speak('Sorry, I had trouble saving that word.')
      .reprompt('Please try again.')
      .getResponse();
  }
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    AddWordIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
