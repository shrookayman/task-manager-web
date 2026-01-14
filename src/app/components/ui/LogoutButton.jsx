import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login');               
  };

  return (
    <button
      className="btn  btn-sm"
      style={{  padding: '0.5rem 0.5rem' , color: 'white' , backgroundColor: '#0d6efd'  }}
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
