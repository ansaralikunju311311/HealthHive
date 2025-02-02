import NavBar from "../../../Common/NavBar";
import Footer from "../../../Common/Footer";
import Section from '../../../Components/User/About/Section.jsx'
import LatestTech from '../../../Components/User/About/LatestTech.jsx'
import Upcoming from '../../../Components/User/About/Upcoming.jsx'
import Specialities from '../../../Components/User/About/Specialities.jsx'

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