import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import AddPersonForm from './AddPerson';
import Modal from './Modal';
import "../App.css";

const ToolBar = ({ updateSelectedTable, selectedTable, backendURL }) => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

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

    const handleChange = (selectedOption) => {
        updateSelectedTable(selectedOption.value);
    };

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

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
        <div classnName="toolbar">
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
            {/* Button to open modal */}
            <button onClick={handleOpenModal} className="add-person-button">+ Add Person</button>
            
            {/* Modal for adding a new person */}
            <Modal show={showModal} onClose={handleCloseModal}>
                <AddPersonForm backendURL={backendURL} closeModal={handleCloseModal} />
            </Modal>
        </div>
    );
};

export default ToolBar;



// import React, { useState, useEffect } from 'react';
// import Select from 'react-select';
// import AddPersonForm from './AddPerson';
// import "../App.css";

// const ToolBar = ({ updateSelectedTable, selectedTable, backendURL }) => {
//     const [tables, setTables] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         // Fetch the table names from the RESTful API
//         const fetchTables = async () => {
//             try {
//                 const uri = `${backendURL}/tables`;
//                 const response = await fetch(uri);
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 const data = await response.json();
//                 setTables(data); // Assuming the API returns an array of table names
//                 setLoading(false);
//             } catch (error) {
//                 setError(error);
//                 setLoading(false);
//             }
//         };

//         fetchTables();
//     }, [backendURL]); // Re-run this effect if backendURL changes

//     // Function to handle the change in select input
//     const handleChange = (selectedOption) => {
//         updateSelectedTable(selectedOption.value);
//     };

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error: {error.message}</p>;

//     // Preparing options for the select input
//     const options = tables.map(table => ({ value: table, label: table }));

//     const customStyles = {
//         multiValue: (styles) => ({
//             ...styles,
//             backgroundColor: 'lightblue',
//         }),
//     };

//     return (
//         <div className="toolbar">
//             <div className="market">Halbitza-pro</div>
//             <div className="search-container">
//                 <Select
//                     options={options}
//                     onChange={handleChange}
//                     value={options.find(option => option.value === selectedTable)}
//                     placeholder="Search Table…"
//                     styles={customStyles}
//                 />
//             </div>
//             <div>
//             <AddPersonForm> </AddPersonForm>
//             </div>
//         </div>
//     );
// };

// export default ToolBar;
