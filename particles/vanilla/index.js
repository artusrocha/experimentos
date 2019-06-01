const control = {
  render: false,
  loopCount: 0
}
const containerNode = document.getElementById('container')
const translatesStyleNode = document.getElementById('translates')
const limits = {
  container: {
    x: 600,
    y: 600
  },
  speed: {
    x: 1,
    y: 1
  }
}

const createRandomParticleData = () => {
  return {
    coordenates: {
      x: Math.floor(Math.random() * limits.container.x) + 1,
      y: Math.floor(Math.random() * limits.container.y) + 1,
    },
    momentum: {
      x: [ -1, 1 ][Math.floor(Math.random() *2)],
      y: [ -1, 1 ][Math.floor(Math.random() *2)],
    },
    nodeId: `p${Math.floor(Math.random() * 9999999999) + 1}`,
  }
}

const takeSnapshot = () => {
  const snapshot = {}
  particles.forEach( particle =>{
    const coord = particle.coordenates
    snapshot[ coord.x ] = snapshot[ coord.x ] || {}
    snapshot[ coord.x ][ coord.y ] = snapshot[ coord.x ][ coord.y ] || []
    snapshot[ coord.x ][ coord.y ].push( particle )
  })
  return snapshot
}

const createParticleNode = (id, coordenates) => {
  let node = document.createElement("div")
//  let transform = `translate(${coordenates.x}px,${coordenates.y}px)`
//  node.style.transform = transform
  node.classList.add("particle");
  node.id = id
  containerNode.appendChild( node )
  return node
}

const interateWithBorderByAxis = (particle, axis) => {
  //console.log(particle)
  if( particle.coordenates[axis] == 1 ) {
    if ( particle.momentum[axis] < 0 ) {
      particle.momentum[axis] = particle.momentum[axis] * -1
      control.render = true
    }
//    console.log('axis: ', axis, control)
    return particle
  }
  if ( particle.coordenates[axis] == limits.container[axis] ) {
    if ( particle.momentum[axis] > 0 ) {
      particle.momentum[axis] = particle.momentum[axis] * -1
      control.render = true
//      console.log('axis: ', axis, control)
    }
  }
  return particle
}

const doTranslates = (translates) => {
  translatesStyleNode.textContent = translates.join('')
}

const moveParticleCssProps = (particle) => {
  return `#${particle.nodeId}{ transform: translate(${particle.coordenates.x}px,${particle.coordenates.y}px);}`
}
const moveParticle = (particle) => {
  particle.node.style.transform = `translate(${particle.coordenates.x}px,${particle.coordenates.y}px`
  particle.node.style.transform = transform
}

const calcParticleMove = (particle) => {
  particle.coordenates.x = particle.coordenates.x + particle.momentum.x
  particle.coordenates.y = particle.coordenates.y + particle.momentum.y
  return particle
}

const ciclo = () => {
  control.loopCount++
  let allParticlesSnapshot = takeSnapshot()

  particles = particles.map( particle => {
    particle = interateWithBorderByAxis(particle, 'x')
    return interateWithBorderByAxis(particle, 'y')
  }).map( particle => calcParticleMove(particle) )
//  console.log(control)
  if ( control.render || control.loopCount == 5 ) {
    let translates = particles.map(particle => moveParticleCssProps(particle))
    //setTimeout( function () {
      doTranslates( translates )
    //}, control.loopCount )
    control.render = false
    control.loopCount = 0
  }
  setTimeout( function(){ ciclo() }, 1)
}

let particles = [
  createRandomParticleData(),
  createRandomParticleData(),
  createRandomParticleData(),
  createRandomParticleData(),
  createRandomParticleData(),
  createRandomParticleData(),
  createRandomParticleData(),
  createRandomParticleData(),
  createRandomParticleData(),
  createRandomParticleData(),
  createRandomParticleData(),
  createRandomParticleData(),
  createRandomParticleData(),
  createRandomParticleData(),
  createRandomParticleData(),
  createRandomParticleData(),
  createRandomParticleData(),
  createRandomParticleData(),
  createRandomParticleData(),
  createRandomParticleData()
]

const init = () => {
  let translates = particles.map(particle => {
    particle = calcParticleMove(particle)
    return moveParticleCssProps(particle)
  })
  doTranslates(translates);
  particles.forEach( particle => {
    particle.node = createParticleNode(particle.nodeId, particle.coordenates)
  })
  //console.log(particles)
}
init()
ciclo()
