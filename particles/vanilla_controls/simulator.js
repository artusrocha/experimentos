class Simulator {

  constructor(control) {
    this.control = control
  }

  createRandomParticleData () {
    return {
      coordenates: {
        x: Math.floor(Math.random() * this.control.limits.container.x) + 1,
        y: Math.floor(Math.random() * this.control.limits.container.y) + 1,
      },
      momentum: {
        x: Math.random() * [ -1, 1 ][Math.floor(Math.random() *2)],
        y: Math.random() * [ -1, 1 ][Math.floor(Math.random() *2)],
      },
      nodeId: `p${Math.floor(Math.random() * 9999999999) + 1}`,
      nodeClasses: [ "red", "blue", "pink", "cyan", "green", "any" ][Math.floor(Math.random() *6)]
    }
  }

  takeSnapshot (particles) {
    this.control.snapshot = {}
    for ( let index=0; index<particles.length; index++) {
      for( let xRadius of [-2, -1, 0, 1, 2] )
        for( let yRadius of [-2, -1, 0, 1, 2] ) {
          let coordX = Math.round(particles[index].coordenates.x) + xRadius,
              coordY = Math.round(particles[index].coordenates.y) + yRadius
          this.control.snapshot[ coordX ] = this.control.snapshot[ coordX ] || {}
          this.control.snapshot[ coordX ][ coordY ] = this.control.snapshot[ coordX ][ coordY ] || []
          this.control.snapshot[ coordX ][ coordY ].push( index )
        }
    }
  }

  interateWithBorderByAxis (particle, axis) {
    if( particle.coordenates[axis] <= 1 ) {
      if ( particle.momentum[axis] < 0 ) {
        particle.momentum[axis] = particle.momentum[axis] * -1
        this.control.render = true
      }
      return particle
    }
    if ( (this.control.limits.container[axis] - particle.coordenates[axis]) <= 1 ) {
      if ( particle.momentum[axis] > 0 ) {
        particle.momentum[axis] = particle.momentum[axis] * -1
        this.control.render = true
      }
    }
    return particle
  }
  
  calcParticleMove (particle) {
    particle.coordenates.x = particle.coordenates.x + particle.momentum.x
    particle.coordenates.y = particle.coordenates.y + particle.momentum.y
    return particle
  }

  cycle () {
    if ( this.control.pauseAll ) {
      setTimeout( () => { this.cycle() }, 500)
      return;
    }
    this.control.particles.map( particle => {
      this.interateWithBorderByAxis(particle, 'x')
      this.interateWithBorderByAxis(particle, 'y')
    })
    this.takeSnapshot( this.control.particles )
    this.control.particles
      .map( particle => this.interateWithOtherParticles(particle, this.control.particles ) )
      .map( particle => this.calcParticleMove(particle) )
    setTimeout( () => { this.cycle() }, 1)
  }

  interateWithOtherParticles (particle, particles) {
    this.control.snapshot[ Math.round(particle.coordenates.x) ][ Math.round(particle.coordenates.y) ]
      .filter( index => particles[index].nodeId != particle.nodeId )
      .forEach( index => {
        particle = this.interateWithOtherParticleByAxis(particle, particles[index], 'x')
        particle = this.interateWithOtherParticleByAxis(particle, particles[index], 'y')
      })
    return particle
  }

  interateWithOtherParticleByAxis (particle, otherParticle, axis) {
    let curretDirection = particle.momentum[axis] < 0 ? -1 : 1
    let directionAfterInterate = particle.coordenates[axis] < otherParticle.coordenates[axis] ? -1 : 1
    if ( curretDirection == directionAfterInterate )
      return particle 
    particle.momentum[axis] = (Math.abs(particle.momentum[axis]) + Math.abs(otherParticle.momentum[axis])) / 2 * directionAfterInterate
    this.control.render = true
    return particle
  }
}
export { Simulator }