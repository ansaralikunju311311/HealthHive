import React from 'react';
import Navbar from "../../../Common/NavBar";
import Footer from "../../../Common/Footer";
import Banner from "../../../Components/User/ContactUs/Banner";
import Services from "../../../Components/User/ContactUs/Services";

const ContactUs = () => {
    return (
        <>
            <Navbar />
            <Banner />
            <Services />
            <Footer />
        </>
    );
}

export default ContactUs;