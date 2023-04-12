import {NavController, NavParams, Platform} from 'ionic-angular';
import {Component} from '@angular/core';
import {Config} from '../../app/config';
import {Wordpress, Page as WordpressPage} from '../../providers/wordpress';


@Component({
    templateUrl: 'about.html'
})

export class AboutPage {

    page: WordpressPage;

    public constructor(
        private nav: NavController,
        private navParams: NavParams,
        private platform: Platform,
        private config: Config,
        private wordpressService: Wordpress
    ) {}
    ionViewDidEnter() {
        this.wordpressService.getPage(this.config.wordpress_aboutPageId).then(page => this.page = page);
    }
    onInteralLink(page: string) {


    }

}
