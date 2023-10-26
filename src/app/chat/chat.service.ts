import { GenerateChatRequestDto } from './../models/request/generate-chat.request.dto';
import { HttpClient } from '@angular/common/http';
import { EnvService } from './../config/env.service';
import { Injectable, Injector } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { GenerateChatResponseDto } from '../models/response/generate-chat.response.dto';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient, private injector: Injector) {}
  envService: EnvService = this.injector.get(EnvService);

  async chat(generateChatData: GenerateChatRequestDto) {
    return await lastValueFrom(
      this.http.post<GenerateChatResponseDto>(
        `${this.envService.apiURL}/open-ai/chat`,
        generateChatData
      )
    );
  }
}
