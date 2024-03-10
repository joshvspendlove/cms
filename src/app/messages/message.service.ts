import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>()
  maxMessageId: number
  

  constructor(private http: HttpClient) {
    this.requestMessages()
  }

  addMessage(message: Message)
  {
    message.id = `${++this.maxMessageId}`
    this.messages.push(message)
    this.storeMessages()
  }

  getMessages() {
    return this.messages.slice();
  }

  getMessage(id: string) {
    let message = this.messages.find((message) => message.id === id);
    if (message) return message;
    else return null;
  }

  getMaxId(): number {
    let maxId = Math.max(...this.messages.map(message => parseInt(message.id, 10)));
    return maxId
  }


  requestMessages() {
    return this.http
      .get<Message[]>(
        'https://js-wdd430-cms-default-rtdb.firebaseio.com/messages.json'
      )
      .subscribe(
        (messages: Message[]) => {
          this.messages = messages
          this.maxMessageId = this.getMaxId()
          this.messageChangedEvent.next(this.messages.slice());
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  storeMessages() {
    const messageJson = JSON.stringify(this.messages);
    let header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    this.http
      .put(
        'https://js-wdd430-cms-default-rtdb.firebaseio.com/messages.json',
        messageJson,
        { headers: header }
      )
      .subscribe((response) => {
        this.messageChangedEvent.next(this.messages.slice())
      });
  }
}
