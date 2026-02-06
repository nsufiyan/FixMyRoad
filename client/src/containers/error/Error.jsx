

import { useNavigate } from 'react-router-dom';

const Errorpage = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/dashboard');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <button
                onClick={goHome}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                }}
            >
                Go to Home
            </button>
        </div>
    );
};

export default Errorpage;
