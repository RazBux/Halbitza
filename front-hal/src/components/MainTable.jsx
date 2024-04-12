import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import debounce from 'lodash.debounce';
import Modal from './Modal'; // Assume imported correctly
import DetailCard from './DetailCard'; // Assume imported correctly
import SearchInput from './table/SearchInput';
import DataTable from './table/displayTable'; // Path to your DataTable component

const MainTable = ({ tableName, columnName, backendURL }) => {
    const [searchParams, setSearchParams] = useState({ id: '' });
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        debouncedSearch(searchParams.id);
    }, [searchParams.id]);

    const handleCloseDetailCard = () => {
        setShowDetails(false); // Assuming you toggle visibility with this boolean state
    };


    const handleInputChange = (e) => {
        const { value } = e.target;
        setSearchParams({ id: value });
    };

    const handleSelectPerson = (person) => {
        console.log("Person selected:", person);
        setSelectedPerson(person);
        setShowDetails(true);
    };

    const debouncedSearch = debounce(async (idPattern) => {
        setLoading(true);
        setError('');
        try {
            // if there isn't id pattern - display all the data...
            const allDataUrl = `${backendURL}/data?tableName=${tableName}&columns=${columnName}`;
            const url = idPattern ? `${backendURL}/search/${tableName}/${encodeURIComponent(idPattern)}` : allDataUrl ;
            console.log("MainTable url:", url)
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const results = await response.json();
            setSearchResults(results.length > 0 ? results : []);
            if (results.length === 0) setError('No results found.');
        } catch (error) {
            setError(`Error performing search: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, 500);

    return (
        <div>
            <div className="flex justify-between items-center py-2">
                <h3 className="text-lg font-semibold">{tableName.toUpperCase()}:</h3>
                <SearchInput searchValue={searchParams.id} onSearchChange={handleInputChange} />
            </div>
            {loading && <div>Loading...</div>}
            {error && <div>Error! {error}</div>}
            {!loading && !error && <DataTable data={searchResults} onRowSelect={handleSelectPerson} />}
            
            {showDetails && selectedPerson && (
                <DetailCard backendURL={backendURL} tableName={tableName} person={tableName == 'persons' ? selectedPerson.id : selectedPerson.pers_id} onClose={handleCloseDetailCard} />    
            )}
        </div>

    );
};

export default MainTable;
