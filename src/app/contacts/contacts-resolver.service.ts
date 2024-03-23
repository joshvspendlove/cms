import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';

@Injectable({ providedIn: 'root' })
export class ContactResolverService implements Resolve<Contact[]> {
  constructor(
    private contactService: ContactService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const contacts = this.contactService.getContacts();

    if (contacts.length === 0) {
      return this.contactService.requestContacts();
    }

    return contacts;
  }
}
