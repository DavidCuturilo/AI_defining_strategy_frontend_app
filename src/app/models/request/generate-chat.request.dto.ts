import { ChatMessageRequestDto } from './../../../../../AI_defining_strategy_backend/src/open_ai/dto/chat-message.request.dto';
export interface GenerateChatRequestDto {
  chat_configuration: ChatConfiguration;
  messages: ChatMessageRequestDto[];
}

export enum ChatConfiguration {
  STRATEGY = 'Strategy',
  OTHER = 'Other',
}
