import {NavController} from 'ionic-angular';
import {Component} from '@angular/core';
import {Wordpress, Post} from '../../providers/wordpress';
import {PostDetailPage} from './detail';

@Component({
    templateUrl: 'list.html'
})
export class PostsListPage {

    posts: Array<Post>;

    public constructor(
        private nav: NavController,
        private wordpressService: Wordpress
    ) { }

    ionViewDidEnter() {
        this.fetch();
    }
    fetch() {
        this.wordpressService.getPosts().then(
            posts => this.posts = posts
        );
    }
    onDetail(event, post) {
        this.nav.push(PostDetailPage, {
            post: post
        });
    }
}
