import { Simulator } from './simulator.js';
import { Render } from './render.js';

const newGlobalControl = () => ({
  render: false,
  pauseAll: false,
  pauseRender: false
})

const defaultSimControl = (global) => {
  return  {
    global: global,
    loopCount: 0,
    limits: {
      globalSpeed: 10,
      particles: 2000,
      container: {
        x: 500,
        y: 500
      },
      speed: {
        x: 1,
        y: 1
      }
    },
    particles: []
  }
}

const newSimControl = (index, control, globalWrapper) => {
  const where = createWrapperNode(`wrapper-${index}`, globalWrapper)
  control.containerNode = createContainerNode(`particle-container-${index}`, where)
  control.containerNode.width = control.limits.container.x
  control.containerNode.height = control.limits.container.y
  control.translatesStyleNode = createTranslateNode(`translates-${index}`, where)
  return control
}

const createWrapperNode = (id, where) => {
  let node = document.createElement("div")
  node.classList.add("session");
  node.id = id
  where.appendChild( node )
  return node
}

const createContainerNode = (id, where) => {
  let node = document.createElement("canvas")
  node.classList.add("particle-container");
  node.id = id
  where.appendChild( node )
  return node
}

const createTranslateNode = (id, where) => {
  let node = document.createElement("style")
  node.id = id
  where.appendChild( node )
  return node
}

class Main {
  constructor(control){
    this.control = control
    this.render = new Render(control)
    this.simulator = new Simulator(control)
  }

  initializerParticles () {
    for ( let i=0; i<this.control.limits.particles; i++) {
      this.control.particles.push (this.simulator.createRandomParticleData())
    }
    // let translates = this.control.particles.map(particle => {
    //   particle = this.simulator.calcParticleMove(particle)
    //   return this.render.moveParticleCssProps(particle)
    // })
    // this.render.doTranslates(translates);
    // this.control.particles.forEach( particle => {
    //   particle.node = this.render.createParticleNode(particle.nodeId, particle.nodeClasses)
    // })
  }
  
  init () {
    this.simulator.cycle()
    this.initializerParticles()
    this.render.cycle()
    return this
  }
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
}

const update = {
  '+1': state => { state.count++; return state},
  '-1': state => { state.count--; return state},
  'pause': state => {
      state.pauseAll = !state.pauseAll
      state.globalControl.pauseAll = state.pauseAll
      return state
    }
}

const state = {
  count: 0,
  pauseAll: false,
  simulations: [],
  globalControl: newGlobalControl()
}
const globalWrapper = document.getElementById("global-wrapper")
state.simulations.push( newSimControl( 0, defaultSimControl(state.globalControl), globalWrapper ) )
const main = new Main(state.simulations[0]).init()

app.start('controls', state, view, update);
