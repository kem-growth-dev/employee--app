const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Para mabasa ang index.html

// Path para sa database file natin
const DATA_FILE = path.join(__dirname, 'employees.json');

// Helper function para basahin ang data mula sa file
function getEmployees() {
    if (!fs.existsSync(DATA_FILE)) {
        // Kung wala pang file, gagawa siya ng bagong empty JSON file
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    try {
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Helper function para i-save ang data sa file
function saveEmployees(employees) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(employees, null, 2));
}

// GET API: Kunin lahat ng employees
app.get('/api/employees', (req, res) => {
    const employees = getEmployees();
    res.json(employees);
});

// POST API: Magdagdag ng bagong employee at i-save agad sa file
app.post('/api/employees', (req, res) => {
    const employees = getEmployees();
    const newEmployee = {
        id: Date.now(),
        fullName: req.body.fullName,
        birthday: req.body.birthday,
        gender: req.body.gender,
        email: req.body.email,
        status: req.body.status
    };

    employees.push(newEmployee);
    saveEmployees(employees); // Permanenteng naka-save dito!

    res.status(201).json(newEmployee);
});

// Simulan ang server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// DELETE API: Magbura ng employee gamit ang ID
app.delete('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    let employees = getEmployees();
    
    // Filter para alisin 'yung employee na tumugma ang ID
    employees = employees.filter(emp => emp.id != id);
    
    saveEmployees(employees);
    res.json({ message: 'Employee deleted successfully' });
});

