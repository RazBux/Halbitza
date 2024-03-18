import React, { useState, useEffect } from 'react';

const AddPersonForm = ({ tableName, backendURL }) => {
    const [schema, setSchema] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchema = async () => {
            setLoading(true);
            try {
                var query = `${backendURL}/table/${tableName}`;
                console.log(`Add Person query: ${query}`);
                const response = await fetch(query);
                if (!response.ok) throw new Error('Failed to fetch table schema');
                const schemaData = await response.json();
                console.log('Fetched schema:', schemaData); // Log the parsed response

                // Directly use the returned array as the schema
                setSchema(schemaData); // No need to access .columns

                // Initialize formData based on schema
                const initialFormData = {};
                schemaData.forEach(column => { // Use schemaData directly
                    initialFormData[column] = '';
                });
                setFormData(initialFormData);
            } catch (error) {
                console.error('Error fetching schema:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (tableName) fetchSchema();
    }, [tableName, backendURL]);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Submit logic...
    };

    if (loading) return <p>Loading schema...</p>;
    if (error) return <p>Error loading schema: {error}</p>;

    return (
        <form onSubmit={handleSubmit} className="add-person-form">
            {/* Special handling for the ID field */}
            <div className="form-group">
                <label className="required">ID:</label>
                <input
                    type="text"
                    name="id"
                    required
                    value={formData.id || ''}
                    onChange={handleChange}
                />
            </div>

            {/* Render other fields, excluding the ID to avoid duplication */}
            {schema.filter(column => column !== "id").map(column => (
                <div className="form-group" key={column}>
                    <label>{column.charAt(0).toUpperCase() + column.slice(1)}</label>
                    <input
                        type={column === "email" ? "email" : "text"} // Example of adjusting based on column name
                        name={column}
                        value={formData[column] || ''}
                        onChange={handleChange}
                    />
                </div>
            ))}
           {/* Form fields */}
        <div className="form-buttons">
            <button type="submit" className="button submit-button">Submit</button>
        </div>
        </form>

    );
};


export default AddPersonForm;
