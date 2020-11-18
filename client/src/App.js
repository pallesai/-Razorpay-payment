import React from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

function App() {
    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    async function displayRazorpay() {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        console.error("Result of displayRozerPay ", res);

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        const result = await axios.post("/payment/orders");

        console.error("Result of orders ", result);

        if (!result) {
            alert("Server error. Are you online?");
            return;
        }

        const { amount, id: order_id, currency } = result.data;

        const options = {
            key: "rzp_test_lB0leaI1WYsdoz", // Enter the Key ID generated from the Dashboard
            amount: amount.toString(),
            currency: currency,
            name: "Morning Basket India Llp",
            description: "Test Transaction",
            image: { logo },
            order_id: order_id,
            handler: async function (response) {
                console.error('Handler response ', response);
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };

                const result = await axios.post("/payment/success", data);

                alert(result.data.msg);
            },
            prefill: {
                name: "Nagarjuna",
                email: "morningbasketindiallp@gmail.com",
                contact: "9999999999",
            },
            notes: {
                address: "Mornring Basket",
            },
            theme: {
                color: "#61dafb",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>Buy React now!</p>
                <button className="App-link" onClick={displayRazorpay}>
                    Pay ₹500
                </button>
            </header>
        </div>
    );
}

export default App;
