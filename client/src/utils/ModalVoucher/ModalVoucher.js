import React from "react";
import "./ModalVoucher.scss";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { MainAPI } from "../../components/API";
import useAuth from "../../hooks/useAuth";

export default function ModalVoucher({
  closeModal,
  listOfVoucher,
  isUsedVoucher,
}) {
  const { auth } = useAuth();
  const handleApplyVoucher = (e) => {
    axios
      .post(
        `${MainAPI}/user/apply-voucher`,
        {
          user_id: auth.user.user_id,
          voucher_id: e.target.value,
        },
        {
          headers: {
            "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        isUsedVoucher();
        closeModal();
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.errors[0].message);
      });
  };

  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container") {
          closeModal();
        }
      }}
    >
      <div className="modal-content">
        <ToastContainer autoClose={2000} />
        <h3 className="d-flex justify-content-start">Voucher của bạn</h3>
        {listOfVoucher.map((voucher) => (
          <div
            key={voucher.code}
            style={{
              textAlign: "center",
              // background: "red",
              padding: "5px 0",
              fontSize: "20px",
            }}
            className="each-slide"
          >
            <div className="first-part">
              <p className="fw-bold">{voucher.discount}%</p>
            </div>

            <div className="second-part">
              <p style={{ fontSize: "15px" }} className="fw-bold">
                Tất cả sản phẩm
              </p>
              <p style={{ fontSize: "13px" }}>{voucher.code}</p>
              <div className="d-flex justify-content-between">
                <span style={{ fontSize: "13px" }}>
                  HSD:{voucher.expiration_date}
                </span>
                <button
                  className="btn btn-danger fw-bold px-4 "
                  style={{
                    borderRadius: "20px",
                    color: "white",
                    backgroundColor: "#ff0064",
                  }}
                  value={voucher.voucher_id}
                  onClick={handleApplyVoucher}
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
