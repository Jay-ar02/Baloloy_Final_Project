import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostCreateComponent } from './post/post-create/post-create.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { AuthGuard } from './auth.guard';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UnauthenticatedComponent } from './unauthenticated/unauthenticated.component';
// import { PageNotFoundComponent } from './page-not-found/page-not-found.component'; // Adjust the import path as necessary

const routes: Routes = [
    { path: '', component: UnauthenticatedComponent }, // Default route
    { path: 'posts', component: PostListComponent, canActivate: [AuthGuard] }, // Protected route
    { path: 'create', component: PostCreateComponent }, // Now accessible to all users
    { path: 'header', component: HeaderComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    // Add the wildcard route at the end
    // { path: '**', component: PageNotFoundComponent }, // Wildcard route
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule]
})
export class AppRoutingModule { }
