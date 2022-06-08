import React, { useRef, useEffect, useState } from 'react';
import '../styles/AddAsset.css'
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import backIcon from '../assets/backButton.png';

import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { ReactComponent as UpperCurl } from '../assets/login_upper_curl.svg';


const AddAsset = () => {
    const [AssetType, setAssetType] = useState("Truck");
    const [NewAssetId, setNewAssetId] = useState("");
    const [AssetPurpose, setAssetPurpose] = useState("PC&D");
    const [Details, setDetails] = useState("");
    const [EmployeeId, setEmployeeId] = useState("");
    const [HelpersId, setHelpersId] = useState("");
    const [VehicleId, setVehicleId] = useState("");
    const [enableGeofence, setenableGeofence] = useState(false);
    const [logitude1, setlogitude1] = useState("");
    const [logitude2, setlogitude2] = useState("");
    const [logitude3, setlogitude3] = useState("");
    const [logitude4, setlogitude4] = useState("");
    const [latitude1, setlatitude1] = useState("");
    const [latitude2, setlatitude2] = useState("");
    const [latitude3, setlatitude3] = useState("");
    const [latitude4, setlatitude4] = useState("");
    const cookies = new Cookies();
    let navigate = useNavigate();
    let location = useLocation();

    const AddAsset = () => {
        const baseUrl = "https://asset-tracking-portal.herokuapp.com";
        const cookies = new Cookies();

        const jwtToken = 'Bearer ' + cookies.get('jwt');
        const headers = {
            "Content-Type": "application/json",
            "Authorization": jwtToken,
        };
        const addAssetUrl = baseUrl + "/addAsset";
        let data;
        let possible = true;

        if (enableGeofence) {
            if (logitude1.length === 0 || logitude2.length === 0 || logitude3.length === 0 || logitude4.length === 0 ||
                latitude1.length === 0 || latitude2.length === 0 || latitude3.length === 0 || latitude4.length === 0) {
                possible = false;
                toast.error("Coordinates Cannot Be Empty", { autoClose: 3000 })
            }
        }
        if (EmployeeId === null || EmployeeId.length === 0) {
            possible = false;
            toast.error("Enter Employee ID", { autoClose: 3000 })
        }
        if (AssetType !== "Salesperson") {
            if (VehicleId === null || VehicleId.length === 0) {
                possible = false;
                toast.error("Enter Vehicle ID", { autoClose: 3000 })
            }
        }
        if (possible) {
            if (AssetPurpose === "PC&D") {
                let text = Details;
                const ordersId = text.split(",");
                if (AssetType === "Truck") {
                    let text2 = HelpersId;
                    const helpersId = text2.split(",");
                    if (!enableGeofence) {
                        data = {
                            "type": "Truck",
                            "driverId": EmployeeId,
                            "truckId": VehicleId,
                            "purpose": "PC&D",
                            "helpers": helpersId,
                            "ordersList": ordersId,
                            "geofencing": enableGeofence
                        };
                    } else {
                        data = {
                            "type": "Truck",
                            "driverId": EmployeeId,
                            "truckId": VehicleId,
                            "purpose": "PC&D",
                            "helpers": helpersId,
                            "ordersList": ordersId,
                            "geofencing": enableGeofence,
                            "point1": [logitude1, latitude1],
                            "point2": [logitude2, latitude2],
                            "point3": [logitude3, latitude3],
                            "point4": [logitude4, latitude4]
                        };
                    }

                } else if (AssetType === "Van") {
                    let text2 = HelpersId;
                    const helpersId = text2.split(",");
                    if (!enableGeofence) {
                        data = {
                            "type": "Van",
                            "driverId": EmployeeId,
                            "vanId": VehicleId,
                            "purpose": "PC&D",
                            "helpers": helpersId,
                            "ordersList": ordersId,
                            "geofencing": enableGeofence
                        };
                    } else {
                        data = {
                            "type": "Van",
                            "driverId": EmployeeId,
                            "vanId": VehicleId,
                            "purpose": "PC&D",
                            "helpers": helpersId,
                            "ordersList": ordersId,
                            "geofencing": enableGeofence,
                            "point1": [logitude1, latitude1],
                            "point2": [logitude2, latitude2],
                            "point3": [logitude3, latitude3],
                            "point4": [logitude4, latitude4]
                        };

                    }
                } else {
                    if (!enableGeofence) {
                        data = {
                            "type": "Salesperson",
                            "employeeId": EmployeeId,
                            "purpose": "PC&D",
                            "ordersList": ordersId,
                            "geofencing": enableGeofence
                        };
                    } else {
                        data = {
                            "type": "Salesperson",
                            "employeeId": EmployeeId,
                            "purpose": "PC&D",
                            "ordersList": ordersId,
                            "geofencing": enableGeofence,
                            "point1": [logitude1, latitude1],
                            "point2": [logitude2, latitude2],
                            "point3": [logitude3, latitude3],
                            "point4": [logitude4, latitude4]
                        };

                    }
                }

            } else {

                if (AssetType === "Truck") {
                    let text2 = HelpersId;
                    const helpersId = text2.split(",");
                    if (!enableGeofence) {
                        data = {
                            "type": "Truck",
                            "driverId": EmployeeId,
                            "truckId": VehicleId,
                            "purpose": "miscellaneous",
                            "helpers": helpersId,
                            "miscellaneous": Details,
                            "geofencing": enableGeofence
                        };
                    } else {
                        data = {
                            "type": "Truck",
                            "driverId": EmployeeId,
                            "truckId": VehicleId,
                            "purpose": "miscellaneous",
                            "helpers": helpersId,
                            "miscellaneous": Details,
                            "geofencing": enableGeofence,
                            "point1": [logitude1, latitude1],
                            "point2": [logitude2, latitude2],
                            "point3": [logitude3, latitude3],
                            "point4": [logitude4, latitude4]
                        };

                    }

                } else if (AssetType === "Van") {
                    let text2 = HelpersId;
                    const helpersId = text2.split(",");
                    if (!enableGeofence) {
                        data = {
                            "type": "Van",
                            "driverId": EmployeeId,
                            "vanId": VehicleId,
                            "purpose": "miscellaneous",
                            "helpers": helpersId,
                            "miscellaneous": Details,
                            "geofencing": enableGeofence
                        };
                    } else {
                        data = {
                            "type": "Van",
                            "driverId": EmployeeId,
                            "vanId": VehicleId,
                            "purpose": "miscellaneous",
                            "helpers": helpersId,
                            "miscellaneous": Details,
                            "geofencing": enableGeofence,
                            "point1": [logitude1, latitude1],
                            "point2": [logitude2, latitude2],
                            "point3": [logitude3, latitude3],
                            "point4": [logitude4, latitude4]
                        };
                    }
                } else {
                    if (!enableGeofence) {
                        data = {
                            "type": "Salesperson",
                            "employeeId": EmployeeId,
                            "purpose": "miscellaneous",
                            "miscellaneous": Details,
                            "geofencing": enableGeofence
                        };
                    } else {
                        data = {
                            "type": "Salesperson",
                            "employeeId": EmployeeId,
                            "purpose": "miscellaneous",
                            "miscellaneous": Details,
                            "geofencing": enableGeofence,
                            "point1": [logitude1, latitude1],
                            "point2": [logitude2, latitude2],
                            "point3": [logitude3, latitude3],
                            "point4": [logitude4, latitude4]
                        };
                    }
                }

            }


            axios.post(addAssetUrl, data, {
                headers: headers
            }).then(res =>{ toast.success(res.data, { autoClose: 3000 });
                   setNewAssetId(res.data)}).catch(error => {
                toast.error(error.response.data, { autoClose: 3000 })
            })
        }
    }
    const BackClicked = () => {

        navigate('/Map', { state: { jwtToken: cookies.get('jwt') } });
    }

    if (location !== null && location.state !== null && location.state.jwtToken === cookies.get('jwt')) {
        return (<> <UpperCurl style={{
            width: '70%',
            height: '70%',
            position: 'relative',
            float: 'right',
            marginRight: '-20%'
        }} />

            <div className="add-aaset-header">
                Add Asset
            </div>
            <ToastContainer />
            <div className="add-asset-body">

                <div className="asset-type">Asset Type:<div ><select className="asset-type-dropdown" value={AssetType}
                    onChange={
                        (event) => {
                            setAssetType(event.target.value);
                        }}>
                    <option value="Truck">Truck</option>
                    <option value="Van">Van</option>
                    <option value="Salesperson">Salesperson</option>
                </select></div></div>

                <div className="asset-purpose">Purpose:<div ><select className="asset-purpose-dropdown"
                    onChange={
                        (event) => {
                            setAssetPurpose(event.target.value);
                        }}
                    value={AssetPurpose}>
                    <option value="PC&D">PC&D</option>
                    <option value="miscellaneous">Miscellaneous</option>
                </select></div></div>

                <div className="asset-purpose-details">Purpose Details:<div >
                    {AssetPurpose === "PC&D" ? (<>  <input type="text" className="purpose-details" onChange={
                        (event) => {
                            setDetails(event.target.value);
                        }} placeholder="Enter Order Id ,comma Separated" /></>) : (<> <input type="text" className="purpose-details" onChange={
                            (event) => {
                                setDetails(event.target.value);
                            }} placeholder="Enter Text" /></>)}
                </div></div>


                <div className="asset-employee-id">{AssetType === "Truck" ? (<>Driver ID</>) : (AssetType === "Van" ? (<>Driver ID</>) : (<>Employee ID</>))}<div >
                    <input type="text" className="employee-id" onChange={event => { setEmployeeId(event.target.value) }} placeholder='Employee ID' /></div></div>
                {
                    AssetType !== "Salesperson" ?
                        (<> <div className="asset-helpers-id">Helpers Id:<div >
                            <input type="text" className="helpers-id" onChange={event => { setHelpersId(event.target.value) }} placeholder="Helpers ID's Separated by commas" /></div></div>

                            <div className="asset-vehicle-id">Truck Id:<div >
                                <input type="text" className="vehicle-id" onChange={event => { setVehicleId(event.target.value) }} placeholder="Vehicle Id" /></div></div></>) : (<></>)
                }

                <input type="checkbox" className="geofencing-checkbox" id="geofencecheck" onChange={event => { setenableGeofence(event.target.checked); }} />
                <label className="geofencing-checkbox-label"> Enable GeoFencing</label><br></br>
                     <div className="new-asset-id">{NewAssetId}</div>
                <button className='add-asset-button' onClick={() => AddAsset()}>Add Asset </button>
            </div>
            {enableGeofence ? (<div className="map-container-asset" >
                Enter coordinates<br /><br />
                Coordinates 1<br />
                <input type="text" className="longitude1 coordinates" onChange={event => { setlogitude1(event.target.value) }} placeholder='longitude' />&nbsp;&nbsp;
                <input type="text" className="latitude1 coordinates" onChange={event => { setlatitude1(event.target.value) }} placeholder='latitude' />
                <br /><br />
                Coordinates 2<br /><br />
                <input type="text" className="longitude2 coordinates" onChange={event => { setlogitude2(event.target.value) }} placeholder='longitude' />&nbsp;&nbsp;
                <input type="text" className="latitude2 coordinates" onChange={event => { setlatitude2(event.target.value) }} placeholder='latitude' />
                <br /><br />
                Coordinates 3<br /><br />
                <input type="text" className="longitude3 coordinates" onChange={event => { setlogitude3(event.target.value) }} placeholder='longitude' />&nbsp;&nbsp;
                <input type="text" className="latitude3 coordinates" onChange={event => { setlatitude3(event.target.value) }} placeholder='latitude' />
                <br /><br />
                Coordinates 4<br /><br />
                <input type="text" className="longitude4 coordinates" onChange={event => { setlogitude4(event.target.value) }} placeholder='longitude' />&nbsp;&nbsp;
                <input type="text" className="latitude4 coordinates" onChange={event => { setlatitude4(event.target.value) }} placeholder='latitude' />
            </div>) : (<></>)}
            <a onClick={BackClicked} className='add-asset-back-map' ><img style={{
                width: "30px",
                height: "30px"
            }} src={backIcon} alt="BackButton" /></a>
        </>)
    } else {
        return <Navigate to="/Login" />;
    };


}

export default AddAsset;
