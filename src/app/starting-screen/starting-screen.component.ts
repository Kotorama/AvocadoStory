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
  constructor(private modelService: ModelService){}

  highlightedText: string[] = ' very cool '.split('');

  nextModel() {
    this.modelService.nextModel();
  }
}
