import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrl: './document-edit.component.css',
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;
  id: number;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (!this.id) {
        this.id = this.documentService.getMaxId() + 1;
        this.editMode = false;
        return;
      }
      this.originalDocument = this.documentService.getDocument(`${this.id}`);

      if (!this.originalDocument) {
        return;
      }
      this.editMode = true;
      this.document = JSON.parse(JSON.stringify(this.originalDocument));
    });
  }

  onCancel() {
    this.router.navigate(['../']);
  }

  onSubmit(form: FormGroup) {
    let value = form.value;

    let newDoc = new Document(
      `${this.id}`,
      value.name,
      value.description,
      value.url,
      null
    );
    if (this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDoc);
    } else this.documentService.addDocument(newDoc);
    this.router.navigate(['../']);
  }
}
