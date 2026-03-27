(function(global){
  const SETTINGS_KEY = 'word-vault-voice-settings';

  function readSettings(){
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); }
    catch { return {}; }
  }

  function saveSettings(settings){
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings || {}));
  }

  class WordVaultVoice {
    constructor(options = {}){
      this.synth = global.speechSynthesis || null;
      this.onStatus = options.onStatus || function(){};
      this.onVoicesChanged = options.onVoicesChanged || function(){};
      this.preferredLang = options.preferredLang || 'en-GB';
      this.defaultRate = options.defaultRate ?? 0.92;
      this.defaultPitch = options.defaultPitch ?? 1;
      this.defaultVolume = options.defaultVolume ?? 1;
      this.voices = [];
      this.initialized = false;
      this.boundVoiceHandler = this.loadVoices.bind(this);
    }

    isSupported(){
      return !!this.synth && typeof global.SpeechSynthesisUtterance !== 'undefined';
    }

    getStoredVoiceName(){
      return readSettings().voiceName || '';
    }

    setStoredVoiceName(name){
      const current = readSettings();
      current.voiceName = name || '';
      saveSettings(current);
    }

    getSettings(){
      return readSettings();
    }

    setSettings(partial){
      const next = { ...readSettings(), ...(partial || {}) };
      saveSettings(next);
      return next;
    }

    init(){
      if (this.initialized) return;
      this.initialized = true;
      if (!this.isSupported()) {
        this.onStatus({ ok:false, message:'Speech is not supported in this browser.' });
        return;
      }
      this.loadVoices();
      if (typeof this.synth.addEventListener === 'function') {
        this.synth.addEventListener('voiceschanged', this.boundVoiceHandler);
      } else if ('onvoiceschanged' in this.synth) {
        this.synth.onvoiceschanged = this.boundVoiceHandler;
      }
      setTimeout(() => this.loadVoices(), 250);
      setTimeout(() => this.loadVoices(), 1000);
      this.onStatus({ ok:true, message:'Voice system ready.' });
    }

    destroy(){
      if (!this.isSupported()) return;
      if (typeof this.synth.removeEventListener === 'function') {
        this.synth.removeEventListener('voiceschanged', this.boundVoiceHandler);
      }
    }

    loadVoices(){
      if (!this.isSupported()) return [];
      const list = this.synth.getVoices() || [];
      this.voices = [...list].sort((a,b) => {
        const aScore = /^en/i.test(a.lang) ? 0 : 1;
        const bScore = /^en/i.test(b.lang) ? 0 : 1;
        if (aScore !== bScore) return aScore - bScore;
        return `${a.lang} ${a.name}`.localeCompare(`${b.lang} ${b.name}`);
      });
      this.onVoicesChanged(this.voices, this.resolveVoice());
      return this.voices;
    }

    resolveVoice(preferredName){
      const voices = this.voices.length ? this.voices : this.loadVoices();
      const desired = preferredName || this.getStoredVoiceName();
      if (desired) {
        const byName = voices.find(v => v.name === desired);
        if (byName) return byName;
      }
      return voices.find(v => v.lang === this.preferredLang)
        || voices.find(v => /^en-GB/i.test(v.lang))
        || voices.find(v => /^en/i.test(v.lang))
        || voices.find(v => v.default)
        || voices[0]
        || null;
    }

    async warmUp(){
      if (!this.isSupported()) return false;
      // iPad/iPhone browsers often need speech to happen after a direct user gesture.
      // A cancel/resume pass plus a tiny silent utterance improves reliability.
      try {
        this.synth.cancel();
        this.synth.resume && this.synth.resume();
        const utter = new SpeechSynthesisUtterance(' ');
        utter.volume = 0;
        utter.rate = 1;
        utter.pitch = 1;
        const voice = this.resolveVoice();
        if (voice) utter.voice = voice;
        await new Promise((resolve) => {
          utter.onend = () => resolve(true);
          utter.onerror = () => resolve(false);
          this.synth.speak(utter);
          setTimeout(() => resolve(true), 150);
        });
        return true;
      } catch {
        return false;
      }
    }

    async speak(text, options = {}){
      if (!text) {
        this.onStatus({ ok:false, message:'There is nothing to speak.' });
        return false;
      }
      if (!this.isSupported()) {
        this.onStatus({ ok:false, message:'Speech is not supported in this browser.' });
        return false;
      }

      const settings = this.getSettings();
      const voice = this.resolveVoice(options.voiceName);
      const rate = Number(options.rate ?? settings.rate ?? this.defaultRate);
      const pitch = Number(options.pitch ?? settings.pitch ?? this.defaultPitch);
      const volume = Number(options.volume ?? settings.volume ?? this.defaultVolume);
      const lang = options.lang || settings.lang || voice?.lang || this.preferredLang;

      try {
        this.synth.cancel();
        this.synth.resume && this.synth.resume();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = lang;
        utter.rate = Number.isFinite(rate) ? rate : this.defaultRate;
        utter.pitch = Number.isFinite(pitch) ? pitch : this.defaultPitch;
        utter.volume = Number.isFinite(volume) ? volume : this.defaultVolume;
        if (voice) utter.voice = voice;

        const result = await new Promise((resolve) => {
          utter.onstart = () => this.onStatus({ ok:true, message:`Speaking with ${voice ? voice.name : 'default voice'}.` });
          utter.onend = () => resolve(true);
          utter.onerror = (event) => {
            const err = event?.error || 'unknown error';
            this.onStatus({ ok:false, message:`Speech failed: ${err}. On iPad, try using a hosted page and tap the button directly.` });
            resolve(false);
          };
          this.synth.speak(utter);
        });
        return result;
      } catch (error) {
        this.onStatus({ ok:false, message:`Speech failed: ${error.message || 'unknown error'}.` });
        return false;
      }
    }

    stop(){
      if (!this.isSupported()) return;
      this.synth.cancel();
      this.onStatus({ ok:true, message:'Speech stopped.' });
    }
  }

  global.WordVaultVoice = WordVaultVoice;
})(window);
