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
                const query = `${backendURL}/table/${tableName}`;
                const response = await fetch(query);
                if (!response.ok) throw new Error('Failed to fetch table schema');
                const schemaData = await response.json();
                setSchema(schemaData);
                const initialFormData = {};
                schemaData.forEach(column => {
                    initialFormData[column] = '';
                });
                setFormData(initialFormData);
            } catch (error) {
                setError(`Error fetching schema: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (tableName) {
            fetchSchema();
        }
    }, [tableName, backendURL]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Define payload here within the handleSubmit function scope
        const payload = {
            tableName, // Assuming tableName is a prop or state variable available in this scope
            data: formData // formData should hold the form values collected from user input
        };
        
        console.log(tableName,  formData);

        try {
            const response = await fetch(`${backendURL}/data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload) // Correctly pass payload as the request body
            });
            

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Form submitted successfully', result);
            alert('Form submitted successfully!');
            // Optionally reset the form here
            setFormData({});
        } catch (error) {
            console.error('Error submitting form:', error);
            setError(`Error submitting form: ${error.message}`);
        }
    };

    if (loading) return <p>Loading schema...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <form onSubmit={handleSubmit} className="add-person-form">
            {schema.map(column => (
                <div className="form-group" key={column}>
                    <label>{column.charAt(0).toUpperCase() + column.slice(1)}{column === "id" ? "*" : ""}</label>
                    <input
                        type="text"
                        name={column}
                        value={formData[column] || ''}
                        onChange={handleChange}
                        required={column === "id"}
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

