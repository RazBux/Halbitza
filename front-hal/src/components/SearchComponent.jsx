import React, { useState } from 'react';
import { useTable } from 'react-table';
import Modal from './Modal';

const SearchPersonForm = ({ backendURL, tableName }) => {
    const [searchParams, setSearchParams] = useState({ id: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    // Dynamically generate columns based on searchResults
    const columns = React.useMemo(() => {
        if (searchResults.length === 0) {
            return [];
        }

        // Generate columns from the first result's keys
        return Object.keys(searchResults[0]).map(key => ({
            Header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the header
            accessor: key,
        }));
    }, [searchResults]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data: searchResults,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSearchResults([]); // Clear previous results
        setShowModal(false); // Close modal to ensure it's reopened with new data

        const idPattern = searchParams.id;
        if (!idPattern) {
            setError('Please enter an ID pattern.');
            setLoading(false);
            return;
        }

        try {
            const url = new URL(`${backendURL}/search/${tableName}/${encodeURIComponent(idPattern)}`);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const results = await response.json();

            if (results.length > 0) {
                setSearchResults(results);
                handleOpenModal(); // Open modal with results
            } else {
                setError('No results found.');
            }
        } catch (error) {
            console.error('Error performing search:', error);
            setError(`Error performing search: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <div>
            <form onSubmit={handleSubmit} className="search-person-form">
                <div className="form-group">
                    <label>ID</label>
                    <input
                        type="text"
                        name="id"
                        value={searchParams.id || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-buttons">
                    <button type="submit" className="button search-button">Search</button>
                </div>
            </form>
            {loading && <p>Searching...</p>}
            {error && <p>Error: {error}</p>}

            {/* Modal displaying search results */}
            <Modal show={showModal} onClose={handleCloseModal}>
                <div className="table-container">
                    <table {...getTableProps()} className="table">
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Modal>
        </div>
    );
};

export default SearchPersonForm;


// import React, { useState, useEffect } from 'react';
// import { useTable } from 'react-table';
// import Modal from './Modal';

// const SearchPersonForm = ({ backendURL, tableName }) => {
//     const [searchParams, setSearchParams] = useState({ id: '' });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [showModal, setShowModal] = useState(false); // State to control modal visibility

//     const columns = React.useMemo(() => [
//         {
//             Header: 'ID',
//             accessor: 'id',
//         },
//         {
//             Header: 'Name',
//             accessor: 'name',
//         },
//         // Define other columns as needed
//     ], []);

//     const handleOpenModal = () => setShowModal(true);
//     const handleCloseModal = () => setShowModal(false);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setSearchParams(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         const idPattern = searchParams.id;
//         if (!idPattern) {
//             setError('Please enter an ID pattern.');
//             setLoading(false);
//             return;
//         }

//         try {
//             const url = new URL(`${backendURL}/search/${tableName}/${encodeURIComponent(idPattern)}`);
//             const response = await fetch(url, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });
//             if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//             const results = await response.json();

//             //do somthing with the results!!


//         } catch (error) {
//             console.error('Error performing search:', error);
//             setError(`Error performing search: ${error.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };



//     return (
//         <div>
//             <div>
//                 <form onSubmit={handleSubmit} className="search-person-form">
//                     <div className="form-group">
//                         <label>ID</label>
//                         <input
//                             type="text"
//                             name="id"
//                             value={searchParams.id || ''}
//                             onChange={handleChange}
//                         />
//                     </div>
//                     <div className="form-buttons">
//                         <button type="submit" onClick={handleOpenModal} className="button search-button">Search</button>
//                     </div>
//                 </form>
//                 {loading && <p>Searching...</p>}
//                 {error && <p>Error: {error}</p>}
//             </div>

//             {/* Modal for adding a new person */}
//             <Modal show={showModal} onClose={handleCloseModal}>
//                 {/* add here the table wigte */}
                
            
//             </Modal>

//         </div>
//     );
// };

// export default SearchPersonForm;
