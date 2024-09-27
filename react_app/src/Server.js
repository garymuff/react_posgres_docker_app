// Name: Rohan Chopra
// Date: 8/23/23
// This is the many server file that implements the prisma client to connect to the database and respond back
// with all CRUD operations.
// It implements RESTful APIs to manipulate students and classes.

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');


// Create the Prisma Client and Express to make fetching and receiving from URLs easier
const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

// Routes

// Fetch all students
app.get('/students', async (req, res) => {
  const students = await prisma.student.findMany();
  res.json(students);
});

// Fetch student by ID
// use the findUnique to uniquely identify the student based on the constraint of the studentID
// Return a JSON object containing id, name and classes. 
app.get('/students/:id', async (req, res) => {
  const studentId = parseInt(req.params.id);

  try {
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      include: {
        classes: true,
      },
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      id: student.id,
      name: student.name,
      classes: student.classes,
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// get all the classes 
app.get('/classes', async (req, res) => {
  const classes = await prisma.class.findMany();
  res.json(classes);
});

// Find a class based off of the ID.
// Use the findUnique to uniquely identify the 
// class based on the constraint of the classId.
// Return a JSON object containing id, name and students. 
app.get('/classes/:id', async (req, res) => {
  const classId = parseInt(req.params.id);

  try {
    const classInfo = await prisma.class.findUnique({
      where: {
        id: classId,
      },
      include: {
        students: true,
      },
    });

    if (!classInfo) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({
      id: classInfo.id,
      name: classInfo.name,
      students: classInfo.students,
    });
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// CREATE OPERATIONS

// CREATE A STUDENT
app.post('/students', async (req, res) => {
  const { name } = req.body;
  const createdStudent = await prisma.student.create({
    data: {
      name,
    },
  });
  res.json(createdStudent);
});


// This will be called when the edit function is called in the front end
// It will perform an update to a student based on the ID 
// if the request has a update parameter set to true.
// It will change the name data for the particular student.
app.post('/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  
  if (req.query.update === 'true') {
    // Handle the update operation here
    await prisma.student.update({ 
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });
    res.json({ message: 'Student updated successfully' });
  } 
});

// Update student grade for a class
app.post('/classes/:classId/students/:studentId/grades', async (req, res) => {
  const { classId, studentId } = req.params;
  const { grade } = req.body;

  try {
    // Find the student by ID and update their grade for the specified class
    const updatedStudent = await prisma.student.update({
      where: {
        id: parseInt(studentId),
      },
      data: {
        classes: {
          update: {
            where: {
              classId_studentId: {
                classId: parseInt(classId),
                studentId: parseInt(studentId),
              },
            },
            data: {
              grade: parseFloat(grade) || null,
            },
          },
        },
      },
    });

    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student grade:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Enroll a student in a class
// Modifies the _classToStudent Table in the database.

app.post('/students/:studentId/enroll', async (req, res) => {
  const { studentId } = req.params;
  const { classId } = req.body;

  try {
    const enrollment = await prisma.student.update({
      where: {
        id: parseInt(studentId),
      },
      data: {
        classes: {
          connect: {
            id: parseInt(classId),
          },
        },
      },
    });

    res.json(enrollment);
  } catch (error) {
    console.error('Error enrolling student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//Drop a class from a students class list
//Disconnect deletes the corresponding row from the _classToStudent table.

app.post('/students/:studentId/drop', async (req, res) => {
  const { studentId } = req.params;
  const { classId } = req.body;

  try {
    const dropResult = await prisma.student.update({
      where: {
        id: parseInt(studentId),
      },
      data: {
        classes: {
          disconnect: {
            id: parseInt(classId),
          },
        },
      },
    });

    res.json(dropResult);
  } catch (error) {
    console.error('Error dropping class:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// Create a class
app.post('/classes', async (req, res) => {
  const { name } = req.body;
  const createdClass = await prisma.class.create({
    data: {
      name,
    },
  });
  res.json(createdClass);
});
 
// Update class name for the given id
// When the query parameter update = true.
app.post('/classes/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  
  if (req.query.update === 'true') {
    // Handle the update operation here
    await prisma.class.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });
    res.json({ message: 'Class updated successfully' });
  } 
});


// Delete a student given the id 
app.delete('/students/:id', async (req, res) => {
  const studentId = parseInt(req.params.id);
  await prisma.student.delete({
    where: {
      id: studentId,
    },
  });
  res.json({ message: 'Student deleted successfully' });
});

// Delete a class given the classID
app.delete('/classes/:id', async (req, res) => {
  const classId = parseInt(req.params.id);
  await prisma.class.delete({
    where: {
      id: classId,
    },
  });
  res.json({ message: 'Class deleted successfully' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
