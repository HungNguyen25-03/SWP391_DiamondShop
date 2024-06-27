import React, { useEffect, useState } from "react";
import { danggiaos } from "../ListProduct";
import axios from "axios";
import { MainAPI } from "../../../../API";
import useAuth from "../../../../../hooks/useAuth";
import { formatVND } from "../../../../../utils/Format";
import { toast } from "react-toastify";

export default function CustomerDangGiao({ title }) {
  const [deliveredOrderList, setDeliveredOrderList] = useState([]);
  const { auth } = useAuth();
  const [showTrack, setShowTrack] = useState(null)

  useEffect(() => {
    axios
      .post(`${MainAPI}/order/get-order-by-user-id-delivered-status`, {
        user_id: auth.user.user_id,
      })
      .then((res) => {
        console.log(res);
        setDeliveredOrderList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const confirmOrder = (order_id) => {
    axios
      .put(
        `${MainAPI}/user/complete-order/${order_id}`,
        {},
        {
          headers: {
            "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handTrackOrder = (index) => {
    console.log(index)
    setShowTrack(showTrack === index ? null : index)
  };

  return (
    <div className={title === "Đang giao" ? "danggiao" : "fade"}>
      <h5 className="fw-bold">{title}</h5>
      {deliveredOrderList.length === 0 ? (
        <div className="emptyinfo">
          <img
            src={
              "https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/images%2Faccount%2Fdanggiao.png?alt=media&token=c31a1c88-3ed9-4d03-b8d5-daabd9cf7992"
            }
          />
          <p>
            Hiện tại chưa có đơn hàng <br />
            đang được giao
          </p>
        </div>
      ) : (
        deliveredOrderList.map((order, index) => {
          return (
            <>
              <div style={{ textAlign: "right" }}>
                <button
                  style={{
                    border: "none",
                    backgroundColor: "#00CCFF",
                    borderRadius: "10px",
                    color: "white",
                    padding: "10px",
                  }}
                  onClick={() => handTrackOrder(index)}
                >
                  Order Progress
                </button>
              </div>
              <div>
                {showTrack === index && <>
                  <div style={{ display: "flex" }}>
                    <span style={{ border: '1px solid #67b14e', borderRadius: '10px', backgroundColor: '#67b14e', padding: '3px', color: 'white' }}>Chờ thanh toán</span>&nbsp;&nbsp;
                    <span>------&#62;</span>&nbsp;&nbsp;
                    <span style={{ border: '1px solid #67b14e', borderRadius: '10px', backgroundColor: '#67b14e', padding: '3px', color: 'white' }}>Thanh Toán</span>&nbsp;&nbsp;
                    <span>------&#62;</span>&nbsp;&nbsp;
                    <span style={{ border: '1px solid #67b14e', borderRadius: '10px', backgroundColor: '#67b14e', padding: '3px', color: 'white' }}>Chờ giao</span>&nbsp;&nbsp;
                    <span>------&#62;</span>&nbsp;&nbsp;
                    <span style={{ border: '1px solid #67b14e', borderRadius: '10px', backgroundColor: '#67b14e', padding: '3px', color: 'white' }}>Đang giao</span>&nbsp;&nbsp;
                    <span>------&#62;</span>&nbsp;&nbsp;
                    <span>Đã giao</span>&nbsp;&nbsp;
                    <span>------&#62;</span>&nbsp;&nbsp;
                    <span>Đã Hủy</span>
                  </div>
                </>}
              </div>
              <div className="order">
                {order.products.map((product, index) => {
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
                        {order.products.length} sản phẩm
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
                        #{order.order_id}
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
                        {formatVND(order.total_amount)}
                      </span>
                    </span>
                  </span>

                  <span className="d-flex justify-content-end mt-3">
                    <button
                      className="btn btn-warning m-0"
                      onClick={() => {
                        confirmOrder(order.order_id);
                      }}
                    >
                      Đã nhận được hàng
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
