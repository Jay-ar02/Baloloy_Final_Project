import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class PostService {
    private posts: Post[] = [];
    private postUpdated = new Subject<Post[]>();
    private apiUrl = 'http://localhost:3000/api/posts';

    constructor(private http: HttpClient) {}

    getAllPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(this.apiUrl);
     }

    getPosts() {
        this.http.get<{ message: string; posts: Post[] }>(this.apiUrl).subscribe(data => {
            this.posts = data.posts;
            this.postUpdated.next([...this.posts]);
        });
        return [...this.posts];
    }

    getPostUpdateListener() {
        return this.postUpdated.asObservable();
    }

    addPost(_id: string, title: string, content: string): Observable<{ message: string }> {
        const post: Post = { _id: _id, title: title, content: content };
        return this.http.post<{ message: string }>(this.apiUrl, post);
    }

    // In your PostService
deletePost(_id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${_id}`);
 }

 // Inside your PostService

 updatePost(id: string, title: string, content: string): Observable<Post> {
    const postData = { title: title, content: content };
    return this.http.put<Post>(`${this.apiUrl}/${id}`, postData).pipe(
        catchError(error => {
            console.error('Error updating post:', error);
            return throwError(() => error); // Updated to use the recommended approach
        })
    );
}

}