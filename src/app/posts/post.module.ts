import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { PostsCreateComponent } from './posts-create/posts-create.Component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
  declarations: [
    PostsCreateComponent,
    PostsListComponent
  ],
  imports : [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AngularMaterialModule
  ]
})
export class Postmodule {}
