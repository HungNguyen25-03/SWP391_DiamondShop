const { getAllOrder } = require("../services/order.services");

const getOrder = async (req, res) => {
  try {
    const result = await getAllOrder();
    if (result.success) {
      res.json(result.order);
    } else {
      res.json({ message: result.message });
    }
  } catch (error) {
    console.log("Faill to get Order");
  }
};

const { getOrderById } = require("../services/order.services");

const getOrderId = async (req, res) => {
  try {
    const result = await getOrderId();
    if (result.success) {
      res.json(result.order);
    } else {
      res.json({ message: result.message });
    }
  } catch (error) {
    console.log("Fail to get Order by ID");
  }
};

const { getCompleteStatus } = require("../services/order.services");
const getOrderByCompleteStatus = async (req, res) => {
  try {
    const result = await getCompleteStatus();
    if (result.success) {
      res.json(result.order);
    } else {
      res.json({ message: result.message });
    }
  } catch (error) {
    console.log("Fail to get Orders by Complete Status");
  }
};

const { getPendingStatus } = require("../services/order.services");
const getOrderByPendingStatus = async (req, res) => {
  try {
    const result = await getPendingStatus();
    if (result.success) {
      res.json(result.order);
    } else {
      res.json({ message: result.message });
    }
  } catch (error) {
    console.log("Fail to get Orders by Pending Status");
  }
};

const { getConfirmStatus } = require("../services/order.services");
const getOrderByConfirmStatus = async (req, res) => {
  try {
    const result = await getConfirmStatus();
    if (result.success) {
      res.json(result.order);
    } else {
      res.json({ message: result.message });
    }
  } catch (error) {
    console.log("Fail to get Orders by Pending Status");
  }
};

const { getDeliverStatus } = require("../services/order.services");
const getOrderByDeliveredStatus = async (req, res) => {
  try {
    const result = await getDeliverStatus();
    if (result.success) {
      res.json(result.order);
    } else {
      res.json({ message: result.message });
    }
  } catch (error) {
    console.log("Fail to get Orders by Delivered Status");
  }
};

const { getOrderByUserId } = require("../services/order.services");
const getOrderByUserIdController = async (req, res) => {
  try {
    const { user_id } = req.body;
    const result = await getOrderByUserId(user_id);
    if (result.success) {
      res.json(result.orders);
    } else {
      res.json({ message: result.message });
    }
  } catch (error) {
    console.log("Fail to get Orders by User ID");
  }
};

const { getOrderByUserIdConfirmStatus } = require("../services/order.services");
const getOrderByUserIdConfirmStatusController = async (req, res) => {
  try {
    const { user_id } = req.body;
    const result = await getOrderByUserIdConfirmStatus(user_id);
    if (result.success) {
      res.json(result.orders);
    } else {
      res.json({ message: result.message });
    }
  } catch (error) {
    console.log("Fail to get Orders by User ID");
  }
};

module.exports = {
  getOrder,
  getOrderById,
  getOrderByCompleteStatus,
  getOrderByPendingStatus,
  getOrderByConfirmStatus,
  getOrderByDeliveredStatus,
  getOrderByUserIdController,
  getOrderByUserIdConfirmStatusController,
};
