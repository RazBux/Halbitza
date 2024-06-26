import React, { useState, useEffect } from 'react';

const DetailCard = ({ backendURL, tableName, person, onClose }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedPerson, setEditedPerson] = useState({});
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(tableName);


    useEffect(() => {
        const fetchTablesAndData = async () => {
            try {
                const uri = `${backendURL}/tables`;
                const response = await fetch(uri);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTables(data);
                console.log("tableData", data);

                console.log("table:", selectedTable);
                console.log("person:", person);
                // Fetch data for the selected table
                if (selectedTable && (person)) {
                    console.log('Fetching data...');
                    fetchData(selectedTable, person);
                }
            } catch (error) {
                console.error('Error fetching tables:', error);
            }
        };

        fetchTablesAndData();
    }, [backendURL, selectedTable, person]);

    const fetchData = async (tableName, id) => {
        try {
            console.log('Fetching data for id:', id);
            const query = `${backendURL}/data?tableName=${tableName}&id=${id}`;
            console.log(query);
            const response = await fetch(query);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("data >>>> ", data);
            setEditedPerson(data);
        } catch (error) {
            console.error(`Error fetching data for table ${tableName}:`, error);
        }
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditedPerson((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setEditMode(false);
    };

    const handleTableClick = (tableName) => {
        console.log('Selected table:', tableName);
        setSelectedTable(tableName);
        fetchData(tableName, person);
    };

    return (
        <div className="modal-backdrop flex justify-center items-center">
            <div className="modal-content bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden w-96">
                <div className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 px-4 py-3 rounded-t-lg">
                    <h3 className="text-xl dark:text-white font-semibold mb-0">Person Details</h3>
                    <div>
                        <select
                            id="tableSelect"
                            // value={selectedTable}
                            value={selectedTable}
                            onChange={(e) => handleTableClick(e.target.value)}
                            className="block bg-gray-500 hover:bg-gray-600 text-white mr-1 font-bold py-2 px-4 rounded focus:outline-none focus:bg-gray-600 focus:border-gray-600"
                        >
                            {tables.map((table) => (
                                <option key={table.table_name} value={table.table_name}>
                                    {table.table_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="modal-close-button top-0 right-0 -mt-2 -mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-500 focus:outline-none"
                >
                    X
                </button>


                {editMode ? (
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4 px-4 py-2">
                        {Array.isArray(editedPerson) && editedPerson.length > 0 ? (
                            <div className="flex flex-col"> {/* Render inputs in a single column */}
                                {editedPerson.map((personData, index) => (
                                    <div key={index}>
                                        {Object.keys(personData).map((key) => (
                                            <div key={key} className="flex flex-col mb-3"> {/* Adjust here to display inputs in a single column */}
                                                <label className="flex dark:text-gray-700 text-gray-400 text-sm font-semibold mb-1" htmlFor={key}>
                                                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                                                </label>
                                                <input
                                                    id={key}
                                                    type="text"
                                                    name={key}
                                                    value={personData[key]}
                                                    onChange={handleChange}
                                                    className="input text-gray-700 ml-1 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No data available</p>
                        )}
                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                onClick={handleSave}
                                className="btn bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition-colors duration-200"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setEditMode(false)} // Button to exit edit mode
                                className="btn bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition-colors duration-200 ml-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-2 px-4 py-2">
                        {Array.isArray(editedPerson) && editedPerson.length > 0 ? (
                            editedPerson.map((personData, index) => (
                                <div key={index}>
                                    {Object.keys(personData).map((key) => (
                                        <div key={key} className="flex mb-2.5 justify-between">
                                            <p className="dark:text-gray-700 text-gray-300 font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</p>
                                            <p className="dark:text-gray-700 text-gray-400">{personData[key]}</p>
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <p>No data available</p>
                        )}
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
