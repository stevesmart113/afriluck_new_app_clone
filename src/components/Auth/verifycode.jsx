import React, { useState } from "react";
import Subheader from "../subheader";
import Input from "../input";
import Button from "../button";
import Modal from "../modal";
import { useNavigate, useLocation, NavLink } from "react-router-dom";

const VerifyCodeScreen = () => {
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { phoneNumber, source } = location.state || {};
  const openModal = () => {
    setOpen(true);
  };

  const handleVerificationSuccess = () => {
    console.log("Source:", source);
    if (source === "forgotpassword") {
      navigate("/resetpassword");
    } else if (source === "signup") {
      navigate("/createpassword");
    } else {
      console.warn("Unexpected source:", source);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setCode(value);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen bg-[#F7F7F7] p-6">
      <Subheader title="Verify Code" />
      <div className="flex flex-col w-full lg:w-[40%] items-center justify-center  bg-white rounded-xl p-6 my-20 space-y-4">
        <img src="afriluck.svg" alt="afriluck" className="mb-6" />
        <p className="text-center text-base text-text-black mb-4">
          Enter verification code sent to{" "}
          <span className="font-semibold">{phoneNumber}</span> below
        </p>
        <div className="flex flex-col w-full max-w-md space-y-6">
          <Input
            type={"number"}
            placeholder={"Enter verification code"}
            className="bg-[#F5F5F7] input-md"
            value={code}
            onChange={handleCodeChange}
          />
          <NavLink
            to="/signup"
            className="text-base text-primary mb-4 text-center font-semibold"
          >
            Resend Code
          </NavLink>
          <div className="flex flex-col space-y-2">
            <Button
              label={"Verify Code"}
              className="bg-secondary text-primary"
              disabled={!code}
              onClick={openModal}
            />
          </div>
        </div>
      </div>
      <Modal
        isOpen={open}
        onSuccess={handleVerificationSuccess}
        type={"success"}
        title="Success"
        subtitle="Verification successful"
        buttonText="Okay"
        imageSrc="check.svg"
        imgBg={"#F6F6F6"}
      />
    </div>
  );
};

export default VerifyCodeScreen;
