import React from 'react'
import DocPati from '../../../assets/DocPati.png'

const Services = () => {
  const services = [
    {
      title: "Free Checkup",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur felis vitae tortor augie. Velit malesuada massa in.",
      link: "#"
    },
    {
      title: "Health Packages",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur felis vitae tortor augie. Velit malesuada massa in.",
      link: "#"
    },
    {
      title: "Home Care",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur felis vitae tortor augie. Velit malesuada massa in.",
      link: "#"
    },
    {
      title: "24X7 Pharmacy",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur felis vitae tortor augie. Velit malesuada massa in.",
      link: "#"
    },
    {
      title: "Insurance Partners",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur felis vitae tortor augie. Velit malesuada massa in.",
      link: "#"
    },
    {
      title: "International Patients",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur felis vitae tortor augie. Velit malesuada massa in.",
      link: "#"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 sm:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-4 sm:p-6">
              <img src={DocPati} alt={service.title} className="w-full h-40 sm:h-48 object-cover mb-4 rounded-md" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">{service.description}</p>
              <a href={service.link} className="text-blue-500 hover:text-blue-600 inline-flex items-center">
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Services