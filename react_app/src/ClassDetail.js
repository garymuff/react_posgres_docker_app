import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ClassDetail.module.css'; // Import the CSS file for styling

function ClassDetail() {
  const [classDetail, setClassDetail] = useState(null);
  const { classId } = useParams();

  // Fetch the class based on the class ID passed through.
  const fetchClassDetail = async () => {
    try {
      const response = await fetch(`http://localhost:3001/classes/${classId}`);
      const fetchedClass = await response.json();
      setClassDetail(fetchedClass);
    } catch (error) {
      console.error('Error fetching class detail:', error);
    }
  };

  const handleGradeChange = async (studentId, newGrade) => {
    try {
      // Send a request to update the student's grade for the class on the server
      await fetch(`http://localhost:3001/classes/${classId}/students/${studentId}/grades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ grade: parseFloat(newGrade) || null }), // Convert to float or set to null if empty or invalid
      });

      // Update the student's grade locally in the state
      if (classDetail) {
        const updatedClassDetail = { ...classDetail };
        const studentIndex = updatedClassDetail.students.findIndex((s) => s.id === studentId);

        if (studentIndex !== -1) {
          updatedClassDetail.students[studentIndex].grade = parseFloat(newGrade) || null;
          setClassDetail(updatedClassDetail);
        }
      }
    } catch (error) {
      console.error('Error updating grade:', error);
    }
  };

  useEffect(() => {
    fetchClassDetail();
  }, [classId]);

  return (
    <div className="content">
      <div className="container">
        <div className="ClassDetail">
          {classDetail && (
            <>
              <div className="class-info">
                <h2><span className="info-label">Class Name:</span> {classDetail.name}</h2>
              </div>
              <h3>Students Enrolled:</h3>
              <ul className="student-list">
                {classDetail.students.map((student) => (
                  <li key={student.id} className="student-item">
                    <span className= "student-name">{student.name}</span>
                    <input
                      type="number"
                      placeholder="Enter grade"
                      value={student.grade || ''}
                      onChange={(e) => handleGradeChange(student.id, e.target.value)}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClassDetail;
