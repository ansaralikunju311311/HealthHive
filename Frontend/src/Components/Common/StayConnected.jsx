import React from 'react';

const StayConnected = () => {
    return (
        <div className="py-16 bg-blue-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8">Stay connected with us</h2>
                    <form className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full px-4 py-2 rounded-md text-gray-900"
                        />
                        <input
                            type="text"
                            placeholder="Subject"
                            className="w-full px-4 py-2 rounded-md text-gray-900"
                        />
                        <textarea
                            placeholder="Your Message"
                            rows="4"
                            className="w-full px-4 py-2 rounded-md text-gray-900"
                        ></textarea>
                        <button 
                            type="submit" 
                            className="w-full bg-white text-blue-600 px-6 py-3 rounded-md hover:bg-gray-100"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StayConnected;