import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatService {
  private socket: any;
  private host: string = "http://127.0.0.1:4000";

  getMessages() {
    let observable = new Observable(
      observer => {
        this.socket = io(this.host);
        this.socket.on('output', (data) => {
          observer.next(data);    
        });
        return () => {
          this.socket.disconnect();
        };  
      }
    )     
    return observable;
  } 

  sendMessage(message) {
    this.socket.emit('add-message', message);
  };

  clearMessages() {
    this.socket.emit('clear');
  }
 
}
