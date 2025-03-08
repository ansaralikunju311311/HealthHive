const Section = () => {
    return (
        <>
            <section className="py-8 sm:py-12 md:py-16 px-4 md:px-8 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">About Us</h2>
                    
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Our Mission</h3>
                            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                                At HealthHive, we are dedicated to providing exceptional healthcare services with a focus on patient comfort and well-being. Our team of experienced professionals strives to deliver the highest quality care using state-of-the-art technology and innovative treatments.
                            </p>
                            <p className="text-gray-600 text-sm sm:text-base">
                                More than treating diseases, we believe in creating lasting, healthy smiles that enhance your confidence and quality of life.
                            </p>
                        </div>
                        <div className="order-1 md:order-2 rounded-lg overflow-hidden shadow-lg h-[200px] sm:h-[300px] md:h-[400px]">
                            <img src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80" 
                                 alt="Modern healthcare facility" 
                                 className="w-full h-full object-cover"/>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
export default Section;