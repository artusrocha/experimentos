const control = {
  render: false,
  loopCount: 0,
  limits: {
    particles: 10,
    container: {
      x: 300,
      y: 300
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
  }
}

const takeSnapshot = (particles) => {
  const snapshot = {}
  particles.forEach( particle =>{
    const coord = {
      x: Math.round(particle.coordenates.x),
      y: Math.round(particle.coordenates.y)
    }
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
  if( particle.coordenates[axis] <= 1 ) {
    if ( particle.momentum[axis] < 0 ) {
      particle.momentum[axis] = particle.momentum[axis] * -1
      control.render = true
    }
//    console.log('axis: ', axis, control)
    return particle
  }
  if ( (control.limits.container[axis] - particle.coordenates[axis]) <= 1 ) {
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

  if ( control.render || control.loopCount == 5 ) {
    let translates = particles.map(particle => moveParticleCssProps(particle))
    doTranslates( translates )
    control.render = false
    control.loopCount = 0
  }
  setTimeout( function(){ ciclo(particles) }, 1)
}

const interateWithOtherParticles = (particle, particlesSnapshot) => {
  particlesSnapshot[ Math.round(particle.coordenates.x) ][ Math.round(particle.coordenates.y) ]
    .filter( eachParticle => eachParticle.nodeId != particle.nodeId )
    .forEach( eachParticle => {
      console.log('antes',particle.momentum.x, particle.momentum.y, particle)
      let xParticleMomentumModule = Math.abs(particle.momentum.x)
      let xOtherMomentumModule = Math.abs(eachParticle.momentum.x)
      let xv = particle.coordenates.x > eachParticle.coordenates.x ? -1 : 1
      particle.momentum.x = (xParticleMomentumModule + xOtherMomentumModule) / 2 * xv
console.log( particle.momentum.x, xParticleMomentumModule, xOtherMomentumModule, xv)      
      let yParticleMomentumModule = Math.abs(particle.momentum.y)
      let yOtherMomentumModule = Math.abs(eachParticle.momentum.y)
      let yv = particle.coordenates.y > eachParticle.coordenates.y ? -1 : 1
      particle.momentum.y = (yParticleMomentumModule + yOtherMomentumModule) / 2 * yv
      console.log('depois',particle.momentum.x, particle.momentum.y, particle)
      
    })
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
    particle.node = createParticleNode(particle.nodeId, particle.coordenates)
  })
  return particles
}
const init = () => {
  ciclo( initializerParticles() )
}
init()