import React, { useState, useEffect } from 'react';
import "../App.css"

const DetailCard = ({backendURL ,person, onClose }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedPerson, setEditedPerson] = useState({});
    const [tables, setTables] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const uri = `${backendURL}/tables`; // Ensure backendURL does not end with a slash
                const response = await fetch(uri);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTables(data);
            } catch (error) {
                setError(error);
            }
        };

        fetchTables();
    }, [backendURL,]);

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

    const handleTableClick = async (tableName) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/data?tableName=${tableName}`);
            const data = await response.json();
            setEditedPerson(data);
        } catch (error) {
            console.error(`Error fetching data for table ${tableName}:`, error);
        }
    };

    return (
        <div className="modal-backdrop flex justify-center items-center">
            <div className="modal-content bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden w-96">
                <h3 className="text-xl dark:text-white font-semibold mb-4 bg-gray-200 dark:bg-gray-700 px-4 py-3 mr-1 rounded-t-lg">Person Details</h3>
                <button onClick={onClose} className="modal-close-button top-0 right-0 -mt-2 -mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-500 focus:outline-none">X</button>
                <div className="flex justify-between px-4 py-2">
                    {tables.map(tableName => (
                        <button key={tableName} onClick={() => handleTableClick(tableName)} className="btn bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition-colors duration-200">
                            {tableName}
                        </button>
                    ))}
                </div>
                {editMode ? (
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4 px-4 py-2">
                        {Object.keys(editedPerson).map((key) => (
                            <div key={key} className="flex flex-col">
                                <label className="dark:text-gray-700 text-gray-400 text-sm font-semibold mb-1" htmlFor={key}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                                </label>
                                <input
                                    id={key}
                                    type="text"
                                    name={key}
                                    value={editedPerson[key]}
                                    onChange={handleChange}
                                    className="input text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        ))}
                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                onClick={handleSave}
                                className="btn bg-blue-400 hover:bg-blue-500 text-white mt-2 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition-colors duration-200"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-2 px-4 py-2">
                        {Object.keys(person || {}).map((key) => (
                            <div key={key} className="flex justify-between">
                                <p className="dark:text-gray-700 text-gray-300 font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</p>
                                <p className="dark:text-gray-700 text-gray-400">{person[key]}</p>
                            </div>
                        ))}
                        <div className="flex top-5 justify-end mt-6">
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



// import React, { useState, useEffect } from 'react';
// import "../App.css"

// // const DetailCard = ({show, person, onClose,  onPersonUpdated }) => {
// const DetailCard = ({ person, onClose }) => {
//     const [editMode, setEditMode] = useState(false);
//     const [editedPerson, setEditedPerson] = useState({});

//     useEffect(() => {
//         setEditedPerson(person);
//     }, [person]);

//     const handleChange = (event) => {
//         const { name, value } = event.target;
//         setEditedPerson(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSave = () => {
//         setEditMode(false);
//     };

//     return (
//         <div className="modal-backdrop flex justify-center items-center">
//             <div className="modal-content bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden w-96">
//                 <h3 className="text-xl dark:text-white font-semibold mb-4 bg-gray-200 dark:bg-gray-700 px-4 py-3 mr-1 rounded-t-lg">Person Details</h3>
//                 <button onClick={onClose} className="modal-close-button top-0 right-0 -mt-2 -mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-500 focus:outline-none">X</button>
                                
//                 {editMode ? (
//                     <form onSubmit={(e) => e.preventDefault()} className="space-y-4 px-4 py-2">
//                         {Object.keys(editedPerson).map((key) => (
//                             <div key={key} className="flex flex-col">
//                                 <label className="dark:text-gray-700 text-gray-400 text-sm font-semibold mb-1" htmlFor={key}>
//                                     {key.charAt(0).toUpperCase() + key.slice(1)}:
//                                 </label>
//                                 <input
//                                     id={key}
//                                     type="text"
//                                     name={key}
//                                     value={editedPerson[key]}
//                                     onChange={handleChange}
//                                     className="input text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                 />
//                             </div>
//                         ))}
//                         <div className="flex justify-end mt-4">
//                             <button
//                                 type="submit"
//                                 onClick={handleSave}
//                                 className="btn bg-blue-400 hover:bg-blue-500 text-white mt-2 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition-colors duration-200"
//                             >
//                                 Save Changes
//                             </button>
//                         </div>
//                     </form>
//                 ) : (
//                     <div className="space-y-2 px-4 py-2">
//                         {Object.keys(person || {}).map((key) => (
//                             <div key={key} className="flex justify-between">
//                                 <p className="dark:text-gray-700 text-gray-300 font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</p>
//                                 <p className="dark:text-gray-700 text-gray-400">{person[key]}</p>
//                             </div>
//                         ))}
//                         <div className="flex top-5 justify-end mt-6">
//                             <button
//                                 onClick={() => setEditMode(true)}
//                                 className="btn bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition-colors duration-200"
//                             >
//                                 Edit
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default DetailCard;