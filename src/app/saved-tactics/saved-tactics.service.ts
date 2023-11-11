import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { EnvService } from '../config/env.service';
import { lastValueFrom } from 'rxjs';
import { SavedTacticsResponseDto } from '../models/response/saved-tactics.response.dto';

@Injectable({
  providedIn: 'root',
})
export class SavedTacticsService {
  constructor(private http: HttpClient, private injector: Injector) {}
  envService: EnvService = this.injector.get(EnvService);

  async getSavedTactics(userId: number) {
    return await lastValueFrom(
      this.http.get<SavedTacticsResponseDto[]>(
        `${this.envService.apiURL}/open-ai/saved-tactics/${userId}`
      )
    );
  }

  async removeStrategy(strategyId: number) {
    return await lastValueFrom(
      this.http.delete(
        `${this.envService.apiURL}/open-ai/saved-tactics/${strategyId}`
      )
    );
  }
}
