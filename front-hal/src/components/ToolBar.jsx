import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import "../App.css";

const ToolBar = ({ updateSelectedTable, selectedTable, backendURL }) => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the table names from the RESTful API
        const fetchTables = async () => {
            try {
                const uri = `${backendURL}/tables`;
                const response = await fetch(uri);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTables(data); // Assuming the API returns an array of table names
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchTables();
    }, [backendURL]); // Re-run this effect if backendURL changes

    // Function to handle the change in select input
    const handleChange = (selectedOption) => {
        updateSelectedTable(selectedOption.value);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    // Preparing options for the select input
    const options = tables.map(table => ({ value: table, label: table }));

    const customStyles = {
        multiValue: (styles) => ({
            ...styles,
            backgroundColor: 'lightblue',
        }),
    };

    return (
        <div className="toolbar">
            <div className="market">Halbitza-pro</div>
            <div className="search-container">
                <Select
                    options={options}
                    onChange={handleChange}
                    value={options.find(option => option.value === selectedTable)}
                    placeholder="Search Table…"
                    styles={customStyles}
                />
            </div>
        </div>
    );
};

export default ToolBar;
