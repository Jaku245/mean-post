import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostsListComponent } from './posts/posts-list/posts-list.component';
import { PostsCreateComponent } from './posts/posts-create/posts-create.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';

const routes: Routes = [
  { path: "", component: PostsListComponent },
  { path: "create", component: PostsCreateComponent, canActivate: [AuthGuard] },
  { path: "edit/:postId", component: PostsCreateComponent, canActivate: [AuthGuard] },
  { path: "auth" , loadChildren: () => AuthModule }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers : [AuthGuard]
})
export class AppRoutingModule { }
