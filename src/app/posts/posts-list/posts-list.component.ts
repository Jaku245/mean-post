import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";

import { PostsServices } from '../posts.service';
import { Post } from '../post.model';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: 'posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})

export class PostsListComponent implements OnInit, OnDestroy{

  posts: Post[] = [];
  isLoading=false;
  totalPosts=0;
  postsPerPage=2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10 ];
  userIsAunthenticated = false;
  userId: string;
  private authListnerSubs: Subscription;
  private postsSub : Subscription;

  constructor(public postsService: PostsServices, private authService: AuthService){

  }

  ngOnInit(){
    this.isLoading=true;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub=this.postsService.getpostUpdateListener()
    .subscribe((postsData: {posts: Post[], postCount: number})=>{
      this.isLoading=false;
      this.totalPosts=postsData.postCount;
      this.posts=postsData.posts;
    });
    this.userIsAunthenticated = this.authService.getIsAuth();
    this.authListnerSubs = this.authService.getAuthStatusListener().subscribe( userAuthenticated =>{
      this.userIsAunthenticated = userAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onPageChanged(page: PageEvent){
    this.isLoading=true;
    this.postsPerPage=page.pageSize;
    this.currentPage=page.pageIndex+1;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
  }

  onDelete(postId : string ){
    this.postsService.deletePost(postId).subscribe(()=>{
      this.postsService.getPosts(this.postsPerPage,this.currentPage);
    });
  }

  ngOnDestroy(){
    this.authListnerSubs.unsubscribe();
    this.postsSub.unsubscribe();
  }
}
