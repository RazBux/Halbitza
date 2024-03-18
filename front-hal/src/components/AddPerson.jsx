import React, { useState } from 'react';

const AddPersonForm = ({ backendURL }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Example POST request to your backend
    try {
      const response = await fetch(`${backendURL}/people`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create new person');
      }

      // Handle success response
      alert('Person added successfully');
      // Reset form and hide
      setFormData({ name: '', age: '', email: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding person');
    }
  };

  return (
    <div>
      <button onClick={() => setShowForm(true)}>+ Add Person</button>
      
      {showForm && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default AddPersonForm;
