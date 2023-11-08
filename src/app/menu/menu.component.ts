import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  constructor(private readonly authService: AuthService) {}
  isLoggedIn = false;
  ngOnInit() {
    this.isLoggedIn = this.authService.getIsAuthenticated();
  }

  logout() {
    this.authService.logout();
  }
}
