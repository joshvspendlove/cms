import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[];
  messageChangedEvent = new EventEmitter<Message[]>()

  constructor() {
    this.messages = MOCKMESSAGES;
  }

  addMessage(message: Message)
  {
    this.messages.push(message)
    this.messageChangedEvent.emit(this.getMessages())
  }

  getMessages() {
    return this.messages.slice();
  }

  getMessage(id: string) {
    let message = this.messages.find((message) => message.id === id);
    if (message) return message;
    else return null;
  }
}
