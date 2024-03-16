import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { Subscription } from "rxjs";
import { PostService } from "../posts.service";

@Component({
    selector: 'app-post-list',
    templateUrl: "./post-list.component.html",
    styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
    @Input() posts: Post[] = [];
    private postsSub!: Subscription;

    constructor(public postService: PostService) {}

    ngOnInit(): void {
        this.postService.getPosts();
        this.postsSub = this.postService
        .getPostUpdateListener()
        .subscribe((posts: Post[]) => {
            this.posts = posts;
        });
    }

    ngOnDestroy(): void {
        this.postsSub.unsubscribe();
    }

    deletePost(_id: string) {
        this.postService.deletePost(_id).subscribe({
           next: (response) => {
             console.log('Post deleted successfully:', response.message);
             // Remove the post from the local array
             this.posts = this.posts.filter(post => post._id !== _id);
           },
           error: (error) => {
             console.error('Error deleting post:', error);
           }
        });
       }
}