import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { Subject, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contacts: Contact[] = [];
  // contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number

  constructor(private http: HttpClient) {
    this.requestContacts().subscribe()
  }

  getContacts() {
    return this.contacts.slice();
  }

  getContact(id: string) {
    let contact = this.contacts.find((contact) => contact.id === id);
    if (contact) return contact;
    else return null;
  }

  requestContacts() {
    return this.http
      .get<Contact[]>(
        'http://localhost:3000/contacts'
      )
      .pipe(tap(
        (result: any) => {
          this.contacts = result.contacts;
          this.sortAndSend()
          
        },
        (error: any) => {
          console.error(error);
        }
      ));
  }

  sortAndSend()
  {
    this.contacts = this.contacts.sort((currCont, nextCont) => {
      if (currCont.name < nextCont.name) return -1;
      else if (currCont.name > nextCont.name) return 1;
      else return 0;
    });
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  storeContacts() {
    const contactJson = JSON.stringify(this.contacts);
    let header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    this.http
      .put(
        'https://js-wdd430-cms-default-rtdb.firebaseio.com/contacts.json',
        contactJson,
        { headers: header }
      )
      .subscribe((response) => {
        this.contactListChangedEvent.next(this.contacts.slice())
      });
  }


  addContact(newContact: Contact) {
    if (!newContact) return;

    newContact.id = '';
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
    newContact,
    { headers: headers })
    .subscribe(
      (responseData) => {
        // add new document to documents
        this.contacts.push(responseData.contact);
        this.sortAndSend();
      }
    );

  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) return;

    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0) return;

    newContact.id = originalContact.id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/contacts/' + originalContact.id,
      newContact, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.contacts[pos] = newContact;
          this.sortAndSend();
        }
      );    
  }

  deleteContact(contact: Contact) {
    if (!contact) return;

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) return;
    
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(
        (response: Response) => {
          this.contacts.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }
}
