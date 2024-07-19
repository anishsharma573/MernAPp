import React, { useState } from 'react';
import instance from '../Axios/axios';

const Logout = () => {
    const [message, setMessage] = useState('');

    const handleLogout = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setMessage('You are not logged in.');
            return;
        }

        try {
            await instance.get('/logout', { headers: { Authorization: `Bearer ${token}` } });
            localStorage.removeItem('authToken');
            setMessage('Logout successful.');
        } catch (error) {
            setMessage('Logout failed. Please try again.');
            console.error('Logout error:', error);
        }
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Logout;
