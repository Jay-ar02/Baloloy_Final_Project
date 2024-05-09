import { Component } from '@angular/core';
import { Post } from './post/post.model'; 
import { AuthService } from './post/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  // storedPosts: Post[] = [];
  // onPostAdded(post: Post){
    selectedPost: Post = { _id: '', title: '', content: '', imageUrl: '' };
    yourPostVariable: Post = { _id: '', title: '', content: '', imageUrl: '' };
   
  //   this.storedPosts.push(post);
  // }
  posts: Post[] = [];

  onPostAdded(post: Post) {
    this.posts.push(post);
  }

  title: String = 'Baloloy-final-project';
}
