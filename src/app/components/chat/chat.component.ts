import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import * as io from "socket.io-client";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  statusDefault: string ='';
  status: string;
  socket: any;
  private host: string = "http://127.0.0.1:4000";
  messages = [];
  message: string;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.socket = io.connect(this.host);

    if(this.socket !== undefined) {
      console.log('Connected to socket');

      this.socket.on('output', (data) => {
        if(data.length) {
          this.messages = data;
        }
      });

      this.socket.on('message', (data) => {
        this.messages.push(data);
      });

      this.socket.on('status', (data) => {
        // Get message status
        this.setStatus((typeof data === 'object') ? data.message : data);

        // If status is clear, clear text
        if(data.clear) {
          this.message = '';
        }
      });
    }
  }

  setStatus(s) {
    this.status = s;

    if(s!== this.statusDefault) {
      setTimeout(() => {
        this.setStatus(this.statusDefault);
      }, 4000);
    }
  }

  //Handle input
  onMessageText(event, message) {
    if(event.which === 13 && event.shiftKey === false) {
      // Emit to server input
      this.socket.emit('input', {
        name: 'Artem',
        message: this.message
      });

      event.preventDefault();
    }
  }

  //Handle Chat clear
  onClear() {
    this.socket.emit('clear');

    this.socket.on('cleared', () => {
      this.messages = [];
    });
  }

  ngOnDestroy() {
    this.socket.disconnect();
    console.log('User disconnected');
  }

}
