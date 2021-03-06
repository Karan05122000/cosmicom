const db = require('../db');
const ObjectId = require('bson-objectid');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const addProduct = async (req, res) => {
  try {
    const { id, usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );
    const { name, price, quantity, category_id, description } = req.body;
    if (usertype !== 'merchant') res.status(401).send('ACCESS DENIED');
    else {
      const result = await db.query(
        `INSERT INTO products (id,name,price,status,category_id,merchant_id,created_at,description,quantity) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
            ObjectId().toString(), 
            name, 
            price, 
            "Available", 
            category_id, 
            id, 
            new Date().toISOString().split('T')[0], 
            description,
            quantity
        ]
      );
      res.status(200).json('Product added successfully');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const editProduct = async (req, res) => {
  try {
    const { id, usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );
    const product_id = req.params.id;
    const { name, price, quantity, description } = req.body;
    if (usertype !== 'merchant') res.status(401).send('ACCESS DENIED');
    else {
      const result = await db.query(
        `UPDATE products 
                 SET name = '${name}',
                 price = '${price}',
                 status = 'Available',
                 description = '${description}',
                 quantity = '${quantity}'
                WHERE id = '${product_id}'
                AND merchant_id = '${id}'`
      );
      res.status(200).json(result);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id, usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );
    const product_id = req.params.id;
    if (usertype !== 'merchant') res.status(401).send('ACCESS DENIED');
    else {
      const result = await db.query(
        `DELETE FROM products
                WHERE id = '${product_id}'
                AND merchant_id = '${id}'`
      );
      if (result.rowCount === 0)
        res.status(422).send(`Product with id: ${product_id} not found`);
      else res.status(200).json(result);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
module.exports = {
  editProduct,
  deleteProduct,
  addProduct,
};
