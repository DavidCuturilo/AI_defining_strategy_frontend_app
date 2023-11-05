import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  constructor(
    private router: Router,
  ) {}


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
