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
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Services We Provide</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: "🏥", title: "24/7 Service", description: "Round-the-clock medical care" },
                            { icon: "👨‍⚕️", title: "Expert Doctors", description: "Experienced healthcare professionals" },
                            { icon: "💊", title: "Medicines", description: "Full-service pharmacy available" },
                            { icon: "🚑", title: "Emergency Care", description: "Immediate medical attention" }
                        ].map((service, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl mb-4">{service.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                                <p className="text-gray-600">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Service