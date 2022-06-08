import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';


import { Link } from 'react-router-dom';
import '../styles/AssetDetails.css'
import { ReactComponent as UpperCurl } from '../assets/login_upper_curl.svg';
import backIcon from '../assets/backButton.png';
import { useNavigate } from "react-router-dom";
import { FormControlUnstyledContext } from '@mui/base';



const AssetDetails = (props) => {


    const [AssetType, setAssetType] = useState("");
    const [DriverId, setDriverId] = useState("");
    const [HelpersId, setHelpersId] = useState([]);
    const [TruckId, setTruckId] = useState("");
    const [Truckno, setTruckno] = useState("");
    const [purpose, setPurpose] = useState("");
    const [orders, setOrders] = useState({});
    const [miscellaneous, setmiscellaneous] = useState("");
    const [ordersList, setOrdersList] = useState([]);


    const cookies = new Cookies();
    const jwtToken = 'Bearer ' + cookies.get('jwt');
    let navigate = useNavigate();

    const baseUrl = "https://asset-tracking-portal.herokuapp.com";

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const assetId = urlParams.get('assetId');

    const headers = {
        "Content-Type": "application/json",
        "Authorization": jwtToken,
    };
    var liveAssetLocationUrl = baseUrl + "/getAsset/" + assetId;

    useEffect(() => {


        const list = [];
        for (const [key, value] of Object.entries(orders)) {
            console.log()
            if (`${value}` === '2') {
                list.push(<div className='asset-details-orders' style={{ color: "#0D9D2D" }}>{key}</div>);

            } else if (`${value}` === '1') {
                list.push(<div className='asset-details-orders' style={{ color: "#CA0D0D" }}>{key}</div>);
            }
            else {
                list.push(<div className='asset-details-orders' style={{ color: "#837F7F" }}>{key}</div>);
            }

        }
        setOrdersList(list);
    }, [orders])
    useEffect(() => {

        axios.get(liveAssetLocationUrl, { headers }).then(res => {
            console.log(res);
            setAssetType(res.data.type);
            setPurpose(res.data.purpose);

            setmiscellaneous(res.data.miscellaneous);
            axios.get(baseUrl + "/getAssetByTypeId/" + res.data.type + "/" + res.data.typeId, { headers }).then(
                respo => {
                    console.log(respo);
                    if (res.data.type === 'Salesperson') {
                        setDriverId(respo.data.Id);
                    } else {
                        setDriverId(respo.data.DriverId.employeeId);
                        setHelpersId(respo.data.Helpers);
                        if (res.data.type === 'Truck') {
                            setTruckId(respo.data.Number.truckinfoId);
                        } else {
                            setTruckId(respo.data.Number.vaninfoId);
                        }
                        setTruckno(respo.data.Number.plateNumber);
                    }

                }
            ).catch(error => { });
            setOrdersList([]);
            setOrders(res.data.orderCompleted);

        }).catch(error => {
            console.log("Error Occured");
        });
    }, []);

    const BackClicked = () => {

        navigate('/Map', { state: { jwtToken: cookies.get('jwt') } });
    }

    return (<div className='asset-details-parent'>
        <UpperCurl style={{
            width: '70%',
            height: '70%',
            position: 'relative',
            float: 'right',
            marginRight: '-20%'
        }} />
        <div className="asset-details-header">
            Asset Details
        </div>
        <div className="asset-details-body">

            <div className="data-points">Asset Id<div className="asset-details-body-data">{assetId}</div></div>
            <br /><br /><br />
            <div className="data-points">Asset Type<div className="asset-details-body-data">{AssetType}</div></div>
            <br /><br /><br />


            {AssetType === 'Salesperson' ? (<>
                <div className="data-points">Salesperson Id<div className="asset-details-body-data">{DriverId}</div></div>
                <br /><br /><br /></>) : (<>
                    <div className="data-points">Driver Id<div className="asset-details-body-data">{DriverId}</div></div>
                    <br /><br /><br />
                    <div className="data-points">Helpers Id<br /><br />
                        <div className="helper-id-info">{HelpersId.map(helper => (<> <div style={{
                            marginLeft: "5%",
                            marginTop: "2%"
                        }}>{helper}</div></>))}</div>


                    </div>
                    <br /><br /><br />
                    <div className="data-points">{AssetType} Id<div className="asset-details-body-data">{TruckId}</div></div>
                    <br /><br /><br />
                    <div className="data-points">{AssetType} Number<div className="asset-details-body-data">{Truckno}</div></div>
                    <br /><br /><br />
                </>)}

            <div className="data-points">Purpose<div className="asset-details-body-data">{purpose}</div></div>
            <br /><br /><br />
            {purpose === 'PC&D' ? (<div className="data-points">Order Details<br /><br />
                <div className="asset-details-body-data  order-id-info">

                    <div className='asset-details-orders' style={{ color: "#0D9D2D" }}>
                        {ordersList}


                    </div>
                </div>
            </div>) : (<><div className="data-points">Details<div className="asset-details-body-data">{miscellaneous}</div></div></>)}


        </div>
        <a onClick={BackClicked} className='asset-details-back-map' ><img style={{
            width: "30px",
            height: "30px"
        }} src={backIcon} alt="BackButton" /></a>

    </div>);

}


export default AssetDetails;