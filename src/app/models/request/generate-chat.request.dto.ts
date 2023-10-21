export interface GenerateChatRequestDto {
  chat_configuration: ChatConfiguration;
  messages: string[];
}

export enum ChatConfiguration {
  STRATEGY = 'Strategy',
  OTHER = 'Other',
}
