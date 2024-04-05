import React, { useState, useEffect } from 'react';
import CategoryMenu from './CategoryMenu';
import ToolBar from './ToolBar';
import DataTable from './DataTable';
import SearchComponent from './SearchComponent';

function QueryData({ backendURL }) { // Ensure backendURL is received as prop
  const [selectedTable, setSelectedTable] = useState('persons');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // if (!selectedTable) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        // Correctly construct the URL without redundant /api/
        const url = `${backendURL}/table/${selectedTable}?tableName=${selectedTable}&columns=${selectedCategories.join(',')}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        setError(null);
      } catch (error) {
        console.error("Fetching error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTable, selectedCategories, backendURL]); // Add backendURL as a dependency

  const updateCategories = (categories) => {
    setSelectedCategories(categories);
  };

  const updateSelectedTable = (tableName) => {
    setSelectedTable(tableName);
    setSelectedCategories([]);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <ToolBar updateSelectedTable={updateSelectedTable} selectedTable={selectedTable} backendURL={backendURL} />
      <CategoryMenu selectedTable={selectedTable} updateCategories={updateCategories} backendURL={backendURL} />
      {/* Assuming DataTable is prepared to receive and process the data prop */}
      <DataTable backendURL={backendURL} tableName={selectedTable} columnName={selectedCategories} />
    </div>
  );
}

export default QueryData;
