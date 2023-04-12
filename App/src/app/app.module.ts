import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Config } from './config';

import { WordpressContent } from '../components/wordpress-content';
import { Wordpress } from '../providers/wordpress';

import {
    MapCategoriesPage, AboutPage, TutorialPage, MapDetailPage,
    MapPage, PostsListPage, PostDetailPage, PageDetail, StaticPage
} from '../pages';

@NgModule({
    declarations: [
        MyApp,
        MapCategoriesPage,
        MapDetailPage,
        MapPage,
        PostsListPage,
        PostDetailPage,
        AboutPage,
        PageDetail,
        TutorialPage,
        StaticPage,
        WordpressContent
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        MapCategoriesPage,
        MapDetailPage,
        MapPage,
        PostsListPage,
        PostDetailPage,
        AboutPage,
        PageDetail,
        TutorialPage,
        StaticPage,
    ],
    providers: [Config, Wordpress]
})
export class AppModule { }
