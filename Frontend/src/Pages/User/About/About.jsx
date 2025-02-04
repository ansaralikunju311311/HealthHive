import NavBar from "../../../Common/NavBar";
import Footer from "../../../Common/Footer";
import Section from '../../../Component/User/About/Section.jsx'
import LatestTech from '../../../Component/User/About/LatestTech.jsx'
import Upcoming from '../../../Component/User/About/Upcoming.jsx'
import Specialities from '../../../Component/User/About/Specialities.jsx'

const About = () => {
    return (
        <>
            <NavBar/>
            <Section/> 
            <Specialities/>
            <LatestTech/>
            <Upcoming/>
            <Footer/>
        </>
    );
};

export default About;