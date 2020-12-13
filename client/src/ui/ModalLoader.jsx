import React from 'react';
import styled from 'styled-components';
import ClipLoader from "react-spinners/ClipLoader";

function ModalLoader({ className }) {

    return (
        <>
            <div className={className}>
                <div className='inner-modal-content'>
                    <ClipLoader color='#fff' />
                </div>
            </div>

        </>
    );
}

export default styled(ModalLoader)`
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
    width: 100%;
    height: 100%;
    z-index: 10;
    background-color: #f7f7f7b8;
  
    & .inner-modal-content {
        position: absolute;
        top: 50%;
        right: 50%;
        transform: translate(50%, -50%);
        z-index: 1001;
        border: 1px solid #ccc;
        width: 20%;
        height: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #1919198c;
        color: #fafafa;
    
    }
`;