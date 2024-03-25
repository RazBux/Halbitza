import React, { useState } from 'react';
// import Select from 'react-select';
import AddPersonForm from './AddPerson';
import SearchPersonForm from './SearchComponent';
import Modal from './Modal';
import "../App.css";
import { useNavigate } from 'react-router-dom';

const Gard = ({ selectedTable, backendURL }) => {
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const navigate = useNavigate();

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleExploreClick = () => navigate('/query-data');


  // const customStyles = {
  //   multiValue: (styles) => ({
  //     ...styles,
  //     backgroundColor: 'lightblue',
  //   }),
  // };

  return (
    <div>
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="market">Halbitza-pro</div>

        </div>

        {/* Button to open modal now sits outside the .toolbar-left but inside .toolbar */}
        <button onClick={handleOpenModal} className="add-person-button">＋ Add</button>
        <button onClick={handleExploreClick} className="search-person-button"> Explore</button>

        {/* Modal for adding a new person */}
        <Modal show={showModal} onClose={handleCloseModal}>
          <AddPersonForm backendURL={backendURL} tableName={selectedTable} />
        </Modal>
        <div />
      </div>

      <div>
        <br />
        <SearchPersonForm backendURL={backendURL} tableName={selectedTable} />
      </div>

    </div>

  );
};

export default Gard;
