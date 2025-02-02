import React from 'react';
import Navbar from "../../../Common/NavBar";
import Footer from "../../../Common/Footer";
import Banner from "../../../Components/User/ContactUs/Banner";
import Services from "../../../Components/User/ContactUs/Services";
import ContactInfo from "../../../Components/User/ContactUs/ContactInfo";

const ContactUs = () => {
    return (
        <>
            <Navbar />
            <Banner />
            <Services />
            <ContactInfo />
            <Footer />
        </>
    );
}

export default ContactUs;