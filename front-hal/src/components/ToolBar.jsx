import { IoMdPersonAdd } from "react-icons/io";
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import AddPersonForm from './AddPerson';
import SearchPersonForm from './SearchComponent';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';
import "../App.css";
import { IconBase } from "react-icons";

const ToolBar = ({ updateSelectedTable, selectedTable, backendURL }) => {

    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [showSearchModal, setShowSearchModal] = useState(false); // State to control search person modal visibility



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
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchTables();
    }, [backendURL,]);

    const handleChange = (selectedOption) => {
        updateSelectedTable(selectedOption.value);
    };

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleOpenSearchModal = () => setShowSearchModal(true);
    const handleCloseSearchModal = () => setShowSearchModal(false);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    // const options = tables.map(table => ({ value: table, label: table }));
    const options = tables.map(table => ({
        value: table.table_name, // Assuming 'table_name' is the unique identifier for the table
        label: table.table_name // This should be the string you want displayed
    }));

    const customStyles = {
        multiValue: (styles) => ({
            ...styles,
            backgroundColor: 'lightblue',
        }),
    };
    return (
        <div className="flex items-center justify-between bg-teal-100 text-gray-800 p-2 rounded-xl">
            <div className="flex items-center">
                <div className="font-bold text-2xl p-4">Halbitza-pro</div>
                <div className="p-2 flex-grow">
                    <Select className="hover:bg-gray-300"
                        options={options}
                        onChange={handleChange}
                        value={options.find(option => option.value === selectedTable)}
                        placeholder="Search Table…"
                        styles={customStyles}
                    />
                </div>
            </div>
            {/* Buttons wrapper with ml-auto to push to the end */}
            <div className="flex space-x-2 ml-auto">
                {/* Your buttons */}
                <button onClick={handleOpenModal} className="text-4xl p-2 bg-sky-300 hover:bg-sky-400 font-bold py-2 px-4 rounded">
                    <IoMdPersonAdd size={39} />
                </button>
                <button onClick={handleOpenSearchModal} className="text-4xl p-2 bg-blue-300 hover:bg-blue-400 font-bold py-2 px-4 rounded">🔍</button>
            </div>

            {/* Modals */}
            <Modal show={showModal} onClose={handleCloseModal}>
                <AddPersonForm backendURL={backendURL} tableName={selectedTable} />
            </Modal>
            <Modal show={showSearchModal} onClose={handleCloseSearchModal}>
                <SearchPersonForm backendURL={backendURL} tableName={selectedTable} />
            </Modal>
        </div>
    );

};

export default ToolBar;
