import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter,Route,Routes} from 'react-router-dom';

import './index.css';
import Login from './components/Login';
import Signup from './components/Signup';
import reportWebVitals from './reportWebVitals';
import Map from './components/Map';
import AssetDetails from './components/AssetDetails';
import AddAsset from './components/AddAsset';
import Cookies from 'universal-cookie';




const root = ReactDOM.createRoot(document.getElementById('root'));
const cookies = new Cookies();
const jwtToken = cookies.get('jwt');
console.log(jwtToken);
root.render(
 
<>

   <BrowserRouter>
    <Routes>
    
    <Route path="/Map" element={<Map/>} exact={true}/>
    <Route path="/" element={<Login/>} exact={true}/>
    <Route path="/Login" element={<Login/>} exact={true}/>
    <Route path="/Signup" element={<Signup />} exact={true}/>
    <Route path="/AssetDetails" element={<AssetDetails />} exact={true}/>
    <Route path="/addasset" element={<AddAsset />} exact={true}/>
    <Route  component={Signup} /> 
    </Routes>
  </BrowserRouter>
 

  </>
);

reportWebVitals();
