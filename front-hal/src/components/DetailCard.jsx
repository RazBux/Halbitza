import React, { useState, useEffect } from 'react';
import "../App.css"

// const DetailCard = ({show, person, onClose,  onPersonUpdated }) => {
const DetailCard = ({ person, onClose }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedPerson, setEditedPerson] = useState({});

    useEffect(() => {
        setEditedPerson(person);
    }, [person]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditedPerson(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setEditMode(false);
    };

    const [selectedEmoji, setSelectedEmoji] = useState('');
    const emojis = ['😀', '😂', '🤣', '😍', '😒', '😎', '😢', '😡']; 

    return (

        // <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-5">
            <div className="modal-backdrop">
                <div className="modal-content">
            <h3 className="text-xl dark:text-white font-semibold mb-4">Person Details</h3>
            <button onClick={onClose} className="modal-close-button">X</button>
            {editMode ? (
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    {Object.keys(editedPerson).map(key => (
                        <div key={key} className="flex flex-col">
                            <label className="text-gray-700 dark:text-gray-400 text-sm font-semibold mb-2" htmlFor={key}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}:
                            </label>
                            <input
                                id={key}
                                type="text"
                                name={key}
                                value={editedPerson[key]}
                                onChange={handleChange}
                                className="input text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    ))}
                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            onClick={handleSave}
                            className="btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition-colors duration-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-2">
                    {Object.keys(person || {}).map(key => (
                        <p key={key} className="text-gray-800 dark:text-gray-300">
                            <span className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {person[key]}
                        </p>
                    ))}
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={() => setEditMode(true)}
                            className="btn bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition-colors duration-200"
                        >
                            Edit
                        </button>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default DetailCard;