import Zdog from 'zdog'
import Zfont from 'zfont'

Zfont.init(Zdog)

// create illo
let illo = new Zdog.Illustration({
  // set canvas with selector
  element: '.zdog-canvas',
  translate: {
    x: 1,
    y: 6
  }
});

let myFont = new Zdog.Font({
  src: './Soxe2banh.TTF'
})

new Zdog.Text({
  addTo: illo,
  font: myFont,
  value: '5',
  fontSize: 28,
  color: '#fff',
  fill: true,
  textAlign: 'center',
  textBaseline: 'middle',
})
// update & render
function animate() {
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}
animate();