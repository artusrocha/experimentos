const control = {
  render: false,
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

const takeSnapshot = (particles) => {
  const snapshot = {}
  particles.forEach( particle =>{
    for( let xRadius of [-2, -1, 0, 1, 2] )
      for( let yRadius of [-2, -1, 0, 1, 2] ) {
        const coord = {
          x: Math.round(particle.coordenates.x) + xRadius,
          y: Math.round(particle.coordenates.y) + yRadius
        }
        snapshot[ coord.x ] = snapshot[ coord.x ] || {}
        snapshot[ coord.x ][ coord.y ] = snapshot[ coord.x ][ coord.y ] || []
        snapshot[ coord.x ][ coord.y ].push( particle )
      }
  })
  return snapshot
}

const createParticleNode = (id, coordenates, classes) => {
  let node = document.createElement("div")
  node.classList.add("particle");
  node.classList.add(classes)
  node.id = id
  containerNode.appendChild( node )
  return node
}

const interateWithBorderByAxis = (particle, axis) => {
  if( particle.coordenates[axis] <= 1 ) {
    if ( particle.momentum[axis] < 0 ) {
      particle.momentum[axis] = particle.momentum[axis] * -1
      control.render = true
    }
    return particle
  }
  if ( (control.limits.container[axis] - particle.coordenates[axis]) <= 1 ) {
    if ( particle.momentum[axis] > 0 ) {
      particle.momentum[axis] = particle.momentum[axis] * -1
      control.render = true
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

const ciclo = (particles) => {
  control.loopCount++
  //let allParticlesSnapshot = takeSnapshot(particles)

  particles = particles.map( particle => {
    particle = interateWithBorderByAxis(particle, 'x')
    return interateWithBorderByAxis(particle, 'y')
  })

  let allParticlesSnapshot = takeSnapshot( particles.map( particle => calcParticleMove(particle) ) )

  particles = particles.map( particle => interateWithOtherParticles(particle, allParticlesSnapshot) )
  .map( particle => calcParticleMove(particle) )

  if ( control.render || control.loopCount == 4 ) {
    let translates = particles.map(particle => moveParticleCssProps(particle))
    doTranslates( translates )
    control.render = false
    control.loopCount = 0
  }
  setTimeout( function(){ ciclo(particles) }, 8)
  return particles;
}

const interateWithOtherParticles = (particle, particlesSnapshot) => {
  particlesSnapshot[ Math.round(particle.coordenates.x) ][ Math.round(particle.coordenates.y) ]
    .filter( eachParticle => eachParticle.nodeId != particle.nodeId )
    .forEach( otherParticle => {
      particle = interateWithOtherParticleByAxis(particle, otherParticle, 'x')
      particle = interateWithOtherParticleByAxis(particle, otherParticle, 'y')

/*      let xParticleMomentumModule = Math.abs(particle.momentum.x)
      let xOtherMomentumModule = Math.abs(eachParticle.momentum.x)
      let xv = particle.coordenates.x > eachParticle.coordenates.x ? -1 : 1
      particle.momentum.x = (xParticleMomentumModule + xOtherMomentumModule) / 2 * xv

      let yParticleMomentumModule = Math.abs(particle.momentum.y)
      let yOtherMomentumModule = Math.abs(eachParticle.momentum.y)
      let yv = particle.coordenates.y > eachParticle.coordenates.y ? -1 : 1
      particle.momentum.y = (yParticleMomentumModule + yOtherMomentumModule) / 2 * yv */
    })
  return particle
}
const interateWithOtherParticleByAxis = (particle, otherParticle, axis) => {
//  console.log(axis, Math.abs(particle.momentum[axis]), Math.abs(otherParticle.momentum[axis]), particle, otherParticle )
  let curretDirection = particle.momentum[axis] < 0 ? -1 : 1
  let inversionDirection = particle.coordenates[axis] < otherParticle.coordenates[axis] ? -1 : 1
  //console.log ( curretDirection, inversionDirection, particle.momentum[axis] )
  if ( curretDirection == inversionDirection )
    return particle 
  particle.momentum[axis] = (Math.abs(particle.momentum[axis]) + Math.abs(otherParticle.momentum[axis])) / 2 * inversionDirection
  return particle
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
init() 