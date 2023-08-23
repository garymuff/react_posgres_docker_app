import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ClassList() {
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [editingClassId, setEditingClassId] = useState(null);
  const [editedClassName, setEditedClassName] = useState('');

  const fetchClasses = async () => {
    try {
      const response = await fetch('http://localhost:3001/classes');
      const fetchedClasses = await response.json();
      setClasses(fetchedClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

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
        setNewClassName('');
        // Refresh the class list
        fetchClasses();
      } catch (error) {
        console.error('Error creating class:', error);
      }
    }
  };

  const handleEditClass = (classId) => {
    setEditingClassId(classId);
    const classToEdit = classes.find((classItem) => classItem.id === classId);
    setEditedClassName(classToEdit.name);
  };

  const handleSaveEdit = async (classId) => {
    try {
      await fetch(`http://localhost:3001/classes/${classId}?update=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editedClassName }),
      });
      setEditingClassId(null);
      // Refresh the class list
      fetchClasses();
    } catch (error) {
      console.error('Error editing class:', error);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
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
      {/* Form to create a class */}
      <form
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
        />
        <button type="submit">Create Class</button>
      </form>

      {/* List of classes with edit, save, and delete buttons */}
      <ul>
        {classes.map((classItem) => (
          <li key={classItem.id}>
            {editingClassId === classItem.id ? (
              <>
                <input
                  type="text"
                  value={editedClassName}
                  onChange={(e) => setEditedClassName(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(classItem.id)}>Save</button>
                <button onClick={() => setEditingClassId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {classItem.name}
                <button onClick={() => handleEditClass(classItem.id)}>Edit</button>
                <Link to={`/view-students/${classItem.id}`}> 
                  <button>View Students</button>
                </Link>
                
                <button onClick={() => handleDeleteClass(classItem.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClassList;
