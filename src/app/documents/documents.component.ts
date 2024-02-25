import { Component, Input, OnInit } from '@angular/core';
import { DocumentService } from './document.service';
import { Document } from './document.model';

@Component({
  selector: 'cms-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit{
// @Input() selectedDocument: Document

// constructor(private documentService:DocumentService){}

ngOnInit(): void {
  // this.documentService.documentSelectedEvent.subscribe((document)=>{
  //   this.selectedDocument = document
  // })
}
}
