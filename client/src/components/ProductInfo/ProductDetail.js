import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductInfo from "./Detail/ProductInfo";
import InfoDetail from "./DetailOfProduct/InfoDetail";
import HeaderPage from "../../utils/Header/Header";
import Rate from "./Rate/Rate";
import FooterPage from "../../utils/Footer/FooterPage";

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState();
  const [dataProduct, setDataProduct] = useState();
  const [cus, setCus] = useState();

  useEffect(() => {
    fetch(`http://127.0.0.1:1880/product/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  useEffect(() => {
    fetch(`http://127.0.0.1:1880/detail/${id}`)
      .then((res) => res.json())
      .then((data) => setDataProduct(data));
  }, [id]);

  useEffect(() => {
    fetch(`http://127.0.0.1:1880/customer`)
      .then((res) => res.json())
      .then((data) => setCus(data));
  }, []);

  return (
    <div>
      <HeaderPage />
      {product && <ProductInfo product={product} />}
      {dataProduct && <InfoDetail dataProduct={dataProduct} />}
      {cus && <Rate cus={cus} />}
      <FooterPage />
    </div>
  );
}
