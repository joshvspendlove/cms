import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages: Message[] = [
    new Message(5,"Homework","What are we doing for dinner tonight?","Breana"),
    new Message(5,"Dinosaurs","I like Dinosaurs! Roar!!","Aiden"),
    new Message(5,"No!!","Not Veggietales, No! Spiderman!!","John"),
  ]

  onMessageAdd(message: Message)
  {
    this.messages.push(message)
  }
  print(data: any)
  {
    console.log(data)
  }
}
