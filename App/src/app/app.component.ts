import { ViewChild, Component } from '@angular/core';
import { Platform, Nav, ActionSheetController, Events } from 'ionic-angular';
import { StatusBar, InAppBrowser, AppRate, AppAvailability, AppVersion, Splashscreen, GoogleAnalytics, SocialSharing } from 'ionic-native';
import { MapCategoriesPage, AboutPage, TutorialPage } from '../pages';
import { Config } from './config';
import { Storage } from '@ionic/storage';

declare var plugins: any;

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any;
    version: string = "web";
    pages: Array<{ title: string, component: any, icon: string }>
    storage: Storage = new Storage();

    constructor(private platform: Platform, private config: Config, private actionSheetCtrl: ActionSheetController,  public events: Events) {

        this.pages = this.config.pages;
        this.initializeApp();

    }
    ngAfterViewInit() {
        this.nav.viewDidEnter.subscribe((data) => {
            if (this.platform.is('cordova')) {

                GoogleAnalytics.startTrackerWithId(this.config.analytics_trackingId).then(() => {
                    GoogleAnalytics.trackView(data.instance.constructor.name)
                })
            }
        });

    }
    initializeApp() {
        this.platform.ready().then(() => {

            if (this.platform.is('cordova')) {

                Splashscreen.hide();
                StatusBar.styleLightContent();

                AppRate.promptForRating(false);

                AppVersion.getVersionNumber().then(version => {
                    this.version = version;
                })
            }
            this.storage.get('app.tutorial').then(tutorial => {
                if (tutorial == null) {
                    this.nav.setRoot(TutorialPage);
                } else {
                    this.nav.setRoot(MapCategoriesPage);
                }
            })

            Splashscreen.hide();

        });
    }

    openPage(page) {
        this.nav.setRoot(page.component);
    }
    onMenuOpened() {
        this.events.publish('menu:opened', '');
    }
    onOpenUrl(url: string) {
        new InAppBrowser(url, '_blank');
    }

    onRate() {
        if (this.platform.is('cordova')) {
            AppRate.promptForRating(true);
        } else {
            this.onOpenUrl(this.config.store_google_url);
        }

    }

    onWebsite() {
        this.onOpenUrl(this.config.website_url);
    }
    onAbout() {
        this.nav.setRoot(AboutPage);
    }
    onTutorial() {
        this.nav.setRoot(TutorialPage);
    }
    onShare() {

        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    icon: 'logo-facebook',
                    text: 'Facebook',
                    handler: () => {
                        SocialSharing.shareViaFacebook(null, null, this.config.share_url);
                    }
                },
                {
                    icon: 'logo-twitter',
                    text: 'Twitter',
                    handler: () => {
                        SocialSharing.shareViaTwitter(this.config.share_subject + ". " + this.config.share_message, null, this.config.share_url);
                    }
                },
                {
                    icon: 'logo-whatsapp',
                    text: 'WhatsApp',
                    handler: () => {
                        SocialSharing.shareViaWhatsApp(this.config.share_subject + ". " + this.config.share_message, null, this.config.share_url);
                    }
                },
                {
                    icon: 'mail',
                    text: 'E-Mail',
                    handler: () => {
                        SocialSharing.shareViaEmail(
                            this.config.share_message + " " + this.config.share_url,
                            this.config.share_subject, null, null, null, null
                        );
                    }
                },
                {
                    icon: 'call',
                    text: 'SMS',
                    handler: () => {
                        SocialSharing.shareViaSMS(this.config.share_subject + ". " + this.config.share_message + " " + this.config.share_url, null);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {

                    }
                }
            ]
        });

        actionSheet.present();


    }
    onFacebook() {
        if (this.platform.is('android')) {
            AppAvailability.check('com.facebook.katana').then(() => {
                window.open('fb://page/' + this.config.facebook_id, '_system', 'location=no');
            }, () => {
                this.onOpenUrl(this.config.facebook_url)
            });
        } else if (this.platform.is('ios')) {
            AppAvailability.check('fb://').then(() => {
                window.open('fb://page/' + this.config.facebook_id, '_system', 'location=no');
            }, () => {
                this.onOpenUrl(this.config.facebook_url)
            });

        } else {
            this.onOpenUrl(this.config.facebook_url)
        }
    }
}
