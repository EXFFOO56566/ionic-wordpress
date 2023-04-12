import { NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { Post } from '../../providers/wordpress';

@Component({
    templateUrl: 'detail.html'
})
export class PostDetailPage {

    post: Post;

    constructor(private nav: NavController, navParams: NavParams) {
        this.post = navParams.get('post');
    }

}
