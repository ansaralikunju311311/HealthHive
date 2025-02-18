import { useNavigate } from 'react-router-dom';

const Homebutton = () => {
    const navigate = useNavigate();
    return(
        <div>
              <button
              onClick={() => navigate('/home')}
             className='text-black' >BacktoHome</button>
        </div>
    )
}
export default Homebutton;