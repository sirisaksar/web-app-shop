const ProductModel = require("../models/product.model");

const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.getAllProducts();

    res.status(200).json(products);
  } catch (error) {
  console.error("ERROR =>", error);

  res.status(500).json({
    message: error.message,
    stack: error.stack
  });
}
};

const getProduct = async (req, res) => {
  try {
    const product = await ProductModel.getProductById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);
  } catch (error) {
  console.error("ERROR =>", error);

  res.status(500).json({
    message: error.message,
    stack: error.stack
  });
}
};

const createProduct = async (req, res) => {
  try {
    const result = await ProductModel.createProduct(
      req.body
    );

    res.status(201).json({
      message: "Product created",
      id: result.insertId
    });
  } catch (error) {
  console.error("ERROR =>", error);

  res.status(500).json({
    message: error.message,
    stack: error.stack
  });
}
};

const updateProduct = async (req, res) => {
  try {
    await ProductModel.updateProduct(
      req.params.id,
      req.body
    );

    res.json({
      message: "Product updated"
    });
  } catch (error) {
  console.error("ERROR =>", error);

  res.status(500).json({
    message: error.message,
    stack: error.stack
  });
}
};

const deleteProduct = async (req, res) => {
  try {
    await ProductModel.deleteProduct(
      req.params.id
    );

    res.json({
      message: "Product deleted"
    });
  } catch (error) {
  console.error("ERROR =>", error);

  res.status(500).json({
    message: error.message,
    stack: error.stack
  });
}
};

const reduceStock = async (req, res) => {
  try {

    const result = await ProductModel.reduceStock(
      req.params.id,
      1
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "สินค้าไม่เพียงพอ"
      });
    }

    res.json({
      message: "ลด Stock สำเร็จ"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  reduceStock
};
