const Upcoming = () => {
    return (
        <div>
             <section className="bg-gray-50 py-16 px-4 md:px-8 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Service Card 1 */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">Root Canal Treatment</h3>
                            <p className="text-gray-600">
                                Expert root canal procedures to eliminate pain and save your natural teeth using advanced techniques.
                            </p>
                        </div>

                        {/* Service Card 2 */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">Cosmetic Dentist</h3>
                            <p className="text-gray-600">
                                Transform your smile with our comprehensive cosmetic dentistry services.
                            </p>
                        </div>

                        {/* Service Card 3 */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">Dental Implants</h3>
                            <p className="text-gray-600">
                                Restore your smile with permanent, natural-looking dental implants using cutting-edge technology.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}   
export default Upcoming;