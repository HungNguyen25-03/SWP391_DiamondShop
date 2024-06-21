import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import "./Header.scss";
import axios from "axios";
import { MainAPI } from "../../components/API";
import AuthContext from "../../context/AuthProvider";
import { ToastContainer, toast } from "react-toastify";
import useOrder from "../../hooks/useOrder";

export default function HeaderPage() {
  const [searchValue, setSearchValue] = useState("");
  const { setAuth } = useContext(AuthContext);
  const { setOrderInfomation } = useOrder();
  const token = JSON.parse(localStorage.getItem("accessToken"));
  const nav = useNavigate();

  const handleLogout = () => {
    axios
      .post(`${MainAPI}/user/logout`, token, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        console.log(res.data);
        localStorage.removeItem("accessToken");
        setAuth({});
        setOrderInfomation({});
        toast.success("Đăng xuất thành công");
        nav("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    axios
      .get(`${MainAPI}/product/search`, { searchTerm: searchValue })
      .then((res) => {
        console.log(res.data);
        // nav("/search", { searchResult: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className=" search-bar">
      <ToastContainer autoClose={2000} />
      <div className="container">
        <div className="row justify-content-between align-items-center">
          <div
            className="logo col-3"
            onClick={() => {
              nav("/home");
            }}
          >
            <img src="https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/images%2Flogo.png?alt=media&token=608fc814-b3d6-463b-845b-3c64b92cc563" />
          </div>

          <div className="search col-6">
            <form className="d-flex" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Hôm nay bạn muốn mua gì?"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button type="submit" className="btn" name="submit-search">
                Tìm kiếm
              </button>
            </form>
          </div>

          <div className="other_header d-flex align-center justify-content-space col-3">
            <Link to="/cart" className="acc">
              <div className="acc_icon">
                <FaShoppingCart />
              </div>
              <div className="detail">Giỏ hàng</div>
            </Link>
            <Link to="/customer-account" className="acc">
              <div className="acc_icon">
                <FaUser />
              </div>
              <div className="detail">Tài khoản</div>
            </Link>
            {token ? (
              <div className="acc" onClick={handleLogout}>
                <div className="acc_icon">
                  <FaUser />
                </div>
                <div className="detail">Đăng xuất</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
