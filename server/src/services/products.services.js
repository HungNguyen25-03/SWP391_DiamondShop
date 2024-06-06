const { poolPromise } = require("./database.services");

async function getAllProduct() {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`SELECT 

    Products.product_id,
    Products.product_name,
    Products.price,
    Products.stock,
    Category.category_name

    FROM Products
    
    JOIN Category 

    ON Products.category_id=Category.category_id
    `);
    const product = result.recordset;

    if (product) {
      return { success: true, product };
    } else {
      return { success: false, message: "Fail to show all Products" };
    }
  } catch (error) {
    throw error;
  }
}

async function getProductById(product_id){
  try {
   const pool = await  poolPromise;
         const result = await pool
         .request()
         .query(
          `SELECT * FROM Products WHERE product_id='${product_id}'`
         );
       const product = result.recordset;
       if(product){
         return { success: true, product };
       } else {
         return { success: false, message: "Invalid ID product" };
       }
  } catch (error) {
   throw error;
  }
 }



module.exports = {
  getAllProduct,
  getProductById
};
