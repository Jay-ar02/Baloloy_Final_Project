import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PostService } from '../posts.service';
import { Post } from '../post.model';
import { ModalService } from '../modal.service';
import { Router } from '@angular/router';

@Component({
 selector: 'app-post-edit',
 templateUrl: './post-edit.component.html',
 styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {
 @Output() postUpdated = new EventEmitter<Post>();
 @Input() post!: Post;
 isEditMode = false;
 isOpen = false;
 isUpdating = false;
 posts: Post[] = [];
 @Input() selectedPost!: Post;

 constructor(
    private modalService: ModalService,
    private postService: PostService,
    private router: Router
 ) {
    this.modalService.isOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
    });
 }

 ngOnInit(): void {
   this.postService.getAllPosts().subscribe(response => {
      if (Array.isArray(response)) {
        this.posts = response;
      } else {
        console.error('Expected an array of Post objects, but received:', response);
      }
    });
 }

 editPost(): void {
    this.isEditMode = true;
    this.openEditModal();
 }

 onUpdatePost() {
    if (this.post && this.post._id) {
      this.postService.updatePost(this.post._id, this.post.title, this.post.content, this.post.imageUrl)
        .subscribe(updatedPost => {
          this.closeModal();
          this.refreshPosts();
          this.postUpdated.emit(updatedPost);
        }, error => {
          console.error('Error updating post:', error);
        });
    }
 }

 openEditModal() {
    this.modalService.open();
 }

 closeModal() {
    this.isOpen = false;
    this.modalService.close();
 }

 refreshPosts() {
   this.postService.getAllPosts().subscribe(response => {
       this.posts = response;
   });
 }

 updatePost(post: Post) {
   this.isUpdating = true;

   this.postService.updatePost(post._id, post.title, post.content, post.imageUrl).subscribe(updatedPost => {
     if (Array.isArray(this.posts)) {
       const index = this.posts.findIndex(p => p._id === updatedPost._id);
       if (index !== -1) {
         this.posts[index] = updatedPost;
       }
     } else {
       console.error('Expected this.posts to be an array, but it is:', this.posts);
     }

     this.postUpdated.emit(updatedPost);
     this.isUpdating = false;
     this.closeModal();
   }, error => {
     console.error('Update failed:', error);
     this.isUpdating = false;
     this.closeModal();
   });
 }
}