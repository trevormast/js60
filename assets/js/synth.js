class Synth {
  constructor() {
    this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this._gainNode = this._audioCtx.createGain();
    this._filterNode = this._audioCtx.createBiquadFilter();
    this._preGain = this._audioCtx.createGain();
    // oscillator 1
    this._oscillatorNode = this._audioCtx.createOscillator();
    this._oscillatorGain = this._audioCtx.createGain();
    // sub-oscillator
    this._subOscillatorNode = this._audioCtx.createOscillator();
    this._subOscillatorGain = this._audioCtx.createGain();

    this._arpeggiator = new Arpeggiator(this._oscillatorNode, this._subOscillatorNode);
    this._lfo = new LFO(this._gainNode, this._filterNode);
    this._initialized = this.initialize();
  }

  initialize() {
    this._filterNode.connect(this._gainNode);
    this._gainNode.connect(this._audioCtx.destination);
    // this._preGain.connect(this._filterNode);
    this._oscillatorGain.connect(this._preGain);
    this._subOscillatorGain.connect(this._preGain);
    this._oscillatorNode.connect(this._oscillatorGain);
    this._subOscillatorNode.connect(this._subOscillatorGain)

    this._gainNode.gain.value = 0.5;
    this._preGain.gain.value = 1;
    this._oscillatorGain.gain.value = 1
    this._subOscillatorGain.gain.value = 1

    this._filterNode.type = 'lowpass';
    this._filterNode.frequency.value = 22000;
    this._filterNode.Q.value = 3

    this._oscillatorNode.frequency.value = 880;
    this._oscillatorNode.type = 'square';

    this._subOscillatorNode.frequency.value = (this._oscillatorNode.frequency.value / 2);

    this._oscillatorNode.start();
    this._subOscillatorNode.start();

    return true;
  }

  initializeSliders($frequencyInput, $gainInput, $shapeInput, $filterFreqInput, $resonanceInput){
    $frequencyInput.val(this._oscillatorNode.frequency.value);
    $gainInput.val(this._gainNode.gain.value);
    $shapeInput.val(this._oscillatorNode.type);
    $filterFreqInput.val(this._filterNode.frequency.value);
    $resonanceInput.val(this._filterNode.Q.value);
  }

  start() {
    this._preGain.connect(this._filterNode);
  }

  stop() {
    this._preGain.disconnect(this._filterNode);
  }

  startArpeggiator(){
    console.log('arp called');
    this._arpeggiator.start(this._oscillatorNode);
  }

  stopArpeggiator(){
    this._arpeggiator.stop(this._oscillatorNode);
  }

  // TODO: move logic to Arpeggiator
  restartArpeggiator(){
    this._arpeggiator.stop(this._oscillatorNode);
    this._arpeggiator.start(this._oscillatorNode);
  }

  // GETTERS
  get gain() {
    return this._gainNode.gain.value;
  }

  get filterFreq() {
    return this._filterNode.frequency.value;
  }

  get oscillatorFreq() {
    return this._oscillatorNode.frequency.value;
  }

  get initialized(){
    return this._initialized;
  }

  get arpeggiator(){
    return this._arpeggiator;
  }

  get lfo() {
    return this._lfo;
  }

  // SETTERS
  set gain(gain) {
    this._gainNode.gain.value = gain;
    this._lfo.baseGain = gain;
  }

  set oscillatorFreq(frequency) {
    this._oscillatorNode.frequency.value = frequency;
    // set sub oscillator frequency
    this._subOscillatorNode.frequency.value = (this._oscillatorNode.frequency.value / 2);
    // set arpeggiator baseFreq
    this._arpeggiator.baseFreq = frequency;
  }

  set oscillatorType(type) {
    this._oscillatorNode.type = type;
  }

  set filterFreq(frequency) {
    this._filterNode.frequency.value = frequency;
    this._lfo.baseFilterFreq = frequency;
  }

  set resonance(resonance) {
    this._filterNode.Q.value = resonance;
  }

}