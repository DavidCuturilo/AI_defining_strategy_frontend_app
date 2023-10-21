import { GenerateChatRequestDto } from './../models/request/generate-chat.request.dto';
import { HttpClient } from '@angular/common/http';
import { EnvService } from './../config/env.service';
import { Injectable, Injector } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient, private injector: Injector) {}
  envService: EnvService = this.injector.get(EnvService);

  async chat(generateChatData: GenerateChatRequestDto) {
    return await lastValueFrom(
      this.http.post<{ message: string }>(
        `${this.envService.apiURL}/open-ai/chat`,
        generateChatData
      )
    );
  }
}
