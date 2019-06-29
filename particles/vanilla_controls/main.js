import { Simulator } from './simulator.js';
import { Render } from './render.js';

const control = {
  render: false,
  pauseAll: false,
  pauseRender: false,
  loopCount: 0,
  limits: {
    particles: 50,
    container: {
      x: 500,
      y: 500
    },
    speed: {
      x: 1,
      y: 1
    }
  },
  particles: [],
  containerNode: document.getElementById('particle-container'),
  translatesStyleNode: document.getElementById('translates')
}

class Main {
  constructor(){
    this.control = control
    this.render = new Render(control)
    this.simulator = new Simulator(control)
  }

  initializerParticles () {
    for ( let i=0; i<this.control.limits.particles; i++) {
      this.control.particles.push (this.simulator.createRandomParticleData())
    }
    let translates = this.control.particles.map(particle => {
      particle = this.simulator.calcParticleMove(particle)
      return this.render.moveParticleCssProps(particle)
    })
    this.render.doTranslates(translates);
    this.control.particles.forEach( particle => {
      particle.node = this.render.createParticleNode(particle.nodeId, particle.nodeClasses)
    })
  }
  
  init () {
    this.simulator.cycle()
    this.initializerParticles()
    this.render.cycle()
    return this
  }
}

const main = new Main(control).init()

const state = {
  count: 0,
  pauseAll: false 
}
const view = state => {
  return `<div>
    <!--
    <h1>${state.count}</h1>
    <button onclick='app.run("-1")'>-1</button>
    <button onclick='app.run("+1")'>+1</button>
    -->
    <button onclick='app.run("pause")'>${state.pauseAll ? "Paused" : "Pause"}</button>
  </div>`;
};
const update = {
  '+1': state => { state.count++; return state},
  '-1': state => { state.count--; return state},
  'pause': state => {
      state.pauseAll = !state.pauseAll
      control.pauseAll = state.pauseAll
      return state
    }
};
app.start('controls', state, view, update);
