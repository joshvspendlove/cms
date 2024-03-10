import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css',
})
export class ContactListComponent implements OnInit, OnDestroy {
  selectedContact: Contact;
  contacts: Contact[];
  subscription: Subscription
  term: string

  constructor(private contactService: ContactService) {}

  // onSelected(contact: Contact) {
  //   this.contactService.contactSelectedEvent.emit(contact);
  // }

  search(value: string)
  {
    this.term = value
  }

  ngOnInit(): void {
    this.contacts = this.contactService.getContacts();
    this.subscription = this.contactService.contactListChangedEvent.subscribe((contacts) => {
      this.contacts = contacts;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
