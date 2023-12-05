# NodeJS Coding Challenge - All information

## Table of Contents
- [Introduction](#introduction)
- [Manufacturer Operations](#manufacturer-operations)
    - [Create Manufacturer](#create-manufacturer)
    - [Read Manufacturer](#read-manufacturer)
    - [Update Manufacturer](#update-manufacturer)
    - [Delete Manufacturer](#delete-manufacturer)
- [Equipment Operations](#equipment-operations)
    - [Create Equipment - With relation to Manufacturer](#create-equipment)
    - [Read Equipment](#read-equipment)
    - [Update Equipment](#update-equipment)
    - [Delete Equipment](#delete-equipment)

## Introduction

The application is Hosted on AWS EC2 Linux instance.
This README provides all the CRUL commands and JSON scripts where needeed to test and use the application.


## AWS EC2 App Check README

### Check AWS EC2 Public IP - 3.145.3.17

### Verify App on Port 3000 - [http://3.145.3.17:3000/](http://3.145.3.17:3000/)


## Manufacturer Operations
==========================

##  - Create Manufacturer

### Rest Endpoint
- **POST** - http://3.145.3.17:3000/manufacturer
- **JSON**
    ```json
    {
        "name": "Superman"
    }
    ```

### cURL Command
```bash
curl -X POST -H "Content-Type: application/json" -d "{\"name\": \"Superman\"}" http://3.145.3.17:3000/manufacturer
```

## - Get/View Manufacturer

- GET All - Rest Endpoint
    - **GET** - http://3.145.3.17:3000/manufacturer
### GET Manufacturer By ID - 
- **GET** - http://3.145.3.17:3000/manufacturer/{manufacturer_id}
    - Example - http://3.145.3.17:3000/manufacturer/78323c3b-015c-4791-be1f-931a119d64cf


### cURL Command
```bash
curl http://3.145.3.17:3000/manufacturer

curl http://3.145.3.17:3000/manufacturer/78323c3b-015c-4791-be1f-931a119d64cf
```

## - Update Manufacturer

### Rest Endpoint
- **PUT** - http://3.145.3.17:3000/manufacturer/{manufacturer_id}
- Example - http://3.145.3.17:3000/manufacturer/78323c3b-015c-4791-be1f-931a119d64cf
- **JSON**
    ```json
    {
        "name": "Spiderman"
    }
    ```

### cURL Command
```bash
curl -X PUT -H "Content-Type: application/json" -d "{\"name\": \"SpiderMan\"}" http://3.145.3.17:3000/manufacturer/fd169628-c28f-4308-8dfa-82a46bfe8f83
```


## - Delete Manufacturer

#### As required, If we delete a manufacturer that has equipments assigned, then along with the manufacturer all the equipments of the manufacturer will be deleted from the equipment table.
#### For this feature, I have used a clause  ***DELETE ON CASCADE*** clause in a foreign key constraint when creating the EQUIPMENT table. 
#### Specifically, when a row in the parent table(MANUFACTURER) is deleted, the ON DELETE CASCADE option will automatically delete all related rows in the child table (EQUIPMENT), preventing orphaned records.
- Rest Endpoint
    - **DELETE** - http://3.145.3.17:3000/manufacturer/{equipment_id}
    - Example - http://3.145.3.17:3000/manufacturer/78323c3b-015c-4791-be1f-931a119d64cf


### cURL Command
```bash
curl -X DELETE http://3.145.3.17:3000/manufacturer/{equipment_id}


curl -X DELETE http://3.145.3.17:3000/manufacturer/78323c3b-015c-4791-be1f-931a119d64cf

```


## Equipments Operations
==========================

##  - Create Equipment

### As given , we have to maintain the one-to-many realation between Manufacturers and Equipments.
### We can create a equipment with the associated manufacturer, that that will be stored with the manufacturer ID.
### And also, as every equipment should be unique , we can not put same name Equipments (It will show warning).

### Rest Endpoint
- **POST** - http://3.145.3.17:3000/manufacturer/equipments/{manufacturer ID}
- Example - http://3.145.3.17:3000/manufacturer/equipments/2c599b34-257f-4eb9-a46a-84d7cbf1ec32
- **JSON**
    ```json
    {
      "name": "Hammer",
      "serialNo": "00003R"
    }
    ```

### cURL Command
```bash
curl -X POST -H "Content-Type: application/json" -d "{\"name\": \"Hammer\", \"serialNo\": \"00003R\"}" http://3.145.3.17:3000/manufacturer/equipments/2c599b34-257f-4eb9-a46a-84d7cbf1ec32
```

## - Get/view Equipment


- GET All - Rest Endpoint
    - **GET** - http://3.145.3.17:3000/equipment/
### GET Equipment By ID - 
- **GET** - http://3.145.3.17:3000/equipment/{manufacturer_id}
    - Example - http://3.145.3.17:3000/equipment/5b12a028-47f2-40c6-b935-d92a0b628329


### cURL Command
```bash
curl http://3.145.3.17:3000/equipment

curl http://3.145.3.17:3000/equipment/78323c3b-015c-4791-be1f-931a119d64cf
```

## - Update Equipment

### Rest Endpoint
- **PUT** - http://3.145.3.17:3000/equipment/{equipment_id}
- Example -http://3.145.3.17:3000/equipment/5b12a028-47f2-40c6-b935-d92a0b628329
- **JSON**
    ```json
    {
      "name": "Long Swords",
      "serialNo": "000018"
    }

    ```

### cURL Command
```bash
curl -X PUT -H "Content-Type: application/json" -d "{\"name\": \"Triger claws\", \"serialNo\": \"000018\"}" http://3.145.3.17:3000/equipment/5b12a028-47f2-40c6-b935-d92a0b628329
```

## - Delete Equipment

### Rest Endpoint
- **DELETE** - http://3.145.3.17:3000/equipment/{equipment_id}
- Example -http://3.145.3.17:3000/equipment/748bc6d1-ef89-4b8a-afdd-584aa914db0d

### cURL Command
```bash
curl -X DELETE http://3.145.3.17:3000/equipment/748bc6d1-ef89-4b8a-afdd-584aa914db0d
```

## - Search equipments and Manufacturer 

### Search Equipment By Manufacturer- 
#### View all Equiments made by the searched manufacturer.
### Rest Endpoint
 - **GET** - http://3.145.3.17:3000/equipmentsbymanu/{Manufacturer_id}
 - Example - http://3.145.3.17:3000/equipmentsbymanu/2c599b34-257f-4eb9-a46a-84d7cbf1ec32
 
 ### cURL command
```bash
curl http://3.145.3.17:3000/equipmentsbymanu/2c599b34-257f-4eb9-a46a-84d7cbf1ec32
```

### Search manufacturer by Equipment