import { Component, EventEmitter, Output } from "@angular/core";
import { Post } from "../post.model";
import { NgForm } from "@angular/forms";
import { PostService } from "../posts.service";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
    enteredTitle = '';
    enteredContent = '';
    @Output() postCreated = new EventEmitter<Post>();

    constructor(private postService: PostService) {}

    onAddPost(form: NgForm) {
        if (form.invalid) {
            return;
        }
        const id = this.generateOrRetrieveId(); // Assuming this generates a unique ID for the new post
        const post: Post = {
            _id: id,
            title: form.value.title,
            content: form.value.content,
        };
        this.postService.addPost(post._id, post.title, post.content).subscribe(response => {
            console.log('Post added successfully:', response);
            form.resetForm();
            // Refresh the list of posts after successfully adding a new post
            this.postService.getPosts();
        }, error => {
            console.error('Error adding post:', error);
        });
        form.resetForm();
    }

    // Implement this method based on your application's logic
    generateOrRetrieveId(): string {
        // Example: Generate a simple ID based on the current timestamp
        return Date.now().toString();
    }
}