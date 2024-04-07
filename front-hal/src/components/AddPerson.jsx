import React, { useState, useEffect } from 'react';

const AddPersonForm = ({ tableName, backendURL }) => {
    const [schema, setSchema] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSchema = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${backendURL}/table/${tableName}`);
                if (!response.ok) throw new Error('Failed to fetch table schema');
                const schemaData = await response.json();
                console.log("schemaData:",schemaData);

                const initialFormData = schemaData.reduce((acc, column) => {
                    console.log("Processing column:", column.column_name); // Debug log
                    if (!column.column_name.includes('_id')) {
                        console.log("Adding column:", column.column_name); // Debug log
                        acc[column.column_name] = '';
                    } else {
                        console.log("Excluding column:", column.column_name); // Debug log
                    }
                    return acc;
                }, {});
                setFormData(initialFormData);
                setSchema(schemaData);
            } catch (error) {
                setError(`Error fetching schema: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (tableName) fetchSchema();
    }, [tableName, backendURL]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    async function submitFormData({ endpoint, method = 'POST', body }) {
        try {
            const headers = { 'Content-Type': 'application/json' };
            const response = await fetch(endpoint, {
                method,
                headers,
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error submitting form:', error);
            throw error; // Propagate the error to be handled by the caller
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await submitFormData({ 
                endpoint: `${backendURL}/data`, 
                body: { tableName, data: formData }
            });
            console.log('Form submitted successfully:', result);
            alert('Form submitted successfully!');
            setFormData({}); // Optionally reset the form
        } catch (error) {
            setError(`Error submitting form: ${error.message}`);
        }
    };

    if (loading) return <p>Loading schema...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <form onSubmit={handleSubmit} className="add-person-form">
            {schema.map(column => (
                <div className="form-group" key={column.column_name}>
                    <label>
                        {column.column_name.charAt(0).toUpperCase() + column.column_name.slice(1)}
                        {column.column_name === "id" ? "*" : ""}
                    </label>
                    <input
                        type="text"
                        name={column.column_name}
                        value={formData[column.column_name] || ''}
                        onChange={handleChange}
                        required={column.column_name === "id"}
                    />
                </div>
            ))}
            <div className="form-buttons">
                <button type="submit" className="button submit-button">Submit</button>
            </div>
        </form>
    );
};

export default AddPersonForm;
