import React from 'react';
import '../styles/PageNotFound.css'

const PageNotFound = () => {
    return(<><div id="cat">

    <div id="ears">

            <div class="ear"></div>
            <div class="ear"></div>

    </div>

    <div id="head">

        <div id="eyes">

            <div class="eye">
                <div class="pupil">
                    <div class="pupil_ref"></div>
                </div>
            </div>
            <div class="eye">
                <div class="pupil">
                    <div class="pupil_ref"></div>
                </div>
            </div>

        </div>

        <div id="nose"></div>
        <div id="baffi_dx">
                <div class="baffo"></div>
                <div class="baffo"></div>
                <div class="baffo"></div>
        </div>

        <div id="baffi_sx">
                <div class="baffo"></div>
                <div class="baffo"></div>
                <div class="baffo"></div>
        </div>
       
    

    </div>
    <div className="not-found">404</div>
</div></>);
}

export default PageNotFound;

