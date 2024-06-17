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

const {getOrderById}=require("../services/order.services");

const getOrderId= async (req,res)=>{
  try{
    const result =await getOrderId();
    if(result.success){
      res.json(result.order);

    }else{
      res.json({message:result.message});
    }

  }catch(error){
    console.log("Fail to get Order by ID");
  }
 
}

const {getCompleteStatus}=require("../services/order.services");
 const getOrderByCompleteStatus= async (req,res) =>{
  try {
    const result= await getCompleteStatus();
    if(result.success){
      res.json(result.order);

    }else {
      res.json({message:result.message});
    }
    
  } catch (error) {
    console.log("Fail to get Orders by Complete Status");
  }
 }



module.exports = {
  getOrder,
  getOrderById,
  getOrderByCompleteStatus
};
