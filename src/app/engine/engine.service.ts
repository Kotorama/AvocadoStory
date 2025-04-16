import {
  AfterViewInit,
  ElementRef,
  Injectable,
  NgZone,
  OnDestroy,
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js';
import { Model, ModelService } from '../model.service';

@Injectable({ providedIn: 'root' })
export class EngineService implements OnDestroy, AfterViewInit {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.DirectionalLight;
  private amb_light: THREE.DirectionalLight;
  private controls: OrbitControls;

  private currentModelInstance: THREE.Group<THREE.Object3DEventMap>;

  private cube: THREE.Mesh;

  private frameId: number = null;

  public constructor(
    private ngZone: NgZone,
    private modelService: ModelService
  ) {
    this.modelService.model$.subscribe((model) => {
      this.updateModels(model, this.currentModelInstance);
    });
  }

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

  public ngAfterViewInit(): void {
    window.addEventListener('resize', () => this.resize());

    if (document.readyState !== 'loading') {
      this.render();
    } else {
      window.addEventListener('DOMContentLoaded', () => this.render());
    }
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
    this.scene.add(this.camera);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 10;

    const amb_light = new THREE.AmbientLight(0x410445, 10);
    amb_light.position.set(0, -2, -2);
    this.scene.add(amb_light);

    const light = new THREE.DirectionalLight(0xfffffff, 2);
    light.position.set(0, 2, 2);
    light.target.add(this.currentModelInstance);
    this.scene.add(light);
  }

  public loadModel(model: Model) {
    const texture = new THREE.TextureLoader().load(
      `assets/textures/${model}.png`
    );
    const material = new THREE.MeshLambertMaterial({ map: texture });
    const loader = new GLTFLoader();

    loader.load(
      `assets/models/${model}.glb`,
      (gltf) => {
        const object = gltf.scene;

        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = material;
          }
        });

        object.position.set(0, 0, 0);
        this.currentModelInstance = object;
        this.scene.add(object);
      },
      (onerror = (err) => {
        console.error(err);
      })
    );
  }

  public deleteModel(model: THREE.Group<THREE.Object3DEventMap>) {
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        mesh.geometry.dispose();

        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });

    this.scene.remove(model);
  }

  public updateModels(next: Model, prev?: THREE.Group<THREE.Object3DEventMap>) {
    if (prev) {
      this.deleteModel(prev);
    }
    this.loadModel(next);
  }

  public animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const loop = () => {
        this.controls.update();
        this.render();
        this.frameId = requestAnimationFrame(loop);
      };
      loop();
    });
  }

  public render(): void {
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
