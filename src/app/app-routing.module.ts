import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostEditComponent } from './post/post-edit/post-edit.component';
import { PostListComponent } from './post/post-list/post-list.component';

const routes: Routes = [
    // Other routes...
    { path: 'posts', component: PostListComponent }, // Assuming 'PostListComponent' is the component for the post list page
    { path: 'edit/:id', component: PostEditComponent },
    // Other routes...
   ];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule]
})
export class AppRoutingModule { }