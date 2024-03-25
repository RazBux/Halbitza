import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleExploreClick = () => {
        if (password === '1981') {
            navigate('/grad'); // Use navigate instead of history.push
        } else {
            alert('Incorrect password');
        }
    };

    return (
        <div>
            <div>
                <text>Welcome to Halbitza pro!</text>
            </div>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
            />
            <button onClick={handleExploreClick}>Explore</button>
        </div>
    );
};

export default Home;
