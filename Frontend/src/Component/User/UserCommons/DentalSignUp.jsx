import { useNavigate } from 'react-router-dom';
import Treatment from '../../../assets/treatment 1.png';
const DentalSignUp = () => {
    const navigate = useNavigate(); 
    return (
        <div>
              <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img src={Treatment} alt="Dental Care" className="w-full rounded-lg shadow-lg" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Exceptional Dental Care, on Your Terms</h2>
              <p className="text-gray-600 mb-8">
                We provide top-quality dental care with a focus on patient comfort and satisfaction. Our experienced team uses the latest technology to ensure the best possible outcomes for our patients.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Signup Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Are You a Doctor?</h2>
            <p className="text-xl text-blue-100 mb-8">Join our network of healthcare professionals and help more patients.</p>
            <button
              onClick={() => navigate('/doctor/signup')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center space-x-2"
            >
              <span>Sign Up as a Doctor</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

        </div>
    );
}
export default DentalSignUp;