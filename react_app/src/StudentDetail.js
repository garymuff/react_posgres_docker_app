import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './StudentDetail.module.css'; // Import the CSS file for styling

function StudentDetail() {
  const [student, setStudent] = useState(null);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

  const { studentId } = useParams();


  // Get the specific student whose ID is a parameter.
  const fetchStudentDetail = async () => {
    try {
      const response = await fetch(`http://localhost:3001/students/${studentId}`);
      const fetchedStudent = await response.json();
      setStudent(fetchedStudent);
    } catch (error) {
      console.error('Error fetching student detail:', error);
    }
  };

  // Get all the classes in the database.
  const fetchAvailableClasses = async () => {
    try {
      const response = await fetch('http://localhost:3001/classes');
      const fetchedClasses = await response.json();
      setAvailableClasses(fetchedClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    fetchStudentDetail();
    fetchAvailableClasses();
  }, [studentId]);

  const handleEnroll = async () => {
    if (selectedClass) {
      try {
        //select the student that has been selected and update the classId with the selectedClass 
        const response = await fetch(`http://localhost:3001/students/${studentId}/enroll`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ classId: selectedClass }),
        });


       // Refresh
        fetchStudentDetail();
        fetchAvailableClasses();
        
      } catch (error) {
        console.error('Error enrolling student:', error);
      }
    }
  };

  const handleDropClass = async (classId) => {
    try {
      // send drop request to this endpoint
      await fetch(`http://localhost:3001/students/${studentId}/drop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classId }),
      });
      //Refresh
      fetchStudentDetail();
    } catch (error) {
      console.error('Error dropping class:', error);
    }
  };

  return (
    <div className="content">
      <div className="container">
        <div className="StudentDetail">
          {student && (
            <>
              <h2>Student Name: {student.name}</h2>
              <h3>Classes Enrolled:</h3>
              <div className="class-info">
                <ul className="class-list">
                  {student.classes.map((classItem) => (
                    <li key={classItem.id} className="class-item">
                      <span className="class-name">{classItem.name}</span>
                      <button className="drop-button" onClick={() => handleDropClass(classItem.id)}>
                        Drop
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <h3>Enroll in a Class:</h3>
              <div className="enroll-section">
                <select className="class-dropdown" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                  <option value="">Select a class</option>
                  {availableClasses.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
                <button className="enroll-button" onClick={handleEnroll}>
                  Enroll
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDetail;
