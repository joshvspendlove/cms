import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documents: Document[] = [];
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.requestDocuments();
  }

  getDocuments() {
    return this.documents.slice();
  }

  requestDocuments() {
    return this.http
      .get<Document[]>(
        'https://js-wdd430-cms-default-rtdb.firebaseio.com/documents.json'
      )
      .subscribe(
        (documents: Document[]) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          this.documents = this.documents.sort((currDoc, nextDoc) => {
            if (currDoc.name < nextDoc.name) return -1;
            else if (currDoc.name > nextDoc.name) return 1;
            else return 0;
          });
          this.documentListChangedEvent.next(this.documents.slice());
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  storeDocuments() {
    const docJson = JSON.stringify(this.documents);
    let header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    this.http
      .put(
        'https://js-wdd430-cms-default-rtdb.firebaseio.com/documents.json',
        docJson,
        { headers: header }
      )
      .subscribe((response) => {
        this.documentListChangedEvent.next(this.documents.slice())
      });
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
    this.storeDocuments()
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) return;

    let pos = this.documents.indexOf(originalDocument);
    if (pos < 0) return;

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments()
  }

  deleteDocument(document: Document) {
    if (!document) return;

    const pos = this.documents.indexOf(document);
    if (pos < 0) return;

    this.documents.splice(pos, 1);
    this.storeDocuments()
  }
}
