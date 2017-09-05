import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatService {
  private socket: any;
  private host: string = "http://127.0.0.1:4000";

  constructor() {
    this.socket = io(this.host);
    this.socket.on("connect", () => this.connected());
    this.socket.on("disconnect", () => this.disconnected());
    this.socket.on("error", (error: string) => {
        console.log(`ERROR: "${error}" (${this.host})`);
    });
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  private connected() {
    console.log('Connected');
  }

  private disconnected() {
    console.log('Disconnected');
  }

  
 
}
