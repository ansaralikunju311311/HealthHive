const Section = () => {
    return (
        <>
            <section className="py-16 px-4 md:px-8 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">About Us</h2>
                    
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                            <p className="text-gray-600 mb-6">
                                At HealthHive, we are dedicated to providing exceptional healthcare services with a focus on patient comfort and well-being. Our team of experienced professionals strives to deliver the highest quality care using state-of-the-art technology and innovative treatments.
                            </p>
                            <p className="text-gray-600">
                                More than treating diseases, we believe in creating lasting, healthy smiles that enhance your confidence and quality of life.
                            </p>
                        </div>
                        <div className="rounded-lg overflow-hidden shadow-lg">
                            <img src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80" alt="Modern healthcare facility" className="w-full h-full object-cover"/>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
export default Section;