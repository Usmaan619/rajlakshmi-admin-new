import React from 'react'
import { NavLink } from 'react-router-dom';

// images
import ErrorImg from "../../Assets/Images/Error-img/Group 1171277276.png";
const Error = () => {
    return (
        <>
            <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
                <img src={ErrorImg} className='error-img' alt="Loading" />
                <NavLink to={"/home"}>
                    <button className="btn bg-dark text-white px-5 py-2 mt-3">
                        Go Back
                    </button>
                </NavLink>
            </div>

        </>
    );
};

export default Error