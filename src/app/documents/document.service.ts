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
        'http://localhost:3000/documents'
      )
      .subscribe(
        (result: any) => { 
          this.documents = result.documents;
          this.sortAndSend()
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
        'http://localhost:3000/documents',
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
    for (const key in this.documents)
    {
    this.documents.forEach((document) => {
      let currentId = +document.id;
      if (currentId > maxId) maxId = currentId;
    });
  }
    return maxId;
  }

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
          this.sortAndSend();
        }
      );
  }

  sortAndSend()
  {
    this.documents = this.documents.sort((currDoc, nextDoc) => {
      if (currDoc.name < nextDoc.name) return -1;
      else if (currDoc.name > nextDoc.name) return 1;
      else return 0;
    });
    this.documentListChangedEvent.next(this.documents.slice());
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
    //newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        }
      );
  }

  deleteDocument(document: Document) {

    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        (response: Response) => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }
}
