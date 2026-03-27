class WordVaultVoice {
  constructor(options = {}) {
    this.lang = options.lang || 'en-GB';
    this.voice = null;
    this.rate = options.rate || 0.9;
    this.pitch = options.pitch || 1;
    this.voices = [];
    this._readyPromise = null;
  }

  async getVoices() {
    if (!('speechSynthesis' in window)) return [];
    if (this.voices.length) return this.voices;
    if (this._readyPromise) return this._readyPromise;

    this._readyPromise = new Promise((resolve) => {
      const load = () => {
        this.voices = window.speechSynthesis.getVoices() || [];
        if (this.voices.length) {
          const preferred = this.voices.find(v => v.lang === this.lang)
            || this.voices.find(v => (v.lang || '').startsWith('en-GB'))
            || this.voices.find(v => (v.lang || '').startsWith('en'))
            || null;
          if (!this.voice && preferred) this.voice = preferred;
          resolve(this.voices);
        }
      };
      load();
      window.speechSynthesis.addEventListener?.('voiceschanged', load, { once: true });
      setTimeout(() => resolve(this.voices || []), 1200);
    });

    return this._readyPromise;
  }

  async wakeUp() {
    if (!('speechSynthesis' in window)) return false;
    await this.getVoices();
    const utter = new SpeechSynthesisUtterance(' ');
    utter.volume = 0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  }

  setVoiceByIndex(index) {
    if (!this.voices.length) return null;
    this.voice = this.voices[Number(index)] || null;
    return this.voice;
  }

  setVoiceByName(name) {
    this.voice = this.voices.find(v => v.name === name) || null;
    return this.voice;
  }

  async speak(text, options = {}) {
    if (!('speechSynthesis' in window)) throw new Error('Speech synthesis is not available in this browser');
    if (!text || !String(text).trim()) return;
    await this.getVoices();

    const utter = new SpeechSynthesisUtterance(String(text));
    utter.lang = options.lang || this.voice?.lang || this.lang;
    utter.voice = options.voice || this.voice || null;
    utter.rate = Number(options.rate ?? this.rate);
    utter.pitch = Number(options.pitch ?? this.pitch);

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume?.();

    return new Promise((resolve, reject) => {
      utter.onend = () => resolve(true);
      utter.onerror = (e) => reject(e.error || e);
      window.speechSynthesis.speak(utter);
    });
  }
}

window.WordVaultVoice = WordVaultVoice;
