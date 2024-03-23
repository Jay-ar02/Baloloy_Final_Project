import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PostService } from '../posts.service'; // Ensure this import path is correct
import { Post } from '../post.model';
import { ModalService } from '../modal.service';
import { Router } from '@angular/router'; // Import Router

@Component({
 selector: 'app-post-edit',
 templateUrl: './post-edit.component.html',
 styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {
 @Output() postUpdated = new EventEmitter<Post>();
 @Input() post!: Post; // Adjusted the type to Post for better type safety
 isEditMode = false;
 isOpen = false;
 isUpdating = false; // Add this property to track the update status
 posts: Post[] = []; // Assuming you have a posts array
 @Input() selectedPost!: Post; // Add this line

 constructor(
    private modalService: ModalService,
    private postService: PostService,
    private router: Router // Inject Router here
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

 // Method to enable edit mode
 editPost(): void {
    this.isEditMode = true;
    this.openEditModal(); // Open the modal when the edit button is clicked
 }

 onUpdatePost() {
    if (this.post && this.post._id) {
      this.postService.updatePost(this.post._id, this.post.title, this.post.content)
        .subscribe(updatedPost => {
          // Handle successful update, e.g., close the modal and refresh the list
          this.closeModal(); // Close the modal after updating the post
          this.refreshPosts();
          // Emit the updated post
          this.postUpdated.emit(updatedPost);
        }, error => {
          // Handle error, e.g., show an error message
          console.error('Error updating post:', error);
        });
    }
 }

 openEditModal() {
    this.modalService.open();
 }

 closeModal() {
    this.isOpen = false;
    this.modalService.close(); // Assuming your ModalService has a close method
 }

 refreshPosts() {
   this.postService.getAllPosts().subscribe(response => {
       // Directly assign the response to this.posts
       this.posts = response;
   });
}

updatePost(post: Post) {
   this.isUpdating = true; // Disable the update button

   this.postService.updatePost(post._id, post.title, post.content).subscribe(updatedPost => {
     // Debugging statement
     console.log('this.posts before findIndex:', this.posts);

     // Check if this.posts is an array before using findIndex
     if (Array.isArray(this.posts)) {
       const index = this.posts.findIndex(p => p._id === updatedPost._id);
       if (index !== -1) {
         this.posts[index] = updatedPost;
       }
     } else {
       console.error('Expected this.posts to be an array, but it is:', this.posts);
     }

     // Emit the event to notify other components
     this.postUpdated.emit(updatedPost);

     this.isUpdating = false; // Re-enable the update button
     this.closeModal(); // Close the modal after updating the post
   }, error => {
     console.error('Update failed:', error);
     // Handle the error, e.g., show a message to the user
     this.isUpdating = false; // Re-enable the update button
     this.closeModal(); // Close the modal even if the update fails
   });
}
}