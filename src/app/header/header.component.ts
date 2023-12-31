import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;

  constructor(private authService: AuthService) { }

  onLogout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated;
    })
  }

  getAuthorizationClass() {
    if (!this.userIsAuthenticated) {
      return 'unauthorized'
    }
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
