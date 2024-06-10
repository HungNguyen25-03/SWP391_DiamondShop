const { poolPromise, sql } = require("./database.services");

async function loginUser(email, password) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query(
        `SELECT * FROM Users WHERE email = '${email}' AND password = '${password}' AND status = 1`
      );
    const user = result.recordset[0];

    if (user) {
      return { success: true, user };
    } else {
      return { success: false, message: "Invalid Email or password" };
    }
  } catch (error) {
    // console.log("Error logging", error);
    throw error;
  }
}

async function registerUser(username, password, email) {
  try {
    const pool = await poolPromise;
    //insert new user
    await pool.request().query(
      `INSERT INTO Users (username, password, email, role_id) VALUES 
        ('${username}', '${password}', '${email}', 'customer' )`
    );

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    throw error;
  }
}

async function applyVoucher(user_id, voucher_id) {
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input('user_id', sql.Int, user_id)
      .input('voucher_id', sql.Int, voucher_id)
      .query(
        `UPDATE User_Vouchers SET used = 1 WHERE user_id = @user_id AND voucher_id = @voucher_id`
      );

    return { success: true, message: "Voucher applied successfully" };
  } catch (error) {
    throw error;
  }
}

async function showAllVoucher() {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`SELECT * FROM Vouchers`);
    const vouchers = result.recordset;
    if (vouchers) {
      return { success: true, vouchers: vouchers };
    } else {
      return { success: false, message: "Fail to show vouchers" };
    }
  } catch (error) {
    throw error;
  }
}

async function getVoucherByUserId(user_id) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
    SELECT v.discount, v.expiration_date, uv.used FROM Vouchers v JOIN 
    User_Vouchers uv ON v.voucher_id = uv.voucher_id WHERE uv.user_id = ${user_id} AND uv.used = 0`);
    const vouchers = result.recordset;
    if (vouchers) {
      return { success: true, vouchers: vouchers };
    } else {
      return { success: false, message: "Fail to show vouchers" };
    }
  } catch (error) {
    throw error;
  }
}

async function claimVoucher(user_id, voucher_id) {
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .query(
        `INSERT INTO User_Vouchers (user_id, voucher_id) VALUES ('${user_id}', '${voucher_id}')`
      );
    return { success: true, message: "Voucher claimed successfully" };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  loginUser,
  registerUser,
  applyVoucher,
  showAllVoucher,
  getVoucherByUserId,
  claimVoucher,
};
