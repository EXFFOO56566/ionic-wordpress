import { NavController, NavParams, Platform } from 'ionic-angular';
import { Component } from '@angular/core';
import { Wordpress, Location } from '../../providers/wordpress';
import { Config } from '../../app/config';
import { LaunchNavigator, EmailComposer, InAppBrowser } from 'ionic-native';

declare let google: any;

@Component({
    templateUrl: 'detail.html'
})
export class MapDetailPage {

    location: Location
    map: any;

    public constructor(private nav: NavController, private wordpressService: Wordpress, navParams: NavParams, private config: Config, private platform: Platform) {
        this.location = navParams.get('location');
    }

    ionViewDidEnter() {

        this.map = new google.maps.Map(document.getElementById("detail-map"), {
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false
        });
        let position = new google.maps.LatLng(this.location.location.lat, this.location.location.long);

        this.map.setCenter(position);
        new google.maps.Marker({
            position,
            map: this.map,
            title: this.location.title.rendered,
            animation: google.maps.Animation.DROP,
            icon: 'assets/img/marker.png'
        });

    }

    onMail() {

        if (this.platform.is('cordova')) {
            EmailComposer.open({
                to: [this.location.location.email]
            });
        } else {
            window.open("mailto:" + this.location.location.email);
        }
    }
    onWebsite() {
        new InAppBrowser(this.location.location.website, '_blank');
    }
    onNavigate() {
        if (this.platform.is('cordova')) {
            LaunchNavigator.navigate([this.location.location.lat, this.location.location.long]);
        } else {
            window.open("http://maps.google.com/maps?daddr=" + this.location.location.lat + "," + this.location.location.long + "");
        }

    }
    onPhone() {
        let number = this.location.location.phone.replace(/ /g, '');
        number = number.replace("/","");
        new InAppBrowser("tel:" + number, '_system');
    }

}
