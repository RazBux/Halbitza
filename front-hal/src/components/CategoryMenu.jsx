import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const CategoryMenu = ({ selectedTable, updateCategories, backendURL }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedTable) return;
      setLoading(true);
      try {
        var uriCategory = `${backendURL}/table/${selectedTable}`;
        console.log(`Selected category uri: ${uriCategory}`);
        const response = await fetch(uriCategory);
        if (!response.ok) throw new Error('Network response was not ok');
        const columnsArray = await response.json(); // This is directly the array of column names
        const formattedOptions = columnsArray
        .map(obj => ({
          label: obj.column_name, // Adjusted to use column_name property
          value: obj.column_name, // Adjusted to use column_name property
        }));
      setOptions(formattedOptions);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [selectedTable, backendURL]);

  const handleCategoryChange = selectedOptions => {
    setSelectedOptions(selectedOptions);
  };

  const handleButtonClick = () => {
    const selectedCategories = selectedOptions.map(option => option.value);
    updateCategories(selectedCategories);
  };

  const customStyles = {
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: 'lightblue',
    })
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    // The rest of your component rendering code, including Select component and button
    <div>
      <h2>Categories</h2>
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleCategoryChange}
        styles={customStyles}
      />
      <button className="custom-button" onClick={handleButtonClick}>Submit</button>
    </div>
  );
};

export default CategoryMenu;
