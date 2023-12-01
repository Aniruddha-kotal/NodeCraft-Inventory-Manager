// productController.js
const { v4: uuidv4 } = require('uuid');
const client = require('./connection.js');

function getAllEquipments(req, res) {
    const query = `
        SELECT e.id, e.name AS equipment_name, e.serial_no, m.name AS manufacturer_name
        FROM equipment e
        JOIN manufacturer m ON e.manufacturer_id = m.id`;

    client.query(query, (err, result) => {
        if (!err) {
            res.send(result.rows);
        } else {
            console.error(err.message);
            res.status(500).send('Internal server error');
        }
    });
}


function getEquipmentById(req, res) {
    const equipmentId = req.params.id;
    
    const query = `
        SELECT e.id, e.name AS equipment_name, e.serial_no, m.name AS manufacturer_name
        FROM equipment e
        JOIN manufacturer m ON e.manufacturer_id = m.id
        WHERE e.id = $1`;

    client.query(query, [equipmentId], (err, result) => {
        if (!err) {
            if (result.rows.length > 0) {
                res.send(result.rows);
            } else {
                res.status(404).send(`No equipment with id: ${equipmentId}`);
            }
        } else {
            console.error(err.message);
            res.status(500).send('Internal server error');
        }
    });
}


function getEquimentByManufacturerId(req, res) {
    client.query(`SELECT * FROM equipment WHERE manufacturer_id = '${req.params.id}'`, (err, result) => {
        if(!err){
            if(result.rows.length > 0){
                res.send(result.rows);
            }else {
                res.status(400).send(`No equipment with id: ${req.params.id}`);
            }
        }
    });
    client.end;
}

function updateEquipment(req, res) {
    const equipmentId = req.params.id;
    const { name, serialNo } = req.body;
    const query = `
        UPDATE equipment
        SET name = $1, serial_no = $2
        WHERE id = $3`;

    client.query(query, [name, serialNo, equipmentId], (err, result) => {
        if (!err) {
            if (result.rowCount > 0) {
                res.send('Equipment updated successfully');
            } else {
                res.status(404).send(`No equipment with id: ${equipmentId}`);
            }
        } else {
            console.error(err.message);
            res.status(500).send('Internal server error');
        }
    });
}

async function deleteEquipment(req, res) {
    const equipmentId = req.params.id;

    try {
        const result = await client.query('DELETE FROM equipment WHERE id = $1', [equipmentId]);

        if (result.rowCount > 0) {
            res.send('Equipment successfully deleted'); 
        } else {
            res.status(404).json({ error: 'Equipment not found' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}







module.exports = {
    getAllEquipments,
    getEquipmentById,
    getEquimentByManufacturerId,
    updateEquipment,
    deleteEquipment
};
