import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { PostsServices } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-posts-create',
  templateUrl: 'posts-create.component.html',
  styleUrls: ['posts-create.component.css']
})

export class PostsCreateComponent implements OnInit,OnDestroy{
  private mode='create';
  private postId='';
  isLoading = false;
  imagePreview: string;
  form: FormGroup
  post : Post;
  private authStatusSub : Subscription;

  constructor(public postsService: PostsServices, public route: ActivatedRoute, private authService: AuthService){}

  ngOnInit(){
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading=false;
    });
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required,Validators.minLength(3)]
      }),
      'content' : new FormControl(null, {
        validators: [Validators.required]
      }),
      'image' : new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe( ( paramMap: ParamMap ) => {
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading=true;
        this.postsService.getPost(this.postId).subscribe( postData => {
          this.isLoading=false;
          this.post = {id: postData._id,title: postData.title, content: postData.content, imagePath: postData.imagePath, creator: postData.creator};
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      }
      else
      {
        this.mode= 'create';
        this.postId=null;
      }
    });
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  OnSavePost(){
   if (this.form.invalid) {
     return;
   }
   this.isLoading=true;
   if(this.mode == 'create'){
     this.postsService.addPost(this.form.value.title,this.form.value.content,this.form.value.image);
   }
   else{
     this.postsService.updatePost(this.postId,this.form.value.title,this.form.value.content,this.form.value.image);
   }
   this.form.reset();
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
