import {NavController, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import {Wordpress, Page as WordpressPage} from '../../providers/wordpress';
import {Config} from '../../app/config';

@Component({
    templateUrl: 'index.html'
})
export class PageDetail {

    pages: Array<WordpressPage> = [];
    page: WordpressPage = null;

    public constructor(private nav: NavController, private wordpressService: Wordpress, navParams: NavParams, private config: Config) {

        if(navParams.get('page')) {
            this.page = navParams.get('page');
        }
    }

    ionViewDidEnter() {
        if(this.page == null) {
            this.wordpressService.getPage(this.config.wordpress_rootPageId).then(page => this.page = page);
            this.wordpressService.getPages(this.config.wordpress_rootPageId, false).then(pages => this.pages = pages);
        } else {
            this.wordpressService.getPages(this.page.id, false).then(pages => this.pages = pages);
        }
    }

    onDetail(event, page) {
        this.nav.push(PageDetail, {
            page
        });
    }
    onInteralLink(page: string) {
        let slug = page.substring(page.lastIndexOf('/') + 1).replace('.html','');
        this.wordpressService.getPagesBySlug(slug).then(pages => {
            this.nav.push(PageDetail, {
                page: pages[0]
            });
        })

    }


}
