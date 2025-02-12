import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./../output.css";
import { OrbitProgress } from "react-loading-indicators";
import Input from "../components/input";
import { ToastContainer, toast } from "react-toastify";
import Button from "../components/button";
import { useSelector, useDispatch } from "react-redux";
import { addTransactionData } from "../store/transactionSlice";

const SingleGamePayment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedNetwork, setSelectedNetwork] = useState([]);
  const [network, setNetwork] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidMobile, setIsValidMobile] = useState(false);

  //const numbers = localStorage.getItem("numbers");
  //const amount = localStorage.getItem("betAmount");
  //const game = localStorage.getItem("game");
  //const mobile = localStorage.getItem("mobileNumber");
  //const token = localStorage.getItem("token");
  //const game_type = localStorage.getItem("game_type");
  //const game_picked = localStorage.getItem("game_picked");

  //const user = useSelector((state) => state.user.user);
  const transaction =
    useSelector((state) => state.transaction?.transactions) || {};

  const user = useSelector((state) => state.user?.user);

  const memoizedUser = useMemo(() => {
    return user ? { ...user } : null;
  }, [user]);

  const amount = transaction.betAmount;
  const numbers = transaction.numbers;
  const game_type = transaction.type;
  const game_picked = transaction.typePicked;

  const getFormattedDate = () => {
    const date = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const day = days[date.getDay()];
    const dayOfMonth = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day} ${dayOfMonth}/${month}/${year}`;
  };

  const placeBet = async () => {
    setLoading(true);

    if (network === "" || (mobileNumber === "" && selectedNetwork !== 4)) {
      toast.error(
        network === ""
          ? "Kindly provide a channel"
          : mobileNumber === ""
          ? "Kindly provide a valid mobile number"
          : "Kindly provide a channel",
        {
          position: "top",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
        }
      );
      setLoading(false);
      return;
    }

    const formattedNumber = `233${Number(mobileNumber)}`;
    console.log("");
    
    const requestBody = {
      msisdn:
        selectedNetwork === 4 ? memoizedUser.phone_number : formattedNumber,
      total_amount: Number(amount),
      bet_type_code: transaction.game,
      bet_type: game_picked.toString().toLowerCase(),
      game: game_type === "6/57"? "657":game_type.toString().toLowerCase(),
      selected_numbers: numbers,
      channel: network,
      discounted_amount: "",
      use_wallet: selectedNetwork === 4 ? true : false,
      medium: "app",
    };

    console.log("Request Body => ", requestBody);

    try {
      const res = await axios.post(
        "https://staging.afriluck.com/api/V1/app/place-bet",
        requestBody
      );
      console.log(res.data);
      if (res.status === 200) {
        setLoading(false);

        dispatch(
          addTransactionData({
            numbers: transaction.numbers,
            betAmount: amount,
            game: transaction.game,
            type: transaction.type,
            typePicked: transaction.typePicked,
            movedPastPayment: true,
            mobileNumber: mobileNumber
          })
        );
        moveToCheckPaymentStatuds();
      }
      console.error("Error:", res);
    } catch (error) {
      try {
        const errorMessage = error.response.data.error;
        //const channelMessage = errorMessage.channel;
        console.error("Error:", errorMessage);

        toast.error(errorMessage, {
          position: "top",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    if (memoizedUser) {
      var mobile = String(memoizedUser.phone_number).substring(3, 13);
      setMobileNumber(`0${mobile}`);
      setIsValidMobile(true);
    }
  }, [memoizedUser]);

  console.log("Selected Network => ", selectedNetwork);

  const selectNetwork = (id) => {
    const selectedNetwork = networks.find((network) => network.id === id);
    setNetwork(selectedNetwork.desc);
    setSelectedNetwork(id);
  };

  const handleInputChange = (event) => {
    setMobileNumber(event.target.value);
    if (mobileNumber.toString().length >= 9) {
      setIsValidMobile(true);
      localStorage.setItem("mobileNumber", mobileNumber);
    } else {
      setIsValidMobile(false);
    }
  };

  const back = () => {
    navigate("/single_game_selection");
  };

  const moveToCheckPaymentStatuds = () => {
    navigate("/single_game_status");
  };

  const networks = [
    {
      id: 1,
      name: "MTN Momo",
      image: "mtn_momo.svg",
      desc: "mtn",
      placeholder: "MTN",
    },
    {
      id: 2,
      name: "Telecel Cash",
      image: "telecel_logo.svg",
      desc: "telecel",
      placeholder: "Telecel",
    },
    {
      id: 3,
      name: "AT Money",
      image: "AirtelTigo.svg",
      desc: "airteltigo",
      placeholder: "AT Money",
    },
    {
      id: 4,
      name: "Wallet",
      image: "afriluck_lg.png",
      desc: "airteltigo",
      placeholder: "Wallet",
    },
  ];

  return (
    <>
      <div className="w-screen h-screen p-5 bg-[#F7F7F7] flex flex-col">
        <div className="bg-gray-100 h-16 w-full p-5 rounded-lg">
          <div className="flex flex-row w-auto items-center">
            <div onClick={back}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </div>
            <div className="font-normal w-full text-xl font-Poppins justify-center items-center">
              <p className="flex justify-center items-center text-black">
                Payment
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center bg-white h-18 w-full p-5 rounded-tl-lg rounded-tr-lg mt-3">
          <span className="font-xs text-lg mb-2 text-black">
            <p>{game_type}</p>
            <p className="text-xs text-black">Draw 148</p>
          </span>
          <span className="font-normal text-sm font-Poppins ml-auto text-black">
            {getFormattedDate()}
          </span>
        </div>
        <div
          className="bg-white h-auto w-full rounded-bl-lg rounded-br-lg"
          style={{ backgroundColor: "#E4F5F6" }}
        >
          <div className="flex flex-col text-gray-800 justify-center items-center p-3">
            <p className="font-Poppins text-sm mb-2">
              <p>You will be charged</p>
            </p>
            <p className="font-bold text-xl">{`GHS ${amount}.00`}</p>
          </div>
        </div>
        <div className="flex flex-col bg-white h-auto w-full p-5 rounded-lg mt-5">
          <span>
            <p className="font-md font-normal mb-5">Select Channel</p>
          </span>
          <div className="flex flex-row flex-auto flex-wrap justify-center items-center">
            {networks
              .filter((network) => !(memoizedUser === null && network.id === 4))
              .map((network) => (
                <div
                  key={network.id}
                  className="flex flex-col bg-gray-100 h-24 w-24 p-2 mr-2 justify-center items-center rounded-lg mb-2 focus:outline-none ripple"
                  onClick={() => selectNetwork(network.id)}
                  style={{
                    border:
                      selectedNetwork === network.id
                        ? "2px solid #3DB6BC"
                        : "0px solid gray",
                    backgroundColor:
                      selectedNetwork === network.id ? "#F6FCFD" : "#F7F7F7",
                    fontWeight:
                      selectedNetwork === network.id ? "bold" : "normal",
                  }}
                >
                  <img
                    className="flex mb-2 w-auto"
                    src={network.image}
                    alt={network.placeholder}
                  />
                  <p className="flex w-full justify-center items-center">
                    <p className="flex text-xs w-full justify-center items-center text-black">
                      {network.name}
                    </p>
                  </p>
                </div>
              ))}
          </div>
          <div className="mt-10">
            <div>
              {selectedNetwork !== 4 ? (
                <p className="mb-5">Enter phone number</p>
              ) : (
                <p></p>
              )}
              {selectedNetwork !== 4 ? (
                <Input
                  type={"number"}
                  placeholder={"020 000 0000"}
                  icon={"ghana.svg"}
                  className="bg-[#F5F5F7] input-md focus:outline-none text-black"
                  value={mobileNumber}
                  onChange={handleInputChange}
                />
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap w-full h-auto justify-center items-center">
          {loading ? (
            <OrbitProgress
              color="#000"
              size="small"
              text="loading"
              textColor=""
            />
          ) : (
            <p></p>
          )}
          <ToastContainer />
        </div>
      </div>
      <footer className="bg-gray-100 flex flex-row flex-wrap w-full mb-5 justify-center items-center">
        <Button
          label={`Pay GHS ${amount}.00`}
          disabled={
            !network ||
            !isValidMobile ||
            (!mobileNumber && selectedNetwork !== 4)
          }
          onClick={placeBet}
          className="font-bold rounded-lg w-11/12 h-16 bg-primary text-white text-base"
        />
      </footer>
    </>
  );
};

export default SingleGamePayment;
