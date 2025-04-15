import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-starting-screen',
  imports: [CommonModule],
  templateUrl: './starting-screen.component.html',
  styleUrl: './starting-screen.component.css',
  standalone: true,
})
export class StartingScreenComponent {
  highlightedText: string[] = ' very cool '.split('');
}
