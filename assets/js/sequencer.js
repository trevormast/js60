class Sequencer {
  constructor(oscillator, subOscillator, gain, audioCtx) {
    this._sequence = [0]
    this._speed = 1000
    this._oscillator = oscillator;
    this._subOscillator = subOscillator;
    this._baseFreq = oscillator.frequency.value;
    this._gain = gain;
    this._audioCtx = audioCtx;
    this._envelope = new Envelope(gain, this._audioCtx);
    this._process = false
    this._count = 0
    this._isRunning = false
  }

  start() {
    this._isRunning = true
    var self = this;
    this._process = setInterval(function(){
      // go back to first note at the end of the sequence
      if (self._count > self._sequence.length - 1) { self._count = 0 }

      if(self._sequence[self._count] !== 'x') {
        self.playNote();
      }
      else{ this._gain.value = 0 }

      self._count += 1
    }, this._speed);
  }

  playNote() {
    // stop envelope cycle
    this._envelope.stop();
    var interval = this.semitoneToFreq(this._sequence[this._count])
    this.oscillatorFreq = this._baseFreq + interval
    // begin envelope cycle
    this._envelope.start();
  }

  restart() {
    if (this._isRunning === true) {
      clearInterval(this._process);
      this._count = 0
      this._process = false
      this.start();
    }
  }

  add_note(note) {
    this._sequence.push(note);
  }

  change_note_at(index, note) {
    this._sequence[index] = note;
  }

  // add function to quitremove note

  semitoneToFreq(note) {
    // distance to the octave is equal to the base frequency (440 * 2 = 880, 880 - 440 = 440)
    // divide by 12 semitones to get frequency for 1 semitone
    var interval = (this._baseFreq / 12)
    return interval * note;
  }

  set speed(speed) {
    this._speed = speed;
    this.restart()
  }

  set oscillatorFreq(frequency) {
    this._oscillator.frequency.value = frequency;
    this._subOscillator.frequency.value = (this._oscillator.frequency.value / 2);
  }

  set baseFreq(frequency){
    this._baseFreq = frequency;
  }
}