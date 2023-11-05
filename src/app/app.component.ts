import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.autoAuthUser();
  }

  title = 'AI_defining_strategy_frontend';

  routesToExcludeMenu = ['/login', '/register'];

  readonly shouldShowMenu$ = this.router.events.pipe(
    filter((event: NavigationEnd) => event instanceof NavigationEnd),
    map(
      ({ url }) =>
        !this.routesToExcludeMenu.some((route) => url.includes(route))
    )
  );
}
