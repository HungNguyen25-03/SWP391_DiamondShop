import React, { useEffect, useState } from "react";
import { formatVND } from "../../../../../utils/Format";
import { ToastContainer, toast } from "react-toastify";
import { MainAPI } from "../../../../API";
import axios from "axios";
import useAuth from "../../../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function ChoThanhToan({ title }) {
  const [pendingOrderList, setPendingOrderList] = useState([]);
  const { auth } = useAuth();
  const nav = useNavigate()

  const token = JSON.parse(localStorage.getItem("accessToken"));
  console.log(token);

  useEffect(() => {
    axios
      .post(`${MainAPI}/order/get-order-by-user-id-pending-status`, {
        user_id: auth.user.user_id,
      })
      .then((res) => {
        // console.log(res.data);
        setPendingOrderList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handTrackOrder = (id) => {
    console.log(id)
    nav(`/trackorder/${id}`)
  };

  return (
    <div className={title === "Chờ thanh toán" ? "chothanhtoan" : "fade"}>
      <h5 className="fw-bold">{title}</h5>
      <ToastContainer />
      {pendingOrderList.length === 0 ? (
        <div className="emptyinfo">
          <img
            src={
              "https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/images%2Faccount%2Fchogiao.png?alt=media&token=8580382f-7bc6-477f-a95e-38b3a06eb189"
            }
          />
          <p>
            Hiện chưa có đơn hàng nào <br />
            đang chờ được thanh toán
          </p>
        </div>
      ) : (
        pendingOrderList.map((dagiao, index) => {
          return (
            <>
              <div className="order">
                <div style={{ textAlign: "right" }}>
                  <button
                    style={{
                      border: "none",
                      backgroundColor: "#00CCFF",
                      borderRadius: "10px",
                      color: "white",
                      padding: "10px",
                    }}
                    onClick={() => handTrackOrder(dagiao.order_id)}
                  >
                    Order Progress
                  </button>
                </div>
                {dagiao.products.map((product, index) => {
                  return (
                    <>
                      <div className="tab-content">
                        <div key={index} className="cart-product-line d-flex ">
                          <div className="product-img">
                            <img src={product.image_url} alt="1" />
                          </div>
                          <div className="product-info w-100">
                            <div className="item-cart-product-name">
                              {product.product_name}
                            </div>
                            <div className="d-flex w-100 align-center product-info-bottom">
                              <span style={{ width: 600 }}></span>
                              <div className="item-cart-quantity-pro">
                                x{product.quantity}
                              </div>
                              <div className="item-cart-price-pro mr-0 ">
                                {formatVND(product.price)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
                <div className="px-20 container font-13 mt-20 color-20 pb-20 line-height-13 border-top-f2 block-end">
                  <span className="d-flex w-100  align-center justify-content-between">
                    <span className="w-50">
                      <span className="color-20">Có </span>
                      <span className="font-bold font-15 line-height-15 color-20">
                        {dagiao.products.length} sản phẩm
                      </span>
                    </span>
                    <span
                      className=" d-flex justify-content-between align-items-end"
                      style={{ width: 180 }}
                    >
                      <span>Tiền tích lũy</span>
                      <span className="font-bold font-15 line-height-15 cc-pink-primary">
                        100000đ
                      </span>
                    </span>
                  </span>

                  <span className="d-flex align-center align-items-end w-100 justify-content-between">
                    <span className="w-50 align-items-end d-flex">
                      <span>Mã đơn </span>
                      <span className="font-bold font-15 d-inline-flex align-items-end color-20">
                        #{dagiao.order_id}
                      </span>
                    </span>
                    <span className=" d-flex  align-items-end  justify-content position-relative color-20 font-13">
                      <span
                        className=" d-flex  align-items-end  justify-content position-relative color-20 font-13"
                        style={{ width: 115 }}
                      >
                        Thành tiền
                      </span>
                      <span className="font-bold font-15 line-height-15 color-20">
                        {formatVND(dagiao.total_amount)}
                      </span>
                    </span>
                  </span>

                  <span className="d-flex justify-content-end mt-3">
                    <button
                      className="btn btn-warning m-0"
                    //   onClick={() => {
                    //     confirmOrder(dagiao.order_id);
                    //   }}
                    >
                      Thanh toán
                    </button>
                  </span>
                </div>
              </div>
            </>
          );
        })
      )}
    </div>
  );
}
