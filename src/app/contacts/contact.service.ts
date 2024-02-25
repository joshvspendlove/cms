import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contacts: Contact[];
  // contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId()
  }

  getContacts() {
    return this.contacts.slice();
  }

  getContact(id: string) {
    let contact = this.contacts.find((contact) => contact.id === id);
    if (contact) return contact;
    else return null;
  }


  getMaxId(): number {
    let maxId = Math.max(...this.contacts.map(contact => parseInt(contact.id, 10)));
    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) return;

    newContact.id = `${++this.maxContactId}`;
    this.contacts.push(newContact);
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) return;

    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0) return;

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  deleteContact(contact: Contact) {
    if (!contact) return;

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) return;
    
    this.contacts.splice(pos, 1);
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}
