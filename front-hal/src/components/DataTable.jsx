import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import debounce from 'lodash.debounce';
import Modal from './Modal';
import DetailCard from './DetailCard';

// Assuming Modal, DetailCard, and useDarkMode are correctly imported

const DataTable = ({ tableName, columnName, backendURL }) => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch initial data
    useEffect(() => {
        fetchData();
    }, [tableName, columnName, backendURL]);

    // Debounced search
    useEffect(() => {
        if (searchTerm === '') {
            fetchData(); // Fetch all data if search is cleared
            return;
        }
        const debouncedSearch = debounce(async (pattern) => {
            searchByID(pattern);
        }, 500);

        debouncedSearch(searchTerm);

        // Cleanup debounced calls
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const query = `${backendURL}/data?tableName=${tableName}&columns=${columnName}`;
            const response = await fetch(query);
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            setData(result || []);
        } catch (error) {
            setError(error.toString());
        } finally {
            setLoading(false);
        }
    };

    const searchByID = async (idPattern) => {
        setLoading(true);
        try {
            const url = `${backendURL}/search/${tableName}/${encodeURIComponent(idPattern)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const results = await response.json();
            setData(results.length > 0 ? results : []);
        } catch (error) {
            setError(`Error performing search: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const columns = React.useMemo(() => data[0] ? Object.keys(data[0]).map(key => ({
        Header: key.charAt(0).toUpperCase() + key.slice(1),
        accessor: key,
    })) : [], [data]);

    const tableInstance = useTable({ columns, data });
    
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error! {error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center py-2">
                <h3 className="text-lg font-semibold">{tableName.toUpperCase()}:</h3>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder="Search by ID..."
                    className="border-2 border-gray-300 bg-white h-10 px-2 rounded-lg text-sm focus:outline-none"
                />
            </div>
            <div className="table-container">
                <table {...getTableProps()} className="no-select">
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
                                <tr {...row.getRowProps()} onClick={() => {
                                    setSelectedPerson(row.original);
                                    setShowDetailsModal(true);
                                }}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {showDetailsModal && selectedPerson && (
                <Modal show={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
                    <DetailCard person={selectedPerson} />
                </Modal>
            )}
        </div>
    );
};

export default DataTable;