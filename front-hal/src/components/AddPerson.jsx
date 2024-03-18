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




// import React, { useState, useEffect } from 'react';

// const AddPersonForm = ({ tableName, backendURL }) => {
//     const [schema, setSchema] = useState([]);
//     const [formData, setFormData] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchSchema = async () => {
//             setLoading(true);
//             try {
//                 var query = `${backendURL}/table/${tableName}`;
//                 console.log(`Add Person query: ${query}`);
//                 const response = await fetch(query);
//                 if (!response.ok) throw new Error('Failed to fetch table schema');
//                 const schemaData = await response.json();
//                 console.log('Fetched schema:', schemaData); // Log the parsed response

//                 // Directly use the returned array as the schema
//                 setSchema(schemaData); // No need to access .columns

//                 // Initialize formData based on schema
//                 const initialFormData = {};
//                 schemaData.forEach(column => { // Use schemaData directly
//                     initialFormData[column] = '';
//                 });
//                 setFormData(initialFormData);
//             } catch (error) {
//                 console.error('Error fetching schema:', error);
//                 setError(error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (tableName) fetchSchema();
//     }, [tableName, backendURL]);

//     // Handle form changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         // Construct the payload
//         const payload = {
//             tableName, // Assuming you want to insert into the table specified in props
//             data: formData
//         };
    
//         try {
//             // Make a POST request to your server endpoint
//             const response = await fetch(`${backendURL}/api/data`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(payload)
//             });
    
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
    
//             const result = await response.json(); // Assuming your server sends back some response
//             console.log('Submit result:', result);
//             alert('Form submitted successfully!');
    
//             // Optionally reset the form here
//             // setFormData({});
//         } catch (error) {
//             console.error('Error submitting form:', error);
//             setError(`Error submitting form: ${error.message}`);
//         }
//     };
    

//     if (loading) return <p>Loading schema...</p>;
//     if (error) return <p>Error loading schema: {error}</p>;

//     return (
//         <form onSubmit={handleSubmit} className="add-person-form">
//             {/* Special handling for the ID field */}
//             <div className="form-group">
//                 <label className="required">ID*</label>
//                 <input
//                     type="text"
//                     name="id"
//                     required
//                     value={formData.id || ''}
//                     onChange={handleChange}
//                 />
//             </div>

//             {/* Render other fields, excluding the ID to avoid duplication */}
//             {schema.filter(column => column !== "id").map(column => (
//                 <div className="form-group" key={column}>
//                     <label>{column.charAt(0).toUpperCase() + column.slice(1)}</label>
//                     <input
//                         type={column === "email" ? "email" : "text"} // Example of adjusting based on column name
//                         name={column}
//                         value={formData[column] || ''}
//                         onChange={handleChange}
//                     />
//                 </div>
//             ))}
//            {/* Form fields */}
//         <div className="form-buttons">
//             <button type="submit" className="button submit-button">Submit</button>
//         </div>
//         </form>

//     );
// };


// export default AddPersonForm;
