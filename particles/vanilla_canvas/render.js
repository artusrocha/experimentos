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

  // moveParticle (particle) {
  //   particle.node.style.transform = `translate(${particle.coordenates.x}px,${particle.coordenates.y}px`
  //   particle.node.style.transform = transform
  // }

  updateRender (canvas, particles) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(particle => {
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.coordenates.x,
              particle.coordenates.y,
              2, 0, 2*Math.PI)
      ctx.fill()
    });
  }

  cycle () {
    if ( this.control.global.pauseAll || this.control.global.pauseRender ) {
      setTimeout( () => { this.cycle() }, 500)
      return;
    }
//    let translates = this.control.particles.map(particle => this.moveParticleCssProps(particle))
//    this.doTranslates( translates )
    this.updateRender(this.control.containerNode, this.control.particles)
    setTimeout( () => { this.cycle() }, 10)
  }
}
export { Render }
