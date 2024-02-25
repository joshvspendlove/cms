import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documents: Document[];
  // documentSelectedEvent = new EventEmitter<Document>();
  // Old EventEmitter code
  // documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;

  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments() {
    return this.documents.slice();
  }

  getDocument(id: string) {
    let document = this.documents.find((document) => document.id === id);
    if (document) return document;
    else return null;
  }

  getMaxId(): number {
    //let maxId = Math.max(...this.documents.map(document => parseInt(document.id, 10)));

    let maxId = 0;
    this.documents.forEach((document) => {
      let currentId = +document.id;
      if (currentId > maxId) maxId = currentId;
    });
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) return;

    newDocument.id = `${++this.maxDocumentId}`;
    this.documents.push(newDocument);
    this.documentListChangedEvent.next(this.documents.slice());
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) return;

    let pos = this.documents.indexOf(originalDocument);
    if (pos < 0) return;

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.documentListChangedEvent.next(this.documents.slice());
  }

  deleteDocument(document: Document) {
    if (!document) return;

    const pos = this.documents.indexOf(document);
    if (pos < 0) return;
    
    this.documents.splice(pos, 1);
    this.documentListChangedEvent.next(this.documents.slice());
  }
}
