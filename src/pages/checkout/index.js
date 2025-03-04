import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  createCashOrderForUser,
} from "../../functions/user";
import { toast } from "react-toastify";
import "react-quill/dist/quill.snow.css";

const Checkout = ({ history }) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);

  const dispatch = useDispatch();
  const { user, PH } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      console.log("user cart res", JSON.stringify(res.data, null, 4));
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, [user.token]);

  const emptyCart = () => {
    // remove from local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    // remove from redux
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    // remove from backend
    emptyUserCart(user.token).then((res) => {
      setProducts([]);
      setTotal(0);
      toast.success("Your cart is empty. Continue shopping for gifts!");
    });
  };

  const saveAddressToDb = () => {
    // console.log(address);
    saveUserAddress({
      address,
      authtoken: user.token,
      contactName,
      contactNumber,
      city,
      state,
      postalCode,
    }).then((res) => {
      if (res?.data?.ok) {
        setAddressSaved(true);
        toast.success("Address saved");
      }
    });
  };

  const showAddress = () => (
    <>
      <div className="form-group">
        <span>Complete Address</span>
        <input
          type="text"
          className="form-control"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address, apt, space, floor, bld."
          autoFocus
        />
      </div>
      <div className="form-group">
        <span>Contact Name</span>
        <input
          type="text"
          className="form-control"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          placeholder="Enter last name, first Name, middle initial"
          autoFocus
        />
      </div>
      <div className="form-group">
        <span>Contact Number</span>
        <input
          type="text"
          className="form-control"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder="Enter your contact number"
          autoFocus
        />
      </div>
      <div className="form-group">
        <span>City</span>
        <input
          type="text"
          className="form-control"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter your city"
          autoFocus
        />
      </div>
      <div className="form-group">
        <span>State</span>
        <input
          type="text"
          className="form-control"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="Enter your state"
          autoFocus
        />
      </div>
      <div className="form-group">
        <span>Postal Code</span>
        <input
          type="text"
          className="form-control"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="Enter your Postal Code"
          autoFocus
        />
      </div>
      <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
        Save
      </button>
    </>
  );

  const showProductSummary = () =>
    products.map((p, i) => (
      <div key={i}>
        <p>
          {p.product.title} x {p.count} = ₱ {p.product.price * p.count}
        </p>
      </div>
    ));

  const createCashOrder = () => {
    createCashOrderForUser(user.token, PH).then((res) => {
      console.log("USER CASH ORDER CREATED RES ", res);
      // empty cart form redux, local Storage, reset coupon, reset COD, redirect
      if (res.data.ok) {
        // empty local storage
        if (typeof window !== "undefined") localStorage.removeItem("cart");
        // empty redux cart
        dispatch({
          type: "ADD_TO_CART",
          payload: [],
        });
        // empty redux COD
        dispatch({
          type: "PH",
          payload: false,
        });
        // mepty cart from backend
        emptyUserCart(user.token);
        // redirect
        setTimeout(() => {
          history.push("/user/history");
        }, 1000);
      }
    });
  };

  return (
    <div
      className="container-fluid pt-5 bg-primary"
      style={{ minHeight: "100vh" }}
    >
      <div className="row">
        <div className="col-md-6">
          <h4>Delivery Address</h4>
          <br />
          <br />
          {showAddress()}
          <hr />
        </div>

        <div className="col-md-6">
          <h4>Order Summary</h4>
          <hr />
          <hr />
          <p>Products {products.length}</p>
          <hr />
          {showProductSummary()}
          <hr />
          <p>Cart Total: ₱{total}</p>

          <div className="row">
            <div className="col-md-6">
              {PH ? (
                <button
                  className="btn btn-primary"
                  // disabled={!addressSaved || !products.length}
                  onClick={createCashOrder}
                  disabled
                >
                  Place Order
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  // disabled={!addressSaved || !products.length}
                  onClick={() => history.push("/payment")}
                  disabled
                >
                  Place Order
                </button>
              )}
            </div>

            <div className="col-md-6">
              <button
                disabled={!products.length}
                onClick={emptyCart}
                className="btn btn-primary"
              >
                Empty Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
