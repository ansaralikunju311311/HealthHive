import { useEffect, useState } from "react";
import { getAboutDoctors } from "../../../Services/userServices/userApiService";

const Specialities = () => {
    const [doctorsData, setDoctorsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await getAboutDoctors();
                setDoctorsData(response.doctors);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchDoctors();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <section className="bg-gray-50 py-8 sm:py-12 md:py-16 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold mb-8 md:mb-12 text-center">Meet Our Specialists</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {doctorsData && doctorsData.map((doctor) => (
                        <div key={doctor._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <div className="aspect-w-1 aspect-h-1 w-full">
                                <img 
                                    src={doctor.profileImage} 
                                    alt={doctor.name} 
                                    className="w-full h-48 sm:h-56 md:h-64 object-cover"
                                />
                            </div>
                            <div className="p-3 sm:p-4">
                                <h3 className="text-lg font-semibold mb-2">{doctor.name}</h3>
                                <p className="text-blue-600 text-sm mb-3">{doctor.specialization?.Departmentname}</p>
                                <p className="text-gray-500 text-sm">
                                    {doctor.description || 'Experienced healthcare professional dedicated to patient care.'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}; 

export default Specialities;