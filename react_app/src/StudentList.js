import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StudentList.css';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editedStudentName, setEditedStudentName] = useState('');
  const [originalIndex, setOriginalIndex] = useState(null); 

  const fetchStudents = async () => {
    try {
      // send an asynchronus GET Request to the backend server
      const response = await fetch('http://localhost:3001/students');

      // Parse the JSON and store it in the students array.
      const fetchedStudents = await response.json();
      setStudents(fetchedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleCreateStudent = async () => {
    if (newStudentName) {
      //Send a POST request to the server for the students
      // Create the student with the student name IF the student exists.
      try {
        await fetch('http://localhost:3001/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newStudentName }),
        });
        // Clear the input field
        setNewStudentName('');
        // Refresh the student list
        fetchStudents();
      } catch (error) {
        console.error('Error creating student:', error);
      }
    }
  };

  const handleEditStudent = (studentId) => {
    // Find the student in the students array based on the provided studentId
    const studentToEdit = students.find((student) => student.id === studentId);

    // Set the state variables for editing the student
    setEditingStudentId(studentId); //Track the ID of the student being edited
    setEditedStudentName(studentToEdit.name); // Populate the edit field with the student's name
    setOriginalIndex(students.findIndex((student) => student.id === studentId)); // Capture the original index
  };

  const handleSaveEdit = async (studentId) => {
    try {
      await fetch(`http://localhost:3001/students/${studentId}?update=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editedStudentName }),
      });
      setEditingStudentId(null);

      //Maintain the original position
      // We are updating the name property of a specific student in the array by creating a new array  with the 
      // updated value using the functional update pattern.
      // The ... is done to avoid mutating the original state directly.
      // Take the original prevStudents array
      setStudents((prevStudents) => {
        const updatedStudents = [...prevStudents];
        updatedStudents[originalIndex] = {
          ...updatedStudents[originalIndex],
          name: editedStudentName,
        };
        return updatedStudents;
      });

      // Clear the original index
      setOriginalIndex(null);

    } catch (error) {
      console.error('Error editing student:', error);
    }
  };

  // Delete a student with the ID of the student given.
  const handleDeleteStudent = async (studentId) => {
    try {
      await fetch(`http://localhost:3001/students/${studentId}`, {
        method: 'DELETE',
      });
      // Refresh the student list
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="StudentList">
      <h2 className="list-heading">Students:</h2>
      <form
        className="create-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateStudent();
        }}
      >
        <input
          type="text"
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          placeholder="Enter student name"
          className="input-field"
        />
        <button type="submit" className="create-button">
          Create Student
        </button>
      </form>

      <ul className="student-list">
        {students.map((student) => (
          <li key={student.id} className="student-item">
            {editingStudentId === student.id ? (
              <>
                <input
                  type="text"
                  value={editedStudentName}
                  onChange={(e) => setEditedStudentName(e.target.value)}
                  className="edit-input"
                />
                <button
                  onClick={() => handleSaveEdit(student.id)}
                  className="save-button"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingStudentId(null)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div className="student-info">
                  <span className="student-name">{student.name}</span>
                  <div className="student-actions">
                    <button
                      onClick={() => handleEditStudent(student.id)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                    <Link
                      to={`/view-classes/${student.id}`}
                      className="view-button"
                    >
                      View Classes
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

export default StudentList;
