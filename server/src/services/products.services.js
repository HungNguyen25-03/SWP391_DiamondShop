const { poolPromise, sql } = require("./database.services");

async function getAllProduct(page, pageSize) {
  try {
    const pool = await poolPromise;
    const offset = (page - 1) * pageSize;

    // Query to get the total count of products
    const countResult = await pool
      .request()
      .query("SELECT COUNT(*) as total FROM Products");
    const totalProducts = countResult.recordset[0].total;

    // Query to get the paginated products
    const result = await pool.request().query(`
      SELECT * FROM Products
      ORDER BY product_id
      OFFSET ${offset} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY
    `);
    const products = result.recordset;

    if (products) {
      const inStockProducts = products.filter((product) => product.stock > 0);
      const outOfStockProducts = products.filter(
        (product) => product.stock <= 0
      );
      return { inStockProducts, outOfStockProducts, totalProducts };
    } else {
      throw new Error("Failed to retrieve products.");
    }
  } catch (error) {
    throw error;
  }
}

async function getAllProductWihoutPagination() {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`SELECT * FROM Products`);
    const products = result.recordset;

    if (products) {
      const inStockProducts = products.filter((product) => product.stock > 0);
      const outOfStockProducts = products.filter(
        (product) => product.stock <= 0
      );
      return { inStockProducts, outOfStockProducts };
    } else {
      throw new Error("Failed to retrieve products.");
    }
  } catch (error) {
    throw error;
  }
}

async function getProductById(product_id) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query(`SELECT * FROM Products WHERE product_id='${product_id}'`);
    const product = result.recordset;
    if (product) {
      return { success: true, product };
    } else {
      return { success: false, message: "Invalid ID product" };
    }
  } catch (error) {
    throw error;
  }
}

async function searchProductByName(searchTerm, page, pageSize) {
  try {
    const pool = await poolPromise;
    const offset = (page - 1) * pageSize;

    // Query to get the total count of products matching the search term
    const countResult = await pool
      .request()
      .input("searchTerm", sql.VarChar, `%${searchTerm}%`).query(`
      SELECT COUNT(*) as total FROM Products WHERE product_name LIKE @searchTerm
    `);
    const totalProducts = countResult.recordset[0].total;

    // Query to get the paginated products matching the search term
    const result = await pool
      .request()
      .input("searchTerm", sql.VarChar, `%${searchTerm}%`).query(`
      SELECT * FROM Products
      WHERE product_name LIKE @searchTerm
      ORDER BY product_id
      OFFSET ${offset} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY
    `);
    const products = result.recordset;

    if (products) {
      const inStockProducts = products.filter((product) => product.stock > 0);
      const outOfStockProducts = products.filter(
        (product) => product.stock <= 0
      );
      return { inStockProducts, outOfStockProducts, totalProducts };
    } else {
      throw new Error("Failed to retrieve products.");
    }
  } catch (error) {
    console.error("Error searching for products", error);
    throw error;
  }
}

async function filterProduct(ageRange, brand, country, page, pageSize) {
  try {
    const pool = await poolPromise;
    const request = pool.request();
    const offset = (page - 1) * pageSize;

    let filters = [];

    if (ageRange && ageRange.length > 0) {
      request.input("ageRange", sql.NVarChar, ageRange.join(","));
      filters.push(
        "p.age_range IN (SELECT value FROM STRING_SPLIT(@ageRange, ','))"
      );
    }

    if (brand && brand.length > 0) {
      request.input("brand", sql.NVarChar, brand.join(","));
      filters.push(
        "b.brand_name IN (SELECT value FROM STRING_SPLIT(@brand, ','))"
      );
    }

    if (country && country.length > 0) {
      request.input("country", sql.NVarChar, country.join(","));
      filters.push(
        "oc.country_name IN (SELECT value FROM STRING_SPLIT(@country, ','))"
      );
    }

    // Query to get the total count of products matching the filters
    let countQuery = `
      SELECT COUNT(*) as total
      FROM Products p
      LEFT JOIN Brands b ON p.brand_id = b.brand_id
      LEFT JOIN Originated_Country oc ON p.country_id = oc.country_id
    `;
    if (filters.length > 0) {
      countQuery += " WHERE " + filters.join(" AND ");
    }
    const countResult = await request.query(countQuery);
    const totalProducts = countResult.recordset[0].total;

    // Query to get the paginated products matching the filters
    let query = `
      SELECT 
        p.product_id,
        p.product_name,
        p.description,
        p.price,
        p.stock,
        b.brand_name,
        oc.country_name,
        p.age_range,
        p.image_url
      FROM Products p
      LEFT JOIN Brands b ON p.brand_id = b.brand_id
      LEFT JOIN Originated_Country oc ON p.country_id = oc.country_id
    `;
    if (filters.length > 0) {
      query += " WHERE " + filters.join(" AND ");
    }
    query += `
      ORDER BY p.product_id
      OFFSET ${offset} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY
    `;
    const result = await request.query(query);
    const products = result.recordset;

    if (products.length > 0) {
      const inStockProducts = products.filter((product) => product.stock > 0);
      const outOfStockProducts = products.filter(
        (product) => product.stock <= 0
      );
      return {
        success: true,
        inStockProducts,
        outOfStockProducts,
        totalProducts,
      };
    } else {
      return { success: false, message: "No products found" };
    }
  } catch (error) {
    console.error("Error filtering products", error);
    throw error;
  }
}

module.exports = {
  getAllProduct,
  getProductById,
  searchProductByName,
  filterProduct,
  getAllProductWihoutPagination,
};
