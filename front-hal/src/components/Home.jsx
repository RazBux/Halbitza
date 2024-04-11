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
            <div className="bg-green-400 text-white p-4">Hello, Welcome to Halbitza pro!</div>
            <br />
            <div className="flex flex-col items-center">
                <label htmlFor="password" className="font-bold mb-2">Please enter password!</label>
                <input
                    id="password"
                    className="rounded-xl px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                />
                <button className="mt-3 px-2 py-3 bg-blue-300 text-white rounded-lg shadow-md hover:bg-blue-400 focus:outline-none focus:bg-blue-600" onClick={handleExploreClick}>
                    Explore
                </button>
            </div>
        </div>
    );
};

export default Home;
