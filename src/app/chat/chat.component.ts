import {
  ChatConfiguration,
  GenerateChatRequestDto,
} from '../models/request/generate-chat.request.dto';
import { ChatService } from './chat.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatMessageRequestDto } from '../../../../AI_defining_strategy_backend/src/open_ai/dto/chat-message.request.dto';
import { ChatCompletionRole } from '../models/response/generate-chat.response.dto';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  constructor(private readonly chatService: ChatService) {}

  messages: ChatMessageRequestDto[] = [];
  @ViewChild('sendMessageContent') messageField: ElementRef;
  chat_configuration;
  isGeneratingMessageDone = true;

  ngOnInit() {
    this.chat_configuration = 'Strategy';
  }

  async sendMessage() {
    this.isGeneratingMessageDone = false;
    const message = this.messageField.nativeElement.value;
    this.messageField.nativeElement.value = '';
    this.messages.push({ role: 'user' as ChatCompletionRole, content: message});

    const generateChatRequest: GenerateChatRequestDto = {
      chat_configuration: this.chat_configuration as ChatConfiguration,
      messages: [
        ...this.messages,
        { role: 'user' as ChatCompletionRole, content: message },
      ],
    };

    const responseMessage = await this.chatService.chat(generateChatRequest);
    setTimeout(() => {
      this.messages.push(responseMessage);
      this.isGeneratingMessageDone = true;
    }, 2000);
  }
}
