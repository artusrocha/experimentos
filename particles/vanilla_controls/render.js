class Render {
  
  constructor(control) {
    this.control = control
  }

  createParticleNode (id, classes) {
    let node = document.createElement("div")
    node.classList.add("particle");
    node.classList.add(classes)
    node.id = id
    this.control.containerNode.appendChild( node )
    return node
  }

  doTranslates (translates) {
    this.control.translatesStyleNode.textContent = translates.join('')
  }

  moveParticleCssProps (particle) {
    return `#${particle.nodeId}{ transform: translate(${particle.coordenates.x}px,${particle.coordenates.y}px);}`
  }

  moveParticle (particle) {
    particle.node.style.transform = `translate(${particle.coordenates.x}px,${particle.coordenates.y}px`
    particle.node.style.transform = transform
  }

  cycle () {
    if ( this.control.global.pauseAll || this.control.global.pauseRender ) {
      setTimeout( () => { this.cycle() }, 500)
      return;
    }
//    this.control.loopCount++
//    if ( this.control.render || this.control.loopCount == 8 ) {
      let translates = this.control.particles.map(particle => this.moveParticleCssProps(particle))
      this.doTranslates( translates )
//      this.control.render = false
//      this.control.loopCount = 0
//    }
    setTimeout( () => { this.cycle() }, 10)
  }
}
export { Render }
