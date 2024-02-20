import { Component, Output, EventEmitter } from "@angular/core"
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';

@Component({
    selector:'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css'],
})

export class PostCreateComponent{
    enteredTitle = '';
    formerContent = '';
    @Output() postCreated = new EventEmitter<Post>();

    onAddPost(form: NgForm){
        if (form.invalid){
            return;
        }
        const post: Post = {
            title: form.value.title,
            content: form.value.content,
        };
        // this.postService.addPost(form.value.tit;this.enteredTitle, form.value.)
        //     form.resetForm();
        this.postCreated.emit(post);
    }
}