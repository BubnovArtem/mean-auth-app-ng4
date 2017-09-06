import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import * as io from "socket.io-client";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  
  chats: any;
  joinned: boolean = false;
  newUser = { nickname: '', room: '' };
  msgData = { room: '', nickname: '', message: '' };
  socket = io('http://localhost:4000');

  constructor(private chatService: ChatService, private router: Router) { }

  ngOnInit() {
    // If chat_user exist -> get username from local storage
    const chat_user = this.getUser("chat_user");
    console.log('chat_user.nickname');
    if(chat_user!==null && (chat_user.nickname !== null || chat_user.nickname !== undefined || chat_user.nickname !== '')) {
      this.getChatByRoom(chat_user.room);
      this.msgData = { room: chat_user.room, nickname: chat_user.nickname, message: '' }
      this.joinned = true;
      this.scrollToBottom();
    } else {
      //If newUser -> get username from auth data
      this.newUser.nickname = this.getUser("user").username;
      localStorage.setItem("chat_user", JSON.stringify(this.newUser));
    }

    this.socket.on('new-message', (data) => {
      const chat_user = this.getUser("chat_user");
      if(chat_user && (data.message.room === chat_user.room)) {
        this.chats.push(data.message);
        this.msgData = { room: chat_user.room, nickname: chat_user.nickname, message: '' }
        this.scrollToBottom();
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  getUser(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  getChatByRoom(room) {
    this.chatService.getChatByRoom(room).then((res) => {
      this.chats = res;
    }, (err) => {
      console.log(err);
    });
  }

  joinRoom() {
    const date = new Date();
    localStorage.setItem("chat_user", JSON.stringify(this.newUser));
    this.getChatByRoom(this.newUser.room);
    this.msgData = { room: this.newUser.room, nickname: this.newUser.nickname, message: '' };
    this.joinned = true;
    this.socket.emit('save-message', { room: this.newUser.room, nickname: this.newUser.nickname, message: 'Join this room', updated_at: date });
  }

  sendMessage() {
    this.chatService.saveChat(this.msgData).then((result) => {
      console.log('Message to send: ' + this.msgData);
      this.socket.emit('save-message', result);
    }, (err) => {
      console.log(err);
    });
  }

  logout() {
    const date = new Date();
    const user = this.getUser("chat_user");
    this.socket.emit('save-message', { room: user.room, nickname: user.nickname, message: 'Left this room', updated_at: date });
    localStorage.removeItem("chat_user");
    this.joinned = false;
  }

}
