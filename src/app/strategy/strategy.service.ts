import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { EnvService } from '../config/env.service';
import { lastValueFrom } from 'rxjs';
import { GenerateStrategyRequestDto } from '../models/request/generate-strategy.request.dto';
import { SaveStrategyRequestDto } from '../models/request/save-strategy.request.dto';

@Injectable({
  providedIn: 'root',
})
export class StrategyService {
  constructor(private http: HttpClient, private injector: Injector) {}
  envService: EnvService = this.injector.get(EnvService);

  async generateStrategy(generateStrategyData: GenerateStrategyRequestDto) {
    return await lastValueFrom(
      this.http.post<{ message: string }>(
        `${this.envService.apiURL}/open-ai/strategy`,
        generateStrategyData
      )
    );
  }

  async saveStrategy(document: SaveStrategyRequestDto) {
    return await lastValueFrom(
      this.http.post<{ message: string }>(
        `${this.envService.apiURL}/open-ai/save-strategy`,
        document
      )
    );
  }
}
