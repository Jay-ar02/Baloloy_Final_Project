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
        const id = this.generateOrRetrieveId(); // Corrected to call the instance method
        const post: Post = {
            id: id,
            title: form.value.title,
            content: form.value.content,
        };
        this.postService.addPost(post.id, post.title, post.content).subscribe(response => {
            console.log('Post added successfully:', response);
            form.resetForm();
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