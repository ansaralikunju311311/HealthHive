const QuickAction = () => {
    return (
        <>
             <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Book Appointment',
                description: 'Schedule a consultation with our expert doctors',
                action: () => navigate('/user/book-appointment')
              },
              { 
                title: 'View Records',
                description: 'Access your medical history and test results',
                action: () => navigate('/user/medical-records')
              },
              { 
                title: 'Update Profile',
                description: 'Keep your personal information up to date',
                action: () => navigate('/user/profile')
              }
            ].map((action, index) => (
              <div 
                key={index}
                onClick={action.action}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{action.title}</h3>
                <p className="text-gray-600">{action.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
        </>
    );
};
export default QuickAction;