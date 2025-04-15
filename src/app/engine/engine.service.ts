import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

@Injectable({ providedIn: 'root' })
export class EngineService implements OnDestroy {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.DirectionalLight;
  private amb_light: THREE.DirectionalLight;

  private avocadoModel: THREE.Group<THREE.Object3DEventMap>;

  private cube: THREE.Mesh;

  private frameId: number = null;

  public constructor(private ngZone: NgZone) {}

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
    if (this.renderer != null) {
      this.renderer.dispose();
      this.renderer = null;
      this.canvas = null;
    }
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true, // transparent background
      antialias: true, // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the scene
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 2;
    this.scene.add(this.camera);

    // soft white light
    const amb_light = new THREE.AmbientLight(0x410445, 10);
    amb_light.position.set(0, -2, -2);
    this.scene.add(amb_light);

    const light = new THREE.DirectionalLight(0xfffffff, 2);
    light.position.set(0, 2, 2);
    light.target.add(this.avocadoModel);
    this.scene.add(light);

    this.loadAvocado();
  }

  public loadAvocado() {
    const texture = new THREE.TextureLoader().load(
      'assets/textures/avocado.png'
    );
    const material = new THREE.MeshLambertMaterial({ map: texture });
    const loader = new GLTFLoader();

    loader.load(
      'assets/models/avocado.glb',
      (gltf) => {
        const object = gltf.scene;

        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = material;
          }
        });

        this.avocadoModel = object;
        this.scene.add(object);
      },
      (onerror = (err) => {
        console.error(err);
      })
    );
  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.

    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    if (this.avocadoModel) {
      this.avocadoModel.rotation.y += 0.01;
    }
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}
