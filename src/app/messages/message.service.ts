import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>()
  maxMessageId: number
  

  constructor(private http: HttpClient) {
    this.requestMessages().subscribe()
  }

  addMessage(message: Message)
  {
    message.id = ''

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.post<{ message: string, msg: Message }>('http://localhost:3000/messages',
    message,
    { headers: headers })
    .subscribe(
      (responseData) => {
        // add new message to messages
        this.messages.push(responseData.msg);
        this.messageChangedEvent.next(this.messages.slice());
      }
    );
  }

  getMessages() {
    return this.messages.slice();
  }

  getMessage(id: string) {
    let message = this.messages.find((message) => message.id === id);
    if (message) return message;
    else return null;
  }


  requestMessages() {
    return this.http
      .get<{msgs:Message[]}>(
        'http://localhost:3000/messages'
      )
      .pipe(tap(
        (result: any) => {
          this.messages = result.msgs
          this.messageChangedEvent.next(this.messages.slice());
        },
        (error: any) => {
          console.error(error);
        }
      ));
  }

}
