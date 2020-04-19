import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


const BACKEND_URL = environment.apiUrls + "/user/";

@Injectable({ providedIn: 'root' })
export class AuthService{

  constructor(private http: HttpClient, private router: Router) {}

  private isAuthenticated = false;
  private tokenTimer : any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  private token;

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  autoUserAuth(){
    const authInfo = this.getAuthData();
    if(!authInfo){
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn/1000);
      this.authStatusListener.next(true);
    }
  }

  setAuthTimer(duration : number){
    console.log("setting Timer of "+duration);
    this.tokenTimer = setTimeout(()=>{
      this.logout();
    }, duration*1000);
  }

  createuser(email: string , password: string){
    const authData : AuthData = { email: email, password: password};
    this.http.post(BACKEND_URL+"signup",authData)
    .subscribe(result => {
      console.log(result);
      this.router.navigate(['/login']);
    },error => {
      this.authStatusListener.next(false);
    });
  }

  login(email: string , password: string){
    const authData : AuthData = { email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL+"login",authData)
    .subscribe(result => {
      const token = result.token;
      this.token=token;
      if(token){
        const expiresInDiuration = result.expiresIn;
        this.setAuthTimer(expiresInDiuration);
        this.isAuthenticated=true;
        this.userId= result.userId;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDiuration * 1000);
        console.log(expirationDate);
        this.saveAuthData(token, expirationDate, result.userId);
        this.router.navigate(['/']);
      }
    },error => {
      this.authStatusListener.next(false);
    });
  }

  logout(){
    this.token=null;
    this.isAuthenticated=false;
    this.authStatusListener.next(false);
    this.userId=null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  saveAuthData(token : string , expirationDate : Date, userId: string ){
    localStorage.setItem("token" , token);
    localStorage.setItem("expires" , expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expires");
    localStorage.removeItem("userId");
  }

  getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expires");
    const userId = localStorage.getItem("userId");
    if(!token || !expirationDate){
      return;
    }
    return{
      token: token,
      expirationDate : new Date(expirationDate),
      userId: userId
    }
  }
}
