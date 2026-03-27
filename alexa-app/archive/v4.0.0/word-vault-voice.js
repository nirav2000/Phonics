(function(global){
  class WordVaultVoice {
    constructor(options = {}) {
      this.lang = options.lang || 'en-GB';
      this.voice = null;
      this.voices = [];
    }

    _speech() {
      if (!('speechSynthesis' in window)) throw new Error('Speech synthesis is not supported in this browser.');
      return window.speechSynthesis;
    }

    async wakeUp() {
      const synth = this._speech();
      synth.cancel();
      return this.getVoices(true);
    }

    async getVoices(force = false) {
      const synth = this._speech();
      if (!force && this.voices.length) return this.voices;
      let voices = synth.getVoices();
      if (!voices.length) {
        voices = await new Promise((resolve) => {
          let settled = false;
          const finish = () => {
            if (settled) return;
            settled = true;
            resolve(synth.getVoices());
          };
          const timer = setTimeout(() => {
            synth.removeEventListener('voiceschanged', onVoices);
            finish();
          }, 1200);
          const onVoices = () => {
            clearTimeout(timer);
            synth.removeEventListener('voiceschanged', onVoices);
            finish();
          };
          synth.addEventListener('voiceschanged', onVoices);
        });
      }
      this.voices = voices;
      if (!this.voice) {
        this.voice = voices.find(v => v.lang === this.lang) || voices.find(v => v.lang && v.lang.startsWith(this.lang.split('-')[0])) || voices[0] || null;
      }
      return this.voices;
    }

    setVoiceByIndex(index) {
      const i = Number(index);
      if (!Number.isNaN(i) && this.voices[i]) this.voice = this.voices[i];
      return this.voice;
    }

    async speak(text, options = {}) {
      const value = String(text || '').trim();
      if (!value) throw new Error('Nothing to speak.');
      const synth = this._speech();
      await this.getVoices();
      synth.cancel();
      synth.resume();
      return new Promise((resolve, reject) => {
        const utter = new SpeechSynthesisUtterance(value);
        if (this.voice) utter.voice = this.voice;
        utter.lang = this.voice?.lang || this.lang;
        utter.rate = Number(options.rate ?? 0.9);
        utter.pitch = Number(options.pitch ?? 1);
        utter.onend = () => resolve(true);
        utter.onerror = (e) => reject(e.error || 'Speech failed');
        synth.speak(utter);
      });
    }
  }
  global.WordVaultVoice = WordVaultVoice;
})(window);
