import {  Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit,OnDestroy{

  userIsAunthenticated = false;
  private authListnerSubs: Subscription;

  constructor(private authService: AuthService){}

  ngOnInit(){
    this.userIsAunthenticated = this.authService.getIsAuth();
    this.authListnerSubs = this.authService.getAuthStatusListener().subscribe( userAuthenticated =>{
      this.userIsAunthenticated = userAuthenticated;
    });

  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(){
    this.authListnerSubs.unsubscribe();
  }

}
