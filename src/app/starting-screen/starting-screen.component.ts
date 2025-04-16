import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EngineComponent } from '../engine/engine.component';
import { ModelService } from '../model.service';

@Component({
  selector: 'app-starting-screen',
  imports: [CommonModule],
  templateUrl: './starting-screen.component.html',
  styleUrl: './starting-screen.component.css',
  standalone: true,
})
export class StartingScreenComponent {
  public currentModel: string;
  constructor(private modelService: ModelService) {
    this.modelService.model$.subscribe((model) => {
      this.currentModel = model;
    });
  }

  highlightedText: string[] = ' very cool '.split('');

  nextModel() {
    this.modelService.nextModel();
  }

  previousModel() {
    this.modelService.previousModel();
  }
}
