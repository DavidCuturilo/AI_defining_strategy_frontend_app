import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  user;

  ngOnInit(): void {
    this.user = {
      name: 'David',
      lastname: 'Cuturilo',
      username: 'davidcuturilo',
    }
  }

  editInformation() {
    console.log('Edit information');
  }
}
