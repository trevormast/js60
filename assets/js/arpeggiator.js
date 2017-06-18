class Arpeggiator {
  constructor(oscillator, subOscillator) {
    this._oscillator = oscillator;
    this._subOscillator = subOscillator;
    this._baseFreq = oscillator.frequency.value;
    this._count = 1
    this._speed = 1000
    this._octaves = 2
    this._direction = 'up'
    this._process = false;
  }

  // initializeSliders(){

  // }

  start() {
    // if not already running
    if (!this.isRunning()){
      this._baseFreq = this._oscillator.frequency.value;
      if (this._direction === 'up'){
        this._process = this.upSequence();
      } else if (this._direction === 'down'){
        this._process = this.downSequence();
      } else if (this._direction === 'up/down'){
        this._process = this.upDownSequence();
      }
    }
  }

  stop(){
    if (this.isRunning()) {
      this.oscillatorFreq = this._baseFreq;
      clearInterval(this._process);
      this._count = 1;
      this._process = false;
    }
  }

  restart(){
    if (this.isRunning()) {
      this.stop();
      this.start();
    }
  }

  upSequence(){
    var self = this;
    var interval = setInterval(function(){
        if ( self._count >= self._octaves) {
          self.oscillatorFreq = self._baseFreq;
          self._count = 1
        } else {
          self.oscillatorFreq = self._baseFreq * (self._count + 1)
          self._count += 1;
        };
      }, this._speed);
    return interval;
  }

  downSequence(){
    var self = this;
    var interval = setInterval(function(){
      if (self._count >= self._octaves){
        self.oscillatorFreq = self._baseFreq;
        self._count = 1;
      } else {
        self.oscillatorFreq = self._baseFreq / (self._count + 1);
        self._count += 1;
      }
    }, this._speed);
    return interval;
  }

  upDownSequence(){
    var self = this;
    var multiplier = -1
    var interval = setInterval(function(){
      // if count is greater than or equal to the amount of octaves
      // OR less than or equal to 1
      if ((Math.abs(self._count) >= self._octaves) || (Math.abs(self._count) <= 1)) {
        multiplier *= -1;
      }
      self.oscillatorFreq = self._baseFreq * (self._count);

      self._count += multiplier;

    }, this._speed)
    return interval;
  }

  isRunning() {
    // process is not false
    return (this._process !== false)
  }

  get baseFreq() {
    return this._baseFreq;
  }

  set speed(speed) {
    this._speed = -speed;
    this.restart();
  }

  set octaves(octaves) {
    this._octaves = octaves;
    this.restart();
  }

  set direction(direction) {
    this._direction = direction;
    this.restart();
  }

  set baseFreq(frequency){
    this._baseFreq = frequency;
    this.restart();
  }

  set oscillatorFreq(frequency) {
    this._oscillator.frequency.value = frequency;
    this._subOscillator.frequency.value = (this._oscillator.frequency.value / 2);
  }

}
