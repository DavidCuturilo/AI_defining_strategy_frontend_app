import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  public apiURL = 'http://localhost:3000'
  public ai_assist_apiKey = '8hd12hd812d182'
  constructor() { }
}
