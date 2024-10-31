import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { 
                email, 
                password 
            });
            localStorage.setItem('token', data.token);
            setUser(data);
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="card-header">
                    <h2>Welcome</h2>
                    <p>Enter your credentials to access your account</p>
                </div>
                
                <div className="card-content">
                    <form onSubmit={handleLogin}>
                        {error && (
                            <div className="error-alert">
                                {error}
                            </div>
                        )}
                        
                        <div className="input-group">
                            <div className="input-wrapper">
                                <User className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-wrapper">
                                <Lock className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className={`submit-button ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                </div>

                <div className="card-footer">
                    <p>
                        Don't have an account?{' '}
                        <button 
                            onClick={() => navigate('/register')} 
                            className="signup-link"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>

            <style>{`
                .login-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 96vh;
                    background-color: #f9fafb;
                    padding: 10px;
                }

                .login-card {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    width: 100%;
                    max-width: 400px;
                }

                .card-header {
                    padding: 24px 24px 0;
                    text-align: center;
                }

                .card-header h2 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 700;
                    color: #111827;
                }

                .card-header p {
                    margin: 8px 0 0;
                    color: #6b7280;
                    font-size: 14px;
                }

                .card-content {
                    padding: 24px;
                }

                .error-alert {
                    padding: 12px;
                    background-color: #fee2e2;
                    border-radius: 6px;
                    color: #dc2626;
                    font-size: 14px;
                    margin-bottom: 16px;
                }

                .input-group {
                    margin-bottom: 16px;
                }

                .input-wrapper {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 16px;
                    height: 16px;
                    color: #9ca3af;
                }

                input {
                    width: 300px;
                    padding: 8px 12px 8px 36px;
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    font-size: 14px;
                    line-height: 20px;
                    color: #374151;
                    transition: all 0.15s ease;
                }

                input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
                }

                input::placeholder {
                    color: #9ca3af;
                }

                .submit-button {
                    width: 100%;
                    padding: 8px 16px;
                    background-color: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.15s ease;
                }

                .submit-button:hover {
                    background-color: #2563eb;
                }

                .submit-button:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px #fff, 0 0 0 4px #3b82f6;
                }

                .submit-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .card-footer {
                    padding: 24px;
                    border-top: 1px solid #f3f4f6;
                    text-align: center;
                }

                .card-footer p {
                    margin: 0;
                    font-size: 14px;
                    color: #6b7280;
                }

                .signup-link {
                    background: none;
                    border: none;
                    padding: 0;
                    color: #3b82f6;
                    font-size: 14px;
                    cursor: pointer;
                }

                .signup-link:hover {
                    text-decoration: underline;
                }

                .signup-link:focus {
                    outline: none;
                    text-decoration: underline;
                }

                @media (max-width: 640px) {
                    .login-card {
                        margin: 0 16px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;


// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = ({ setUser }) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const navigator = useNavigate();

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
//             localStorage.setItem('token', data.token);
//             setUser(data); // Update global state with user data
//             console.log('Login successful! Redirecting to dashboard...');
//             navigator('/');
//         } catch (error) {
//             console.error('Login failed:', error);
//         }
//     };

//     return (
//         <form onSubmit={handleLogin}>
//             <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//             <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//             <button type="submit">Login</button>
//         </form>
//     );
// };

// export default Login;