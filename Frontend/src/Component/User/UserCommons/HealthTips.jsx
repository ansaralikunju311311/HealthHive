const HealTips = () => {
    return (
        <div>
            <div className="bg-gray-50 py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Health Tips & Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {[
              {
                title: "COVID-19 Updates",
                description: "Stay informed about the latest COVID-19 guidelines and vaccination information."
              },
              {
                title: "Healthy Living",
                description: "Tips for maintaining a healthy lifestyle, including diet and exercise recommendations."
              },
              {
                title: "Mental Wellness",
                description: "Resources and support for maintaining good mental health and managing stress."
              }
            ].map((tip, index) => (
              <div key={index} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{tip.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{tip.description}</p>
                <button className="mt-3 sm:mt-4 text-blue-600 hover:text-blue-800 text-sm sm:text-base">Learn More →</button>
              </div>
            ))}
          </div>
        </div>
      </div>
        </div>
    );
}

export default HealTips