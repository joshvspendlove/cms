import { Component, Input } from '@angular/core';

@Component({
  selector: 'cms-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent {
@Input() selectedDocument: Document

}
