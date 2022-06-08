import React from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import {useLocation, Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import '../styles/Map.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import truckGreenMarker from '../assets/truck_green_marker.svg';
import truckRedMarker from '../assets/truck_red_marker.svg';
import vanGreenMarker from '../assets/van_green_marker.svg';
import vanRedMarker from '../assets/van_red_marker.svg';
import personGreenMarker from '../assets/person_green_marker.svg';
import personRedMarker from '../assets/person_red_marker.svg';
import filterLogo from '../assets/filterlogo.svg';
import searchIcon from '../assets/search_icon.png';
import addIcon from '../assets/add_image.png';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

import SearchbarDropdown from './SearchbarDropdown';
import Dropdown from './Dropdown';


mapboxgl.accessToken = 'pk.eyJ1Ijoic2h1YmhhbXJhamFuc2luZ2giLCJhIjoiY2wyaHp0d3hjMGJjeDNqcTZiOTc3djM1OCJ9.ovqtJ8iBz7d8O6IO57KJmg';

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Map extends React.Component {
    baseUrl = "http://localhost:8080";
    constructor(props) {
        super(props);
        this.state = {
            map: "",
            lng: 73.2929,
            lat: 19.0618,
            zoom: 8.95, options: [], defaultOptions: [], filterType: "NO FILTER",
            assetCount: 100,
            markers: [],
            routes: [],
            searchOptions: ["NO FILTER", "BY ID", "BY TYPE", "BY DATE", "BY JOB TYPE"],
            searchText: "",
            endDate: "",
            regularcall: null,
            timeInterval: 30000,
            addAssetClick: false,
            jwt: ""
        };

        this.baseUrl = "https://asset-tracking-portal.herokuapp.com";
        this.mapContainer = React.createRef();
        this.onInputChange = this.onInputChange.bind(this);
        this.onEndDateChanged = this.onEndDateChanged.bind(this);
        this.dropdownHandleChange = this.dropdownHandleChange.bind(this);
        this.showRoute = this.showRoute.bind(this);
        this.markerClicked = this.markerClicked.bind(this);
        this.addMarker = this.addMarker.bind(this);
        this.showLiveMarkers = this.showLiveMarkers.bind(this);
        this.searchClicked = this.searchClicked.bind(this);
        this.onSegment = this.onSegment.bind(this);
        this.orientation = this.orientation.bind(this);
        this.doIntersect = this.doIntersect.bind(this);
        this.isInside = this.isInside.bind(this);
        this.addAssetClicked = this.addAssetClicked.bind(this);
    }

    componentDidMount() {
        const { lng, lat, zoom } = this.state;
        const cookies = new Cookies();
        const jwtToken = cookies.get('jwt');
        this.setState({ jwt: jwtToken });
        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
        this.setState({ map: map });

        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            });
        });

        this.showLiveMarkers(map, this.baseUrl + "/liveAssetsLocation/" + this.state.assetCount)
        clearInterval(this.state.regularcall);
        this.setState({
            regularcall: setInterval(() =>
                this.showLiveMarkers(map, this.baseUrl + "/liveAssetsLocation/" + this.state.assetCount)
                , this.state.timeInterval)
        });
    }

    showLiveMarkers(map, url) {

        const routesList = this.state.routes;
        const dataCount = routesList.length;
        for (let i = 0; i < dataCount; i++) {
            map.removeLayer(routesList[i]);
            map.removeSource(routesList[i]);

        }
        this.setState({ routes: [] });
        var currentMarkers = this.state.markers;
        if (currentMarkers !== null) {
            for (var i = currentMarkers.length - 1; i >= 0; i--) {
                currentMarkers[i].remove();

            }
        }
        try {
            map.removeLayer("geofencinglayer");
            map.removeSource("geofencingsource");
        } catch (err) { }
        this.setState({ markers: [] });
        const cookies = new Cookies();
        const jwtToken = 'Bearer ' + cookies.get('jwt');
        const headers = {
            "Content-Type": "application/json",
            "Authorization": jwtToken,
        };

        if (!this.state.assetCount) {
            this.setState({ assetCount: 0 });
        }
        axios.get(url,
            { headers }).then(res => {

                const dataCount = res.data.length;
                for (let i = 0; i < dataCount; i++) {
                    if (res.data[i].assetId.purpose === "PC&D") {
                        const orders = res.data[i].assetId.orderCompleted;
                        var activeOrderId = "NoOrder";
                        var remainingOrder = false;
                        for (const [key, value] of Object.entries(orders)) {
                            if (value === 2) {
                                activeOrderId = key;
                                break;
                            } else if (value === 0) {
                                remainingOrder = true;
                            }
                        }

                        if (activeOrderId !== "NoOrder") {
                            const getOrderUrl = this.baseUrl + "/getOrder/" + activeOrderId;
                            axios.get(getOrderUrl, {
                                headers
                            }).then(response => {
                                const data = { "assetId": res.data[i].assetId.assetId, "purpose": response.data.type, "time": res.data[i].time };
                                const coordinates = [res.data[i].locationId.longitude, res.data[i].locationId.latitude];
                                this.addMarker(map, coordinates, res.data[i].assetId.type, "live", data);
                            }).catch(error => { console.log(error) });
                        } else if (remainingOrder) {
                            const data = { "assetId": res.data[i].assetId.assetId, "purpose": "Unknown", "time": res.data[i].time };
                            const coordinates = [res.data[i].locationId.longitude, res.data[i].locationId.latitude];
                            this.addMarker(map, coordinates, res.data[i].assetId.type, "live", data);
                        } else {
                            const data = { "assetId": res.data[i].assetId.assetId, "purpose": "Returning", "time": res.data[i].time };
                            const coordinates = [res.data[i].locationId.longitude, res.data[i].locationId.latitude];
                            this.addMarker(map, coordinates, res.data[i].assetId.type, "live", data);
                        }
                    } else {
                        const data = { "assetId": res.data[i].assetId.assetId, "purpose": res.data[i].assetId.miscellaneous, "time": res.data[i].time };
                        const coordinates = [res.data[i].locationId.longitude, res.data[i].locationId.latitude];
                        this.addMarker(map, coordinates, res.data[i].assetId.type, "live", data);
                    }

                    if (res.data[i].assetId.geofencing === true) {
                        const getOrderUrl = this.baseUrl + "/getGeofence/" + res.data[i].assetId.assetId;
                        axios.get(getOrderUrl, {
                            headers
                        }).then(respo => {

                            let polygon1 = [new Point(respo.data.point1.latitude, respo.data.point1.longitude),
                            new Point(respo.data.point2.latitude, respo.data.point2.longitude),
                            new Point(respo.data.point3.latitude, respo.data.point3.longitude),
                            new Point(respo.data.point4.latitude, respo.data.point4.longitude)];

                            let n = polygon1.length;
                            let p = new Point(res.data[i].locationId.latitude, res.data[i].locationId.longitude);



                            if (!this.isInside(polygon1, n, p)) {

                                toast.error(res.data[i].assetId.assetId + " have Moved Out of Geofence", { autoClose: 3000 })
                            }
                        }).catch(error => console.log(error.message));
                    }

                }


            }).catch(error => {
                toast.error(error.message, { autoClose: 3000 })

            });

    }

    addMarker(map, coordinates, type, subtype, data) {
        var currmarkers = this.state.markers;
        const el = document.createElement('div');
        var popup;
        el.className = 'marker';
        if (type === "Truck") {
            if (subtype === "live") {
                el.style.backgroundImage = "url('" + truckGreenMarker + "')";
            } else {
                el.style.backgroundImage = "url('" + truckRedMarker + "')";
            }
            popup = new mapboxgl.Popup(
                {
                    offset: [0, 0], closeButton: false,
                    closeOnClick: false
                }
            ).setHTML(
                'Asset Type:Truck<br/>Asset Id:<br/>' + data.assetId + '<br/> Purpose : ' + data.purpose + '<br/>location:' + coordinates + '<br/> timestamp:<br/>' + data.time + '<br/> <a href="/AssetDetails/?assetId=' + data.assetId + '" style=border:none>Details</a>'

            );
        } else if (type === "Van") {
            if (subtype === "live") {
                el.style.backgroundImage = "url('" + vanGreenMarker + "')";
            } else {
                el.style.backgroundImage = "url('" + vanRedMarker + "')";
            }
            popup = new mapboxgl.Popup(
                {
                    offset: [0, 0], closeButton: false,
                    closeOnClick: false
                }
            ).setHTML(
                'Asset Type:Van<br/>Asset Id:<br/>' + data.assetId + '<br/> Purpose : ' + data.purpose + '<br/>location:' + coordinates + '<br/> timestamp:<br/>' + data.time + '<br/> <a href="/AssetDetails/?assetId=' + data.assetId + '" style=border:none>Details</a>'

            );
        } else {



            if (subtype === "live") {
                el.style.backgroundImage = "url('" + personGreenMarker + "')";
            } else {
                el.style.backgroundImage = "url('" + personRedMarker + "')";
            }
            popup = new mapboxgl.Popup(
                {
                    offset: [0, 0], closeButton: false,
                    closeOnClick: false
                }
            ).setHTML(
                'Asset Type:Salesperson<br/>Asset Id:<br/>' + data.assetId + '<br/> Purpose : ' + data.purpose + '<br/>location:' + coordinates + '<br/> timestamp:<br/>' + data.time + '<br/> <a href="/AssetDetails/?assetId=' + data.assetId + '" style=border:none>Details</a>'

            );
        }
        let marker = new mapboxgl.Marker(el).setLngLat(coordinates);
        const element = marker.getElement();
        element.addEventListener('mouseenter', () => marker.togglePopup());
        element.addEventListener('mouseleave', () => marker.togglePopup());
        element.addEventListener('contextmenu', () => marker.togglePopup());

        element.addEventListener('click', () => {
            clearInterval(this.state.regularcall);
            this.markerClicked(map, data.assetId)
            this.setState({
                regularcall: setInterval(() =>
                    this.markerClicked(map, data.assetId)
                    , this.state.timeInterval)
            });
        });
        marker.setPopup(popup);
        marker.addTo(map);
        currmarkers.push(marker);
        this.setState({ markers: currmarkers });

    }

    markerClicked(map, assetId) {
        const cookies = new Cookies();
        var currentMarkers = this.state.markers;
        if (currentMarkers !== null) {
            for (var i = currentMarkers.length - 1; i >= 0; i--) {
                currentMarkers[i].remove();
            }
        }
        this.setState({ markers: [] });
        const jwtToken = 'Bearer ' + cookies.get('jwt');
        const headers = {
            "Content-Type": "application/json",
            "Authorization": jwtToken,
        };
        var assetLocationsUrl = this.baseUrl + "/getassetslocatios/" + assetId;

        axios.get(assetLocationsUrl,
            { headers }).then(res => {
                const dataCount = res.data.length;

                if (dataCount > 0) {
                    if (res.data[0].assetId.geofencing) {

                        const getFenceUrl = this.baseUrl + "/getGeofence/" + res.data[0].assetId.assetId;

                        axios.get(getFenceUrl, {
                            headers
                        }).then(respo => {


                            map.addSource("geofencingsource", {
                                "type": "geojson",
                                "data": {
                                    "type": "Feature",
                                    "geometry": {
                                        "type": "Polygon",
                                        "coordinates": [
                                            [
                                                [respo.data.point1.longitude, respo.data.point1.latitude],
                                                [respo.data.point2.longitude, respo.data.point2.latitude],
                                                [respo.data.point3.longitude, respo.data.point3.latitude],
                                                [respo.data.point4.longitude, respo.data.point4.latitude]
                                            ]
                                        ]
                                    }
                                }
                            });
                            map.addLayer({
                                "id": "geofencinglayer",
                                "type": "fill",
                                "source": "geofencingsource",
                                "layout": {},
                                "paint": {
                                    // FABD38

                                    "fill-color": "#F02828",
                                    "fill-opacity": 0.4
                                }
                            });


                        }).catch(error => console.log(error.message));
                    }
                    var start = [res.data[dataCount - 1].locationId.longitude, res.data[dataCount - 1].locationId.latitude];
                    var end = [];
                    for (let i = dataCount - 2; i >= 0; i--) {
                        end = [res.data[i].locationId.longitude, res.data[i].locationId.latitude];
                        this.showRoute(start, end, map, res.data[i].id);
                        start = end;

                    }

                    if (res.data[0].assetId.purpose === "PC&D") {

                        const orders = res.data[0].assetId.orderCompleted;
                        var completedOrders = [];
                        var activeOrderId = "NoOrder";
                        for (const [key, value] of Object.entries(orders)) {
                            if (value === 1) {
                                completedOrders.push(key);
                            } else if (value === 2) {
                                activeOrderId = key;
                            }
                        }

                        for (let k = 0; k < completedOrders.length; k++) {
                            const getOrderUrl = this.baseUrl + "/getOrder/" + completedOrders[k];
                            axios.get(getOrderUrl, {
                                headers
                            }).then(response => {

                                const data = { "assetId": res.data[0].assetId.assetId, "purpose": response.data.type, "time": response.data.completedTime };
                                const coordinates = [response.data.locationId.longitude, response.data.locationId.latitude];
                                this.addMarker(map, coordinates, res.data[0].assetId.type, "Past", data);
                            }).catch(error => { console.log(error) });
                        }

                        var liveAssetLocationUrl = this.baseUrl + "/getAssetLiveLocation/" + res.data[0].assetId.assetId;
                        axios.get(liveAssetLocationUrl, { headers }).then(respo => {

                            const orders = respo.data[0].assetId.orderCompleted;
                            var activeOrderId = "NoOrder";
                            var remainingOrder = false;
                            for (const [key, value] of Object.entries(orders)) {
                                if (value === 2) {
                                    activeOrderId = key;
                                    break;
                                } else if (value === 0) {
                                    remainingOrder = true;
                                }
                            }
                            if (activeOrderId !== "NoOrder") {
                                const getOrderUrl = this.baseUrl + "/getOrder/" + activeOrderId;
                                axios.get(getOrderUrl, {
                                    headers
                                }).then(response => {
                                    const data = { "assetId": respo.data[0].assetId.assetId, "purpose": response.data.type, "time": respo.data[0].time };
                                    const coordinates = [respo.data[0].locationId.longitude, respo.data[0].locationId.latitude];
                                    this.addMarker(map, coordinates, respo.data[0].assetId.type, "live", data);
                                }).catch(error => { console.log(error) });
                            } else if (remainingOrder) {
                                const data = { "assetId": respo.data[0].assetId.assetId, "purpose": "Unknown", "time": respo.data[0].time };
                                const coordinates = [respo.data[0].locationId.longitude, respo.data[0].locationId.latitude];
                                this.addMarker(map, coordinates, res.data[0].assetId.type, "live", data);
                            } else {
                                const data = { "assetId": respo.data[0].assetId.assetId, "purpose": "Returning", "time": respo.data[0].time };
                                const coordinates = [respo.data[0].locationId.longitude, respo.data[0].locationId.latitude];
                                this.addMarker(map, coordinates, respo.data[0].assetId.type, "live", data);
                            }
                        })
                            .catch(error => { console.log(error); });

                    } else {
                        var liveAssetLocationUrl = this.baseUrl + "/getAssetLiveLocation/" + res.data[0].assetId.assetId;
                        axios.get(liveAssetLocationUrl, { headers }).then(respo => {

                            const data = { "assetId": respo.data[0].assetId.assetId, "purpose": res.data[0].assetId.miscellaneous, "time": respo.data[0].time };
                            const coordinates = [respo.data[0].locationId.longitude, respo.data[0].locationId.latitude];

                            this.addMarker(map, coordinates, respo.data[0].assetId.type, "live", data);

                        }).catch(error => { console.log(error) })


                    }





                }


            }).catch(error => { })





    }



    showRoute(start, end, map, key) {
        var apiRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=pk.eyJ1Ijoic2h1YmhhbXJhamFuc2luZ2giLCJhIjoiY2wyaHp0d3hjMGJjeDNqcTZiOTc3djM1OCJ9.ovqtJ8iBz7d8O6IO57KJmg';


        axios.get(apiRequest)
            .then(res => {
                const route = res.data.routes[0].geometry.coordinates;
                const gejson = {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: route
                    }
                };
                if (map.getSource(key)) {
                    map.getSource(key).setData(gejson);
                }
                else {
                    var routesList = this.state.routes;
                    routesList.push(key);
                    this.setState({ routes: routesList });
                    map.addLayer({
                        id: key,
                        type: 'line',
                        source: {
                            type: 'geojson',
                            data: gejson
                        },
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': '#007500',
                            'line-width': 5,
                            'line-opacity': 0.75
                        }
                    });
                }
            });


    }

    searchClicked() {


        if (this.state.filterType === "NO FILTER") {

        } else if (this.state.filterType === "BY ID") {
            this.markerClicked(this.state.map, this.state.searchText);

            clearInterval(this.state.regularcall);
            this.setState({
                regularcall: setInterval(() =>
                    this.markerClicked(this.state.map, this.state.searchText)
                    , this.state.timeInterval)
            });

        } else if (this.state.filterType === "BY TYPE") {
            this.showLiveMarkers(this.state.map, this.baseUrl + "/getassetslocatiosbytype/" + this.state.searchText + "/" + this.state.assetCount);

            clearInterval(this.state.regularcall);
            this.setState({
                regularcall: setInterval(() =>
                    this.showLiveMarkers(this.state.map, this.baseUrl + "/getassetslocatiosbytype/" + this.state.searchText + "/" + this.state.assetCount)
                    , this.state.timeInterval)
            });

        } else if (this.state.filterType === "BY DATE") {
            this.showLiveMarkers(this.state.map, this.baseUrl + "/getassetslocatiosbydate/" + this.state.searchText + "/" + this.state.endDate + "/" + this.state.assetCount);
            clearInterval(this.state.regularcall);
            this.setState({
                regularcall: setInterval(() =>
                    this.showLiveMarkers(this.state.map, this.baseUrl + "/getassetslocatiosbydate/" + this.state.searchText + "/" + this.state.assetCount), this.state.timeInterval)
            });

        } else if (this.state.filterType === "BY JOB TYPE") {
            this.showLiveMarkers(this.state.map, this.baseUrl + "/getassetslocatiosbypurpose/" + this.state.searchText + "/" + this.state.assetCount);

            clearInterval(this.state.regularcall);
            this.setState({
                regularcall: setInterval(() =>
                    this.showLiveMarkers(this.state.map, this.baseUrl + "/getassetslocatiosbypurpose/" + this.state.searchText + "/" + this.state.assetCount)
                    , this.state.timeInterval)
            });

        }
    }



    onInputChange(event) {
        this.setState({
            options: this.state.defaultOptions.filter((option) => option.includes(event.target.value)),
            searchText: event.target.value
        });



    }
    onEndDateChanged(event) {

        this.setState({ endDate: event.target.value });
    }

    onAssetCountChange(e) {
        this.setState({ assetCount: e.target.value })
    }

    dropdownHandleChange(event) {
        document.getElementById("search-bar").disabled = false;
        document.getElementById("searchBarDropdown").style.display = "";
        document.getElementById("DatePicker").style.display = "none";
        document.getElementById("EndDatePicker").style.display = "none";
        const cookies = new Cookies();
        const jwtToken = 'Bearer ' + cookies.get('jwt');
        const headers = {
            "Content-Type": "application/json",
            "Authorization": jwtToken,
        };

        var assetFilterUrl;
        if (event.target.value === "NO FILTER") {
            document.getElementById("search-bar").disabled = true;
            this.state.searchText = "";
        } else if (event.target.value === "BY ID") {

            assetFilterUrl = this.baseUrl + "/getAssetIDList";

            axios.get(assetFilterUrl,
                { headers }).then(res => {
                    this.setState({ defaultOptions: res.data });
                }).catch(error => {
                    toast.error(error.message, { autoClose: 3000 })


                });


        } else if (event.target.value === "BY TYPE") {
            this.setState({ defaultOptions: ["Truck", "Van", "Salesperson"] });

        } else if (event.target.value === "BY DATE") {
            document.getElementById("DatePicker").style.display = "";
            document.getElementById("EndDatePicker").style.display = "";
            document.getElementById("searchBarDropdown").style.display = "none";

        } else if (event.target.value === "BY JOB TYPE") {
            this.setState({ defaultOptions: ["Pickup", "Delivery", "miscellaneous"] });
        }


        this.setState({ filterType: event.target.value })
    }


    addAssetClicked() {
        this.setState({ addAssetClick: true })

    }









    onSegment(p, q, r) {
        if (q.x <= Math.max(p.x, r.x) &&
            q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) &&
            q.y >= Math.min(p.y, r.y)) {
            return true;
        }
        return false;
    }


    orientation(p, q, r) {
        let val = (q.y - p.y) * (r.x - q.x)
            - (q.x - p.x) * (r.y - q.y);

        if (val == 0) {
            return 0;
        }
        return (val > 0) ? 1 : 2;
    }


    doIntersect(p1, q1, p2, q2) {

        let o1 = this.orientation(p1, q1, p2);
        let o2 = this.orientation(p1, q1, q2);
        let o3 = this.orientation(p2, q2, p1);
        let o4 = this.orientation(p2, q2, q1);


        if (o1 != o2 && o3 != o4) {
            return true;
        }


        if (o1 == 0 && this.onSegment(p1, p2, q1)) {
            return true;
        }


        if (o2 == 0 && this.onSegment(p1, q2, q1)) {
            return true;
        }


        if (o3 == 0 && this.onSegment(p2, p1, q2)) {
            return true;
        }


        if (o4 == 0 && this.onSegment(p2, q1, q2)) {
            return true;
        }


        return false;
    }


    isInside(polygon, n, p) {

        if (n < 3) {
            return false;
        }


        let extreme = new Point(10000, p.y);

        let count = 0, i = 0;
        do {
            let next = (i + 1) % n;

            if (this.doIntersect(polygon[i], polygon[next], p, extreme)) {

                if (this.orientation(polygon[i], p, polygon[next]) == 0) {
                    return this.onSegment(polygon[i], p,
                        polygon[next]);
                }

                count++;
            }
            i = next;
        } while (i != 0);


        return (count % 2 === 1);
    }


















    render() {
        const { lng, lat, zoom } = this.state;


        return (
            <>
                <ChecLogin />
                <div className="map-countainer-outer">
                    {/* <div className="sidebar">
                    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div> */}
                    <div ref={this.mapContainer} className="map-container" />
                </div>


                <div className='searchBar'>
                    <SearchbarDropdown options={this.state.options} onInputChange={this.onInputChange} />
                    <input type="date" id="DatePicker" onChange={(value) => { this.onInputChange(value); }}
                        style={{
                            width: "24%",
                            display: "none",
                            borderLeft: '2px solid #167D42',
                            borderTop: '2px solid #167D42',
                            borderBottom: '2px solid #167D42',
                            borderRight: "none",
                            borderRadius: "10px 0px 0px 10px",
                            boxSizing: "border-box",
                        }} />
                    <button style={{
                        height: "40px",
                        width: "40px",
                        background: "#fff",
                        background: "#FFFFFF",
                        borderLeft: "none",
                        borderRight: '2px solid #167D42',
                        borderTop: '2px solid #167D42',
                        borderBottom: '2px solid #167D42',
                    }} onClick={() => this.searchClicked()}>
                        <img src={searchIcon} alt="Search Icon" style={{
                            height: "30px",
                            width: "30px"
                        }} />
                    </button>
                    <div className='drop-down'>
                        <img src={filterLogo} alt="filterLogo" style={{
                            height: '60%',
                            width: '20%',
                            marginTop: '1%'
                        }} />
                        <Dropdown
                            label="Filter Options"
                            options={this.state.searchOptions}
                            value={this.state.filterType}
                            onChange={this.dropdownHandleChange}

                        />
                    </div>
                </div>
                <input type="date" id="EndDatePicker" onChange={(value) => { this.onEndDateChanged(value); }}
                    style={{
                        position: "absolute",
                        marginTop: "3.8%",
                        marginLeft: "30.8%",
                        width: "24%",
                        height: "5%",
                        display: "none",
                        borderLeft: '2px solid #167D42',
                        borderTop: '2px solid #167D42',
                        borderBottom: '2px solid #167D42',
                        borderRight: "2px solid #167D42",
                        borderRadius: "10px 10px 10px 10px",
                        boxSizing: "border-box",
                    }} />
                <div className='max-assets'>
                    <br />
                    Max Assets
                    <input type="number" value={this.state.assetCount} onChange={(value) => this.onAssetCountChange(value)}
                        style={{
                            width: '70%'
                        }} />
                </div>
                <button className='live-assets' onClick={() => {
                    this.showLiveMarkers(this.state.map, this.baseUrl + "/liveAssetsLocation/" + this.state.assetCount);
                    clearInterval(this.state.regularcall);
                    this.setState({
                        regularcall: setInterval(() =>
                            this.showLiveMarkers(this.state.map, this.baseUrl + "/liveAssetsLocation/" + this.state.assetCount)
                            , this.state.timeInterval)
                    });
                }}>Live Assets</button>
                <AddAssetButton onClick={() => { clearInterval(this.state.regularcall); }} />

                <ToastContainer />
            </>
        );
    }
}

export function AddAssetButton(props) {
    let navigate = useNavigate();
    const Clicked = () => {
        const cookies = new Cookies();
        navigate('/addAsset', { state: { jwtToken: cookies.get('jwt') } });
    }

    return (<>
        <a className='add-asset-button-map' onClick={Clicked}><img style={{
            width: "50px",
            height: "50px"
        }} src={addIcon} alt="Add Image" /></a>
    </>)

}

export function ChecLogin(props) {
    let location = useLocation();
    const cookies = new Cookies();
    const jwtToken = cookies.get('jwt');
    if (location !== null && location.state !== null && location.state.jwtToken === jwtToken) {
        return <></>;
    } else {
        return <Navigate to="/Login" />;
    }

}

export default Map;