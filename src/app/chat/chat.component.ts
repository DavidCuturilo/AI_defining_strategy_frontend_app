import { ChatConfiguration, GenerateChatRequestDto } from '../models/request/generate-chat.request.dto';
import { ChatService } from './chat.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  constructor(private readonly chatService: ChatService) {}

  messages: string[] = [];
  @ViewChild("sendMessageContent") message: ElementRef;
  chat_configuration;
  isGeneratingMessageDone = true;

  ngOnInit() {
    this.chat_configuration = 'Strategy'
  }

  async sendMessage() {
    this.isGeneratingMessageDone = false;
    const message = this.message.nativeElement.value;
    this.message.nativeElement.value = '';
    this.messages.push(message);

    const generateChatRequest: GenerateChatRequestDto = {
      chat_configuration: this.chat_configuration as ChatConfiguration,
      messages: this.messages
    }

    const responseMessage = await this.chatService.chat(generateChatRequest);
    setTimeout(() => {
      this.messages.push(responseMessage.message);
      this.isGeneratingMessageDone = true;
    }, 2000)
  }
}
