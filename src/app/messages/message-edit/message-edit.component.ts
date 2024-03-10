import { Component, ElementRef, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  constructor(private messageService: MessageService){}

  @ViewChild("subject") subjectElm: ElementRef
  @ViewChild("msgText") msgTextElm: ElementRef

  currentSender = "7"

  onSendMessage()
  {
    let subject = this.subjectElm.nativeElement.value
    let msgText = this.msgTextElm.nativeElement.value
    
    let message = new Message(null,subject,msgText, this.currentSender)
    this.messageService.addMessage(message)
    this.onClear()
  }

  onClear()
  {
    this.subjectElm.nativeElement.value = ""
    this.msgTextElm.nativeElement.value = ""
  }
}
