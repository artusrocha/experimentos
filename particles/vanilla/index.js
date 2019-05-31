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

const particles = []

const createRandomParticleData = () => {
 return {
  coordenates: {
   x: Math.floor(Math.random() * limits.container.x) + 1,
   y: Math.floor(Math.random() * limits.container.y) + 1,
  },
  momentum: {
   x: 1,
   y: 1
  }
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

const ciclo = () => {
 const allParticlesSnapshot = takeSnapshot()
 console.log("Snapshot: ", allParticlesSnapshot)
 particles = particles.map( particle =>{
  if ( particle.momentum.x < 0 ) {
    if( particle.coordenates.x == 1 ) {
      particle.momentum.x = particle.momentum.x * -1
    }
  } else if ( particle.momentum.x > 0 && particle.coordenates.x == limits.container.x ) {
    particle.momentum.x = particle.momentum.x * -1
  }
  /// ========================
  if ( particle.momentum.y < 0 ) {
    if( particle.coordenates.y == 1 ) {
      particle.momentum.y = particle.momentum.y * -1
    }
  } else if ( particle.momentum.y > 0 && particle.coordenates.y == limits.container.y ) {
    particle.momentum.y = particle.momentum.y * -1
  }
  
  return particle
 })
}