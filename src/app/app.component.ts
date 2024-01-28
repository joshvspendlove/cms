import { Component } from '@angular/core';

@Component({
  selector: 'cms-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  selectedFeature = 'documents';

  switchView(selectedFeature: string)
  {
    this.selectedFeature = selectedFeature
  }
}
