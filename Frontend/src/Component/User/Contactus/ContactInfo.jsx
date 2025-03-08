import React from 'react'

const ContactInfo = () => {
  const contactDetails = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "EMERGENCY",
      content: ["+977 9812-255", "(237) 666-331-894"],
      bgColor: "bg-blue-100"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "LOCATION",
      content: ["Visit Some place", "In the same country"],
      bgColor: "bg-blue-500"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "EMAIL",
      content: ["admin@healthhive.com", "info@healthhive.com"],
      bgColor: "bg-blue-100"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "WORKING HOURS",
      content: ["Mon-Sat 09:00-20:00", "Sunday Emergency only"],
      bgColor: "bg-blue-500"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">GET IN TOUCH</h2>
        <h3 className="text-3xl sm:text-4xl font-bold text-blue-600">Contact</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {contactDetails.map((item, index) => (
          <div 
            key={index} 
            className={`${item.bgColor} p-4 sm:p-6 rounded-lg text-${item.bgColor === 'bg-blue-500' ? 'white' : 'gray-800'}`}
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-${item.bgColor === 'bg-blue-500' ? 'white/20' : 'white'} flex items-center justify-center mb-3 sm:mb-4`}>
              {item.icon}
            </div>
            <h3 className="text-sm sm:text-base font-semibold mb-2">{item.title}</h3>
            {item.content.map((line, i) => (
              <p key={i} className="text-xs sm:text-sm">{line}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContactInfo
