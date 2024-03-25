import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import AddPersonForm from './AddPerson';
import SearchPersonForm from './SearchComponent';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';
import "../App.css";

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
    }, [backendURL]);

    const navigate = useNavigate();

    const handleExploreClick = () => {
        navigate('/grad'); // Use navigate instead of history.push
    };

    const handleChange = (selectedOption) => {
        updateSelectedTable(selectedOption.value);
    };

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleOpenSearchModal = () => setShowSearchModal(true);
    const handleCloseSearchModal = () => setShowSearchModal(false);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const options = tables.map(table => ({ value: table, label: table }));

    const customStyles = {
        multiValue: (styles) => ({
            ...styles,
            backgroundColor: 'lightblue',
        }),
    };

    return (
        <div className="toolbar">
            <div className="toolbar-left">
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
            {/* Button to open modal now sits outside the .toolbar-left but inside .toolbar */}
            <button onClick={handleOpenModal} className="add-person-button">＋ Add</button>
            <button onClick={handleExploreClick} className="gard-button"> Grad</button>
            <button onClick={handleOpenSearchModal} className="search-person-button">🔍 Search</button>


            {/* Modal for adding a new person */}
            <Modal show={showModal} onClose={handleCloseModal}>
                <AddPersonForm backendURL={backendURL} tableName={selectedTable} />
            </Modal>

            {/* Modal for searching a person */}
            <Modal show={showSearchModal} onClose={handleCloseSearchModal}>
                <SearchPersonForm backendURL={backendURL} tableName={selectedTable} />
            </Modal>


        </div>


    );
};

export default ToolBar;
