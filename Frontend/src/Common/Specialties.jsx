const Specialties = () => {
    return (
        <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Specialties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Cardiac Science', description: 'Expert cardiac care with state-of-the-art facilities' },
              { title: 'Dental Care', description: 'Comprehensive dental services for the whole family' },
              { title: 'Primary Care', description: 'Your first point of contact for all health concerns' }
            ].map((specialty, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{specialty.title}</h3>
                <p className="text-gray-600">{specialty.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div> 

    );
} 
export default Specialties;