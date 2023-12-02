require('dotenv').config()

const express = require('express')
const equipmentsController = require('./equipmentsController.js');
const { v4: uuidv4 } = require('uuid');
const client = require('./connection.js')
const app = express();
const port = process.env.PORT || 3000;

// Parse JSON-encoded bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// CRUD for Equipments -------------

app.get('/equipment', equipmentsController.getAllEquipments);
app.get('/equipment/:id', equipmentsController.getEquipmentById);
app.get('/equipmentsbymanu/:id', equipmentsController.getEquimentByManufacturerId);
app.put('/equipment/:id', equipmentsController.updateEquipment);
app.delete('/equipment/:id', equipmentsController.deleteEquipment);

app.listen(port, () => console.log(`app listening on port ${port}`));

client.connect();

app.get("/", (req, res) => {
    res.send("Hello , This project is created by Aniruddha Kotal ---- Finally done");
})


app.get('/manufacturer', (req, res)=>{
    client.query(`Select * from manufacturer`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})


app.get('/manufacturer/:id', (req, res)=>{
    client.query(`Select * from manufacturer where id='${req.params.id}'`, (err, result)=>{
        if(!err){
            if (result.rows.length > 0) {
                res.send(result.rows);
            } else {
                res.status(404).send(`No user with id: ${req.params.id}`);
            }
        }
    });
    client.end;
})


app.post('/manufacturer', (req, res)=> {
    const user = req.body;
    const userId = uuidv4();
    let insertQuery = `insert into manufacturer(id, name) 
                       values('${userId}', '${user.name}')`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Insertion was successful')
        }
        else{ console.log(err.message)
            res.status(500).send('Internal server Error');
        }
    })
    client.end;
})

app.put('/manufacturer/:id', (req, res)=> {
    let user = req.body;
    let updateQuery = `update manufacturer
                       set name = '${user.name}'
                       where id = '${req.params.id}'`

    client.query(updateQuery, (err, result)=>{
        if(!err){
            res.send('Update was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})

// app.delete('/manufacturer/:id', (req, res)=> {
//     let insertQuery = `delete from manufacturer where id='${req.params.id}'`

//     client.query(insertQuery, (err, result)=>{
//         if(!err){
//             res.send('Deletion was successful')
//         }
//         else{ console.log(err.message) }
//     })
//     client.end;
// })

app.delete('/manufacturer/:id', async (req, res) => {
    const manufacturerId = req.params.id;

    try {
        // Delete the manufacturer, and the ON DELETE CASCADE will take care of related equipment
        const result = await client.query('DELETE FROM manufacturer WHERE id = $1', [manufacturerId]);

        if (result.rowCount > 0) {
            res.status(204).send(); // No content (successful deletion)
        } else {
            res.status(404).json({ error: 'Manufacturer not found' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// -----------GET EQUIPMENTS WITH THE MANUFACTURER ID --------------


app.get('/manufacturer/:id/equipments', (req, res) => {
    const manufacturerId = req.params.id;

    const query = `
        SELECT e.id, e.name AS equipment_name, e.serial_no, m.name AS manufacturer_name
        FROM equipment e
        JOIN manufacturer m ON e.manufacturer_id = m.id
        WHERE e.manufacturer_id = '${manufacturerId}'`;

    client.query(query, (err, result) => {
        if (!err) {
            res.send(result.rows);
        } else {
            console.error(err.message);
            res.status(500).send('Internal server error');
        }
    });
});

// -------------------Assign equipments to the manufacturers------------//



// app.post('/manufacturer/:id/equipments', (req, res) => {
//     const { name, serialNo } = req.body;
//     const equipmentId = uuidv4();
//     const manufacturerId = req.params.id;

//     const insertQuery = `INSERT INTO equipment(id, name, serial_no, manufacturer_id) 
//                          VALUES ('${equipmentId}', '${name}', '${serialNo}', '${manufacturerId}')`;

//     client.query(insertQuery, (err, result) => {
//         if (!err) {
//             res.send('Equipment insertion was successful');
//         } else {
//             console.error(err.message);
//             res.status(500).send('Internal server error');
//         }
//     })
//     client.end;
//     // Note: Do not use client.end here; connection pooling will handle it.
// })

app.post('/manufacturer/equipments/:id', async (req, res) => {
    const { name, serialNo } = req.body;
    const manufacturerId = req.params.id;

    // Check if equipment with the same name already exists.
    const checkQuery = `
        SELECT id FROM equipment 
        WHERE  name = '${name}'`;

    try {
        const checkResult = await client.query(checkQuery);

        if (checkResult.rows.length > 0) {
            res.status(400).json({ error: 'Equipment with the same name is alreay assinged to a manufacturer.' });
            return;
        }

        // If not exists, insert the equipment
        const equipmentId = uuidv4();
        const insertQuery = `
            INSERT INTO equipment(id, name, serial_no, manufacturer_id) 
            VALUES ('${equipmentId}', '${name}', '${serialNo}', '${manufacturerId}')`;

        await client.query(insertQuery);
        res.status(201).json({ message: 'Equipment insertion was successful' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

