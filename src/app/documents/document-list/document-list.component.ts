import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>()

  documents: Document[] = [
    new Document(1,"Meals","List of meal ideas","/meals",null),
    new Document(1,"Homework","List of homework assignments","/homework",null),
    new Document(1,"Commands","List of supported commands","/commands",null),
    new Document(1,"Names","List of family names","/names",null),
    new Document(1,"Shopping List","List of item to buy","/shopping",null)
  ]

  onSelectedDocument(document: Document)
  {
    this.selectedDocumentEvent.emit(document)
  }
}
