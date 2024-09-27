import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ClassList.css';

function ClassList() {
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [editingClassId, setEditingClassId] = useState(null);
  const [editedClassName, setEditedClassName] = useState('');
  const [originalIndex, setOriginalIndex] = useState(null); // Track original index of edited class

  // Use a get request to all the class objects from the backend 
  const fetchClasses = async () => {
    try {
      const response = await fetch('http://localhost:3001/classes');
      const fetchedClasses = await response.json();
      setClasses(fetchedClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  //Create a new class by sending POST request to server, and 
  // using the class name given in the text box. 
  
  const handleCreateClass = async () => {
    if (newClassName) {
      try {
        await fetch('http://localhost:3001/classes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newClassName }),
        });
        // Reset the box once the class has been created.
        setNewClassName('');
        fetchClasses();
      } catch (error) {
        console.error('Error creating class:', error);
      }
    }
  };

  const handleEditClass = (classId) => {
    //Find the element in the array of classes that needs to be edited.
    const classToEdit = classes.find((classItem) => classItem.id === classId);
    //Mark this Id as the class to be edited
    setEditingClassId(classId);
    //Mark the name as well
    setEditedClassName(classToEdit.name);
    //Keep the original class Id so the order of the 
    setOriginalIndex(classes.findIndex((classItem) => classItem.id === classId)); // Capture the original index
  };

  const handleSaveEdit = async (classId) => {
    try {
      // Send a request to update the class on the server with the edited class name
      await fetch(`http://localhost:3001/classes/${classId}?update=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editedClassName }),
      });
    // Clear the state indicating an active class edit
    setEditingClassId(null);

      // Update the class in the state array and place it back at the original index
      setClasses((prevClasses) => {
        // Create a copy of the previous classes array using ...
        const updatedClasses = [...prevClasses];
        // Update the class object at the originalIndex with a new name
        updatedClasses[originalIndex] = {
          ...updatedClasses[originalIndex],
          name: editedClassName,
        }; // Update the name property with the new editedClassName
        return updatedClasses;
      });

      // Clear the original index
      setOriginalIndex(null);

    } catch (error) {
      console.error('Error editing class:', error);
    }
  };

  
  const handleDeleteClass = async (classId) => {
    try {
      //Send a DELETE request to the server to the delete the class with the given ID passed in the function
      await fetch(`http://localhost:3001/classes/${classId}`, {
        method: 'DELETE',
      });
      // Refresh the class list
      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="ClassList">
      <h2>Classes:</h2>
      <form
        className="create-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateClass();
        }}
      >
        <input
          type="text"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          placeholder="Enter class name"
          className="input-field"
        />
        <button type="submit" className="create-button">
          Create Class
        </button>
      </form>

      <ul className="class-list">
        {classes.map((classItem) => (
          <li key={classItem.id} className="class-item">
            {editingClassId === classItem.id ? (
              <>
                <input
                  type="text"
                  value={editedClassName}
                  onChange={(e) => setEditedClassName(e.target.value)}
                  className="edit-input"
                />
                <button
                  onClick={() => handleSaveEdit(classItem.id)}
                  className="save-button"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingClassId(null)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div className="class-info">
                  <span className="class-name">{classItem.name}</span>
                  <div className="class-actions">
                    <button
                      onClick={() => handleEditClass(classItem.id)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClass(classItem.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                    <Link
                      to={`/view-students/${classItem.id}`}
                      className="view-button"
                    >
                      View Students
                    </Link>
                  </div>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClassList;
