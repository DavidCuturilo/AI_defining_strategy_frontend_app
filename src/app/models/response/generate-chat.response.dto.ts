export class GenerateChatResponseDto {
  role: ChatCompletionRole;
  content: string;
}

export enum ChatCompletionRole {
  USER = 'user',
  SYSTEM = 'system',
  ASSISTANT = 'assistant',
  FUNCTION = 'function',
}
