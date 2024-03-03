import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ContactService } from '../contact.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css',
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  invalidGroup: boolean;
  id: string;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (!this.id) {
        this.editMode = false;
        return;
      }
      this.originalContact = this.contactService.getContact(this.id);
      if (!this.originalContact) {
        return;
      }
      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));
      if (this.originalContact.group) {
        this.groupContacts = JSON.parse(
          JSON.stringify(this.originalContact.group)
        );
      }
    });
  }
  onCancel() {
    this.router.navigate(['../contacts']);
  }

  onDropEnter() {
    this.invalidGroup = null;
  }

  onDrop(event: CdkDragDrop<Contact[]>) {
    if (event.previousContainer !== event.container) {
      const selectedContact = { ...event.item.data };
      const invalidGroupContact = this.isInvalidContact(selectedContact);

      // if (!this.groupContacts.some((contact) => contact.id === selectedContact.id))
      //   this.groupContacts.push(selectedContact);

      if (invalidGroupContact) {
        return;
      }
      this.groupContacts.push(selectedContact);
    }
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      this.invalidGroup = true;

      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      this.invalidGroup = true;

      return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        this.invalidGroup = true;

        return true;
      }
    }
    return false;
  }
  onSubmit(form: FormGroup) {
    let value = form.value;

    let newContact = new Contact(
      `${this.id}`,
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts
    );
    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else this.contactService.addContact(newContact);
    this.router.navigate(['../contacts']);
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(index, 1);
  }
}
