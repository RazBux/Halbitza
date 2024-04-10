import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import Modal from './Modal';
import debounce from 'lodash.debounce'; // Make sure you have lodash installed

const SearchPersonForm = ({ backendURL, tableName, columnName }) => {
    const [searchParams, setSearchParams] = useState({ id: '' });
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const columns = React.useMemo(() => {
        if (searchResults.length === 0) {
            return [];
        }
        return Object.keys(searchResults[0]).map(key => ({
            Header: key.charAt(0).toUpperCase() + key.slice(1),
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

    const debouncedSearch = debounce(async (idPattern) => {
        if (!idPattern) return;
        setLoading(true);
        setError('');
        try {
            const url = new URL(`${backendURL}/search/${tableName}/${encodeURIComponent(idPattern)}`);
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const results = await response.json();
            setSearchResults(results.length > 0 ? results : []);
            if (results.length === 0) setError('No results found.');
        } catch (error) {
            console.error('Error performing search:', error);
            setError(`Error performing search: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, 500);

    useEffect(() => {
        debouncedSearch(searchParams.id);
    }, [searchParams.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectPerson = (person) => {
        setSelectedPerson(person); // Set the selected person
        setShowDetailsModal(true); // Open the details modal
    };

    // Determine row style based on id_color
    const getRowStyle = (idColor) => {
        switch (idColor) {
            case 'כחולה':
                return { backgroundColor: 'green', color: 'white' };
            case 'ירוקה':
                return { backgroundColor: 'red', color: 'white' };
            default:
                return {}; // Default style
        }
    };


    return (
        <div>
            <div className="search-person-form">
                <div className="form-group">
                    <label>ID</label>
                    <input
                        type="text"
                        name="id"
                        value={searchParams.id || ''}
                        onChange={handleChange}
                    />
                </div>
            </div>
            {loading && <p>Searching...</p>}
            {error && <p>Error: {error}</p>}
            {/* Display search results directly under the search bar */}
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
                            const rowStyle = getRowStyle(row.original.id_color);
                            return (
                                <tr {...row.getRowProps()} onClick={() => handleSelectPerson(row.original)} style={rowStyle}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {/* Modal for showing selected person details */}
            <Modal show={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
                <div>
                    <h3>Person Details:</h3>
                    {selectedPerson && Object.keys(selectedPerson).map(key => (
                        <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {selectedPerson[key]}</p>
                    ))}
                </div>
            </Modal>
            {/* This section displays the selected person's details
            {selectedPerson && (
                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <h3>Person Details:</h3>
                    {Object.keys(selectedPerson).map(key => (
                        <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {selectedPerson[key]}</p>
                    ))}
                </div>
            )} */}
        </div>
    );

};

export default SearchPersonForm;
