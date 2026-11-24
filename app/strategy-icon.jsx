import { useEffect, useRef } from 'react'
import {
  BoxGeometry, CylinderGeometry, DirectionalLight, Group, HemisphereLight,
  Mesh, MeshPhysicalMaterial, PerspectiveCamera, Scene, SphereGeometry,
  TorusGeometry, WebGLRenderer,
} from 'three'

function createIcon(kind, blue, silver) {
  const icon = new Group()
  function piece(geometry, material, x, y, rotation = 0) {
    const mesh = new Mesh(geometry, material)
    mesh.position.set(x, y, 0)
    mesh.rotation.z = rotation
    icon.add(mesh)
  }

  if (kind === 'Insights') {
    piece(new TorusGeometry(.55, .12, 20, 56), silver, -.15, .18)
    piece(new CylinderGeometry(.11, .16, .72, 24), blue, .46, -.48, .73)
  } else if (kind === 'Ideas') {
    piece(new SphereGeometry(.58, 40, 28), blue, 0, .28)
    for (const y of [-.32, -.48, -.64]) {
      piece(new CylinderGeometry(.29, .27, .12, 32), silver, 0, y)
    }
  } else {
    for (const [index, height] of [.52, .95, 1.52].entries()) {
      piece(new BoxGeometry(.33, height, .4), index === 2 ? silver : blue, index * .48 - .48, height / 2 - .8)
    }
  }
  return icon
}

export function StrategyIcon({ kind, fallback: Fallback, reducedMotion }) {
  const canvas = useRef(null)

  useEffect(() => {
    const element = canvas.current
    if (!element) return
    let renderer
    try {
      renderer = new WebGLRenderer({ canvas: element, alpha: true, antialias: true })
    } catch {
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(100, 100, false)
    const scene = new Scene()
    const camera = new PerspectiveCamera(34, 1, .1, 20)
    camera.position.z = 4.2
    const blue = new MeshPhysicalMaterial({ color: '#3f75ff', roughness: .27, clearcoat: .8 })
    const silver = new MeshPhysicalMaterial({ color: '#b2cfff', roughness: .32, clearcoat: .7 })
    const icon = createIcon(kind, blue, silver)
    scene.add(icon, new HemisphereLight(0xd9e9ff, 0x284997, 2))
    const key = new DirectionalLight(0xffffff, 3)
    key.position.set(3, 4, 5)
    const rim = new DirectionalLight(0x6191ff, 3)
    rim.position.set(-3, 1, -2)
    scene.add(key, rim)

    function draw(time = 0) {
      icon.rotation.set(.16, -.35 + Math.sin(time * .0015) * .48, -.08)
      icon.position.y = Math.sin(time * .002) * .11
      renderer.render(scene, camera)
    }

    draw()
    element.dataset.ready = 'true'
    const observer = new IntersectionObserver(([entry]) => {
      renderer.setAnimationLoop(entry.isIntersecting && !reducedMotion ? draw : null)
    })
    observer.observe(element)

    return () => {
      observer.disconnect()
      renderer.setAnimationLoop(null)
      icon.traverse(object => object.geometry?.dispose())
      blue.dispose()
      silver.dispose()
      renderer.dispose()
      delete element.dataset.ready
    }
  }, [kind, reducedMotion])

  return <span className="strategy-icon" aria-hidden="true">
    <canvas ref={canvas} width="100" height="100"/>
    <Fallback size={36} strokeWidth={1.55}/>
  </span>
}
