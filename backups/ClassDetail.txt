import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ClassDetail.module.css'; // Import the CSS file for styling

function ClassDetail() {
  const [classDetail, setClassDetail] = useState(null);
  const { classId } = useParams();

  // Fetch the class based of the class ID passed through.
  const fetchClassDetail = async () => {
    try {
      const response = await fetch(`http://localhost:3001/classes/${classId}`);
      const fetchedClass = await response.json();
      setClassDetail(fetchedClass);
    } catch (error) {
      console.error('Error fetching class detail:', error);
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
            {/*for each item in the list of students create a list object using map*/}
            {classDetail.students.map((student) => (
              <li key={student.id} className="student-item">{student.name}</li>
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
