import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum Model {
  Apple = 'apple',
  Avocado = 'avocado',
  Banana = 'banana',
  Blackberry = 'blackberry',
  Cherry = 'cherry',
  Coconut = 'coconut',
  Grape = 'grape',
  Lemon = 'lemon',
  Lime = 'lime',
  Mango = 'mango',
  Orange = 'orange',
  Papaya = 'papaya',
  Pear = 'pear',
  Pineapple = 'pineapple',
  Strawberry = 'strawberry',
}

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  private models: Model[] = Object.values(Model);
  private index = 0;

  private modelSubject = new BehaviorSubject<Model>(this.models[this.index]);
  model$ = this.modelSubject.asObservable();

  nextModel() {
    this.index = (this.index + 1) % this.models.length;
    this.modelSubject.next(this.models[this.index]);
  }

  previousModel() {
    this.index = (this.index - 1 + this.models.length) % this.models.length;
    this.modelSubject.next(this.models[this.index]);
  }

  constructor() {}
}
