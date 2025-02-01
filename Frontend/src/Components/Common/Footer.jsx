import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">HealthHive</h3>
                        <p className="text-gray-400">Your trusted healthcare partner</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Services</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>Emergency Care</li>
                            <li>Dental Care</li>
                            <li>Primary Care</li>
                            <li>Specialized Treatment</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>Email: info@healthhive.com</li>
                            <li>Phone: (123) 456-7890</li>
                            <li>Address: 123 Medical Center Dr</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                            <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                            <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} HealthHive. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;