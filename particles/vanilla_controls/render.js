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
  }
}
const containerNode = document.getElementById('container')
const translatesStyleNode = document.getElementById('translates')

const createRandomParticleData = () => {
  return {
    coordenates: {
      x: Math.floor(Math.random() * control.limits.container.x) + 1,
      y: Math.floor(Math.random() * control.limits.container.y) + 1,
    },
    momentum: {
      x: Math.random() * [ -1, 1 ][Math.floor(Math.random() *2)],
      y: Math.random() * [ -1, 1 ][Math.floor(Math.random() *2)],
    },
    nodeId: `p${Math.floor(Math.random() * 9999999999) + 1}`,
    nodeClasses: [ "red", "blue", "pink", "cyan", "green", "any" ][Math.floor(Math.random() *6)]
  }
}

const createParticleNode = (id, coordenates, classes) => {
  let node = document.createElement("div")
  node.classList.add("particle");
  node.classList.add(classes)
  node.id = id
  containerNode.appendChild( node )
  return node
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

const ciclo = (particles) => {
  if ( control.pauseAll ) {
    setTimeout( function(){ ciclo(particles) }, 500)
    return particles;
  }

  control.loopCount++

  particles = particles.map( particle => {
    particle = interateWithBorderByAxis(particle, 'x')
    return interateWithBorderByAxis(particle, 'y')
  })

  takeSnapshot( particles )
  particles = particles.map( particle => interateWithOtherParticles(particle, particles ) )
  .map( particle => calcParticleMove(particle) )

  if ( !control.pauseRender && (control.render || control.loopCount == 8) ) {
    let translates = particles.map(particle => moveParticleCssProps(particle))
    doTranslates( translates )
    control.render = false
    control.loopCount = 0
  }
  setTimeout( function(){ ciclo(particles) }, 1)
  return particles;
}

const initializerParticles = () => {
  let particles = []
  for ( let i=0; i<control.limits.particles; i++) {
    particles.push (createRandomParticleData())
  }
  let translates = particles.map(particle => {
    particle = calcParticleMove(particle)
    return moveParticleCssProps(particle)
  })
  doTranslates(translates);
  particles.forEach( particle => {
    particle.node = createParticleNode(particle.nodeId, particle.coordenates, particle.nodeClasses)
  })
  return particles
}
const init = () => {
  return ciclo( initializerParticles() )
}
control["particles"] = init() 