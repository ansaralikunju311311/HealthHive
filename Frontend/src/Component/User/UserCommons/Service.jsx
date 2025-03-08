import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyUserToken } from '../../../Services/userServices/userApiService';

const Service = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { user } = await verifyUserToken();
                setUserData(user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    return (
        <>
            <div className="py-8 sm:py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Services We Provide</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {[
                            { icon: "🏥", title: "24/7 Service", description: "Round-the-clock medical care" },
                            { icon: "👨‍⚕️", title: "Expert Doctors", description: "Experienced healthcare professionals" },
                            { icon: "💊", title: "Medicines", description: "Full-service pharmacy available" },
                            { icon: "🚑", title: "Emergency Care", description: "Immediate medical attention" }
                        ].map((service, index) => (
                            <div key={index} className="text-center p-4 sm:p-6">
                                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{service.icon}</div>
                                <h3 className="text-lg sm:text-xl font-semibold mb-2">{service.title}</h3>
                                <p className="text-sm sm:text-base text-gray-600">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Service