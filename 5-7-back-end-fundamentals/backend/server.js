// server/server.js
import express from 'express';
const app = express();

// --- fundamentals middleware ---
app.use(express.json()); // parse JSON request bodies

// allow the Vite dev server (different port) to call this API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// --- in-memory data (no DB) ---
let students = [
  { id: 1, name: 'Aisha' },
  { id: 2, name: 'Hasan' }
];

// Helper function to find student by ID
const findStudentById = (id) => students.find(student => student.id === id);

// --- routes ---
// Get all students
app.get('/api/students', (req, res) => {
  res.json(students);
});

// Get single student by ID
app.get('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid student ID' });
  }
  
  const student = findStudentById(id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  res.json(student);
});

// Create a new student
app.post('/api/students', (req, res) => {
  const { name } = req.body || {};
  
  // Input validation
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  const newStudent = { 
    id: Date.now(), 
    name: name.trim() 
  };
  
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// Update an existing student
app.put('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body || {};
  
  // Input validation
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid student ID' });
  }
  
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  const studentIndex = students.findIndex(s => s.id === id);
  if (studentIndex === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  const updatedStudent = { ...students[studentIndex], name: name.trim() };
  students[studentIndex] = updatedStudent;
  
  res.json(updatedStudent);
});

// Delete a student
app.delete('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid student ID' });
  }
  
  const studentIndex = students.findIndex(s => s.id === id);
  if (studentIndex === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  const deletedStudent = students.splice(studentIndex, 1)[0];
  res.json({ message: 'Student deleted', student: deletedStudent });
});

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// --- start server ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ API running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log(`  GET    http://localhost:${PORT}/api/students`);
  console.log(`  GET    http://localhost:${PORT}/api/students/:id`);
  console.log(`  POST   http://localhost:${PORT}/api/students`);
  console.log(`  PUT    http://localhost:${PORT}/api/students/:id`);
  console.log(`  DELETE http://localhost:${PORT}/api/students/:id`);
});
