import React, { useState } from 'react'
import instance from '../../Axios/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  const url = `${window.location.protocol}//${window.location.host}`
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            setError("");
            setMessage("");
          
            console.log('====================================');
            console.log(url);
            console.log('====================================');
            const res = await instance.post("/forgotPassword", { email ,url });
            
            setMessage(res.data.message);
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Forgot Password'}
                </button>
            </form>
            {message && <p>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ForgotPassword;
