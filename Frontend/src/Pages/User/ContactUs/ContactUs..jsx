import React from 'react';
import Navbar from "../../../Common/NavBar";
import Footer from "../../../Common/Footer";
import Banner from "../../../Component/User/Contactus/Banner";
import Services from "../../../Component/User/Contactus/Services";
import ContactInfo from "../../../Component/User/Contactus/ContactInfo";

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