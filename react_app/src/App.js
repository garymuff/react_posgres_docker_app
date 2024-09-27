// App.js
// Name: Rohan Chopra
// Date: 08/23/2023
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentList from './StudentList';
import ClassList from './ClassList';
import ClassDetail from './ClassDetail';
import StudentDetail from './StudentDetail';
import './App.css'   


// Different modes of the application, 
const modes = {
  STUDENT_LIST: 'studentList',
  CLASS_LIST: 'classList', 
};

// Main component to wrap the entire application
// Sets tabs for each of the student list and class list views
// Keep Track of Current state of the applcation, start with the student list state.

function AppWrapper() {
    const [currentMode, setCurrentMode] = useState(modes.STUDENT_LIST);
  
    // Handle the tab click, switch between the modes 
    const handleTabClick = (mode) => {
      setCurrentMode(mode);
    };
  
    return (
      <div>
        {/* Tab to switch between modes*/}
        <div className="tabs">
            {/* student list button, leads to the view that displays list of students and ability to add student*/}
          <button
            className={currentMode === modes.STUDENT_LIST ? 'active' : ''}
            onClick={() => handleTabClick(modes.STUDENT_LIST)}
          >
            Student List
          </button>
          {/* Class list button, leads to the view that displays list of classes and ability to add classes*/ }
          <button
            className={currentMode === modes.CLASS_LIST ? 'active' : ''}
            onClick={() => handleTabClick(modes.CLASS_LIST)}
          >
            Class List
          </button>
        </div>
        <div className="content">
          {currentMode === modes.STUDENT_LIST && <StudentList />}
          {currentMode === modes.CLASS_LIST && <ClassList />}
        </div>
      </div>
    );
  }

function App() {
  return (
    <Router>
      <Routes>

        {/*When the app loads, then the default view will be the app wrapper.*/}
        <Route path="/" element={<AppWrapper />} />

        {/* If the user clicks on the link, view classes, then the website will route to 
            the student detail page*/}
        <Route path="/view-classes/:studentId" element={<StudentDetail />} />

       {/* If the user clicks on the link, view students, then the website will route to 
            the class detail page*/}
        <Route path="/view-students/:classId" element={<ClassDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
