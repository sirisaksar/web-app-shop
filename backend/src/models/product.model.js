const pool = require("../config/db");

const getAllProducts = async () => {
  const [rows] = await pool.query(`
    SELECT
      p.id,
      p.name,
      p.price,
      p.stock,
      p.category_id,
      c.name AS category_name,
      p.created_at
    FROM products p
    LEFT JOIN categories c
      ON p.category_id = c.id
  `);

  return rows;
};

const getProductById = async (id) => {
  const [rows] = await pool.query(
    `SELECT * FROM products WHERE id = ?`,
    [id]
  );

  return rows[0];
};

const createProduct = async (data) => {
  const { name, price, stock, category_id } = data;

  const [result] = await pool.query(
    `
    INSERT INTO products
    (name, price, stock, category_id)
    VALUES (?, ?, ?, ?)
    `,
    [name, price, stock, category_id]
  );

  return result;
};

const updateProduct = async (id, data) => {
  const { name, price, stock, category_id } = data;

  const [result] = await pool.query(
    `
    UPDATE products
    SET
      name = ?,
      price = ?,
      stock = ?,
      category_id = ?
    WHERE id = ?
    `,
    [name, price, stock, category_id, id]
  );

  return result;
};

const deleteProduct = async (id) => {
  const [result] = await pool.query(
    `DELETE FROM products WHERE id = ?`,
    [id]
  );

  return result;
};

const reduceStock = async (id, quantity) => {
  const [result] = await pool.query(
    `
    UPDATE products
    SET stock = stock - ?
    WHERE id = ? AND stock >= ?
    `,
    [quantity, id, quantity]
  );

  return result; // จะส่งผลลัพธ์กลับไปเช็คได้ว่าตัดสำเร็จไหม
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  reduceStock
};