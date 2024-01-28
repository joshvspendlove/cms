import { Component, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  @ViewChild("subject") subjectElm: ElementRef
  @ViewChild("msgText") msgTextElm: ElementRef
  @Output() addMessageEvent = new EventEmitter<Message>();
  currentSender = "Josh Spendlove"

  onSendMessage()
  {
    let subject = this.subjectElm.nativeElement.value
    let msgText = this.msgTextElm.nativeElement.value
    
    let message = new Message(1,subject,msgText,this.currentSender)
    this.addMessageEvent.emit(message)
    this.onClear()
  }

  onClear()
  {
    this.subjectElm.nativeElement.value = ""
    this.msgTextElm.nativeElement.value = ""
  }
}
