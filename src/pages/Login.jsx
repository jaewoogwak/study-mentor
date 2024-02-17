import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate();
    const { user, login, logout } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(e.target[0].value, e.target[1].value);
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);

            navigate('/');
        } catch (err) {
            setErr(true);
        }
    };

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            login(user);
            user && navigate('/');
        });
    }, []);

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>Lama Chat</span>
                <span className='title'>Login</span>
                <form onSubmit={handleSubmit}>
                    <input type='email' placeholder='email' />
                    <input type='password' placeholder='password' />
                    <button>Sign in</button>
                    {err && <span>Something went wrong</span>}
                </form>
                <p>
                    You don't have an account?{' '}
                    <Link to='/register'>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
