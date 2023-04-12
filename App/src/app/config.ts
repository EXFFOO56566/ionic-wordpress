import { Injectable } from '@angular/core';

// Availables Pages
import { MapCategoriesPage, PostsListPage, PageDetail, StaticPage } from '../pages';

@Injectable()
export class Config {

    // Base URL of the Wordpress Website - This is used to detect internal links
    baseUrl: string = "wordpress.orlyapps.de"

    // REST API-Endpoint
    wordpress_endpoint: string = 'http://wordpress.orlyapps.de/wp-json/';

    // Wordpress Root Page ID
    wordpress_rootPageId: number = 2;
    // Wordpress Page ID of your About Page
    wordpress_aboutPageId: number = 4;

    // Facebook Page URL
    facebook_url = "https://www.facebook.com/orlyapps.de/";

    // Facebook Page ID
    // Use this Tool: http://findmyfbid.com/
    facebook_id = "484373321609603"

    // Website URL
    website_url = "http://www.orlyapps.de"

    // App Store ID for Rating
    store_apple_id = "123"

    // Google Play Market URL
    store_google_url = "market://details?id=de.orlyapps.ionWordpress"

    // Google Play Web URL
    store_google_web = "https://play.google.com/store/apps/details?id=de.orlyapps.ionWordpress"

    // Available Modules
    pages: Array<{ title: string, component: any, icon: string}> = [
        { title: 'Locations', component: MapCategoriesPage, icon: 'navigate' },
        { title: 'News', component: PostsListPage, icon: 'chatboxes' },
        { title: 'Pages', component: PageDetail, icon: 'information-circle'},
        { title: 'Static Page', component: StaticPage, icon: 'information-circle'}
    ]

    // Default lng/lat if no geolocation is found
    defaultLocation: { lat: number, lng: number } = { lat: 53.07, lng: 8.8017 }

    // Google Analytics Tracking
    analytics_trackingId: string = "UA-12345784-1"

    // Sharing Settings
    share_subject: string = "ionWordpress2 - Next Generation Mobile App"
    share_message: string = "Ionic 2, Angular 2 and Typescript - pure awesomeness"
    share_url: string = "http://www.orlyapps.de"

    // Cache HTTP-Calls
    cache: boolean = true
    cache_expire: number = 60 * 60 * 1000

    // Default Map Category Symbol
    map_default_category = 'assets/img/categories/default.png'

    // Category Icon per category
    map_categories: any = {
        '19' : 'assets/img/categories/19.png', // Example

    }
}
