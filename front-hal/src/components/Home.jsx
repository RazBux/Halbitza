import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleExploreClick = () => {
        if (password === '1981') {
            navigate('/query-data'); // Use navigate instead of history.push
        } else {
            alert('Incorrect password');
        }
    };

    return (
        <div>
            <div className="bg-green-500 text-white p-4">Hello, Tailwind!</div>
            <br/>
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
