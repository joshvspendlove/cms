import { Component, Input, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WindRefService } from '../../wind-ref.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.css',
})
export class DocumentDetailComponent implements OnInit {
  document: Document;
  nativeWindow: any

  constructor(
    private docService: DocumentService,
    private router: Router,
    private route: ActivatedRoute,
    private wrService: WindRefService
  ) {}

  ngOnInit(): void {
    this.nativeWindow = this.wrService.getNativeWindow()
    this.route.params.subscribe(
      (params) => (this.document = this.docService.getDocument(params['id']))
    );
  }

  onView()
  {
    if(this.document.url)
    this.nativeWindow.open(this.document.url)
  }

  onDelete(){
    this.docService.deleteDocument(this.document)
    this.router.navigate(["documents"])
  }
}
