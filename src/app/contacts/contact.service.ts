import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { Subject } from 'rxjs';
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
    this.requestContacts()
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
        'https://js-wdd430-cms-default-rtdb.firebaseio.com/contacts.json'
      )
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();
          this.contacts = this.contacts.sort((currCont, nextCont) => {
            if (currCont.name < nextCont.name) return -1;
            else if (currCont.name > nextCont.name) return 1;
            else return 0;
          });
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error: any) => {
          console.error(error);
        }
      );
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


  getMaxId(): number {
    let maxId = Math.max(...this.contacts.map(contact => parseInt(contact.id, 10)));
    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) return;

    newContact.id = `${++this.maxContactId}`;
    this.contacts.push(newContact);
    this.storeContacts()
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) return;

    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0) return;

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts()
  }

  deleteContact(contact: Contact) {
    if (!contact) return;

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) return;
    
    this.contacts.splice(pos, 1);
    this.storeContacts()
  }
}
