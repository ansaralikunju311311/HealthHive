import Latest from "../../../assets/Latest.png"
const LatestTech = () => {
    return (
        <>
             <section className="py-8 sm:py-12 md:py-16 px-4 md:px-8 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center">Latest Technology</h2>
                    
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div>
                            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">The Future Of Dentistry is Digital</h3>
                            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                                We utilize state-of-the-art digital technology to deliver precise and efficient dental care. Our advanced imaging systems and 3D scanning technology ensure accurate diagnostics and treatment planning.
                            </p>
                            <p className="text-gray-600 text-sm sm:text-base">
                                From AI-powered diagnostics to digital impressions, we're committed to providing you with the most advanced and comfortable dental care experience.
                            </p>
                        </div>
                        <div className="rounded-lg overflow-hidden shadow-lg">
                             <img src={Latest} 
                                  alt="Digital dental technology" 
                                  className="w-full h-[200px] sm:h-[250px] md:h-[300px] object-cover rounded-lg"/> 
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
export default LatestTech