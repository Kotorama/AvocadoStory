import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { EngineComponent } from './engine/engine.component';
import { StartingScreenComponent } from './starting-screen/starting-screen.component';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  imports: [EngineComponent, StartingScreenComponent],
})
export class AppComponent {}
