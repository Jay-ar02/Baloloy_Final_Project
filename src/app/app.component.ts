import { Component } from '@angular/core';
import { Post } from './post/post.model'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // storedPosts: Post[] = [];

  // onPostAdded(post: Post){
  //   this.storedPosts.push(post);
  // }
  posts: Post[] = [];

  onPostAdded(post: Post) {
    this.posts.push(post);
  }

  title: String = 'Baloloy-final-project';
}
