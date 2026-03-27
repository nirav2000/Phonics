export class WordVaultVoice {
  constructor({ lang = 'en-GB' } = {}) { this.lang = lang; this.currentVoice = null; this.voices = []; }
  async wake() { if (!window.speechSynthesis) throw new Error('Speech synthesis is not supported in this browser.'); const u = new SpeechSynthesisUtterance(' '); u.volume = 0; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); await this.getVoices(); }
  async getVoices() {
    if (!window.speechSynthesis) return [];
    const now = () => window.speechSynthesis.getVoices() || [];
    let voices = now(); if (voices.length) { this.voices = voices; return voices; }
    voices = await new Promise(resolve => {
      let done = false; const finish = () => { if (done) return; done = true; const list = now(); this.voices = list; resolve(list); };
      window.speechSynthesis.addEventListener('voiceschanged', finish, { once: true });
      setTimeout(finish, 1200);
    });
    return voices;
  }
  setVoiceByIndex(index) { if (!this.voices.length) return null; this.currentVoice = this.voices[Number(index)] || null; return this.currentVoice; }
  setVoiceByURI(voiceURI) { if (!this.voices.length) return null; this.currentVoice = this.voices.find(v => v.voiceURI === voiceURI) || null; return this.currentVoice; }
  speak(text, { rate = 0.95, pitch = 1, lang } = {}) {
    if (!window.speechSynthesis) throw new Error('Speech synthesis is not supported in this browser.');
    const utter = new SpeechSynthesisUtterance(text); utter.rate = Number(rate) || 0.95; utter.pitch = Number(pitch) || 1; utter.lang = lang || this.currentVoice?.lang || this.lang; if (this.currentVoice) utter.voice = this.currentVoice;
    window.speechSynthesis.cancel(); window.speechSynthesis.resume(); window.speechSynthesis.speak(utter); return utter;
  }
}
