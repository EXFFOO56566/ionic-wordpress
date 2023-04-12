import { NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { Wordpress, Category, Location } from '../../providers/wordpress';
import { Config } from '../../app/config';
import { Geolocation } from 'ionic-native';
import { MapDetailPage } from './detail';
import _ from 'lodash';

@Component({
    templateUrl: 'map.html'
})
export class MapPage {

    locations: Array<Location> = [];
    category: Category;
    map: google.maps.Map;
    mode: string = 'map';
    currentPosition: { lat: number, lng: number };
    constructor(private nav: NavController, private wordpressService: Wordpress, navParams: NavParams, private config: Config) {
        this.category = navParams.get('category');
        this.currentPosition = this.config.defaultLocation;
        console.log(_);

    }
    ionViewDidEnter() {

        if (this.map == null) {
            this.map = new google.maps.Map(document.getElementById("map"), {
                zoom: 8,
                center: new google.maps.LatLng(this.currentPosition.lat, this.currentPosition.lng),
                streetViewControl: false,
                mapTypeId: google.maps.MapTypeId.TERRAIN
            });
            this.fetchLocations();
        }
    }

    onChangeMode(mode: string) {
        this.mode = mode;
    }
    onDetail(location: Location) {
        this.nav.push(MapDetailPage, {
            location
        });
    }
    fetchLocations() {

        this.wordpressService.getLocations(this.category.slug).then(locations => {

            this.locations = locations;
            this.calculateDistance();
            this.map.setCenter(this.currentPosition);
            this.drawMarkers();

            Geolocation.getCurrentPosition().then(position => {
                this.currentPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
                this.calculateDistance();
                this.map.setCenter(this.currentPosition);
            }, error => {
                console.log("Error Fetching Position");
            })
        });
    }

    initMap() {

        this.map.setCenter(this.currentPosition);
        this.drawMarkers();

    }
    calculateDistance() {
        this.locations.forEach(location => {
            location.distance = this.getDistanceFromLocation(this.currentPosition, { lat: location.location.lat, lng: location.location.long });

        })
        this.locations = _.sortBy(this.locations, ['distance'], ['desc']);
    }
    drawMarkers() {

        let popups = [];
        this.locations.forEach(location => {

            let content = "<strong>" + location.title.rendered + "</strong><br>";

            if (location.location.address != "") {
                content += location.location.address + "<br>";
            }
            if (location.excerpt.rendered != "") {
                content += location.excerpt.rendered + "<br>";
            }
            content += `<button class="disable-hover button button-md button-outline button-outline-md button-full button-full-md button-outline-md-primary">
                            <span class="button-inner">
                                <div>Details ansehen</div>
                            </span>
                            <ion-button-effect></ion-button-effect>
                        </button>`;

            var innerPopup = document.createElement("div");
            innerPopup.innerHTML = content

            google.maps.event.addDomListener(innerPopup, 'click', () => {
                this.onDetail(location);
            });

            let popup : any = new google.maps.InfoWindow({
                content: innerPopup
            });


            popups.push(popup);

            let position = new google.maps.LatLng(location.location.lat, location.location.long);
            let marker = new google.maps.Marker({
                position,
                map: this.map,
                title: location.title.rendered,
                animation: google.maps.Animation.DROP,
                icon: 'assets/img/marker.png'
            });
            marker.addListener('click', () => {
                if (popup.opened) {
                    this.onDetail(location);
                } else {
                    for (let i = 0; i < popups.length; i++) {
                        popups[i].close();
                        popups[i].opened = false;
                    }
                    popup.open(this.map, marker);
                    popup.opened = true;
                }

            });
            google.maps.event.addListener(popup, 'closeclick', () => {
                popup.opened = false;
            });

        });

    }
    getDistanceFromLocation(location, destination) {
        var R = 6371;
        var dLat = this.deg2rad(destination.lat - location.lat);
        var dLon = this.deg2rad(destination.lng - location.lng);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(location.lat)) * Math.cos(this.deg2rad(destination.lat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180)
    }



}
