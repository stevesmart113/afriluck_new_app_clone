import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./../output.css";
import Input from "../components/input";
import Button from "../components/button";
import { useDispatch } from "react-redux";
import { addTransactionData } from "../store/transactionSlice";

const SingleGame = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedGame, setSelectedGame] = useState([]);

  const [betAmount, setBetAmount] = useState(0);
  // const [numbers, setNumbers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [valuesArray, setValuesArray] = useState([]);
  const [val, setVal] = useState([]);
  //const [total, setTotal] = useState(0);

  console.log(disabled);
  console.log(valuesArray);

  const type = localStorage.getItem("game_type");
  const type_picked = localStorage.getItem("game_picked");

  const increment = () => {
    setBetAmount((prev) => {
      if (type_picked === "Mega") {
        const newAmount = prev + 5 > 20 ? 20 : prev + 5;
        return newAmount === 15 ? newAmount + 5 : newAmount;
      } else if (type_picked === "Direct") {
        return prev + 1 > 20 ? 20 : prev + 1;
      } else if (type_picked === "Banker") {
        return prev + 56 > 200000000 ? 200000000 : prev + 56;
      } else if (type_picked === "Perm") {
        const amt = prev + 1 > 20 ? 20 : prev + 1;
        return amt;
      }
      return prev;
    });
  };

  const decrement = async (type) => {
    setBetAmount((prev) => {
      if (type_picked === "Mega") {
        const newAmount = prev - 5 > 20 ? 20 : prev - 5;
        return newAmount === 15
          ? Math.max(newAmount - 5, 0)
          : Math.max(newAmount, 0);
      } else if (type_picked === "Direct") {
        const newAmount = prev - 1 < 1 ? 1 : prev - 1;
        return newAmount;
      } else if (type_picked === "Banker") {
        return prev - 56 > 200000000 ? 200000000 : prev - 56;
      } else if (type_picked === "Perm") {
        const newAmount = prev - 1 < 1 ? 1 : prev - 1;
        return newAmount;
      }
      return prev;
    });
  };

  console.log("type => ", type);
  console.log("type picked => ", type_picked);

  const ranges = [
    { min: 3, max: 15, game: 1 },
    { min: 4, max: 10, game: 2 },
    { min: 5, max: 8, game: 3 },
    { min: 7, max: 8, game: 5 },
  ];

  const direct = [
    { id: 1, game: "Direct 1", imageUrl: "direct-1-logo.png" },
    { id: 2, game: "Direct 2", imageUrl: "direct-2-logo.png" },
    { id: 3, game: "Direct 3", imageUrl: "direct-3-logo.png" },
    { id: 4, game: "Direct 4", imageUrl: "direct-4-logo.png" },
    { id: 5, game: "Direct 5", imageUrl: "direct-5-logo.png" },
    { id: 6, game: "Direct 6", imageUrl: "direct-6-logo.png" },
  ];

  const perm = [
    { id: 1, game: "Perm 2", imageUrl: "perm-2-logo.png" },
    { id: 2, game: "Perm 3", imageUrl: "perm-3-logo.png" },
    { id: 3, game: "Perm 4", imageUrl: "perm-4-logo.png" },
    //{ id: 4, game: "Perm 5", imageUrl: "perm-5-logo.png" },
    { id: 5, game: "Perm 6", imageUrl: "perm-6-logo.png" },
  ];

  const selectGame = (id) => {
    // console.log("Game Id => ", id);
    setSelectedGame(id);
  };

  // const handleInputAmountChange = (event) => {
  //   setBetAmount(event.target.value);
  // };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const parts = value
      .split(/[-/ ]+/)
      .map((part) => part.trim())
      .filter((part) => part !== "");

    if (type_picked === "Mega") {
      if (parts.length < 0 || parts.length > 6) {
        setError("Input length should contain a maxium of six characters");
        return;
      } else {
        setDisabled(false);
      }
    } else if (type_picked === "Direct") {
      setDisabled(false);
    } else {
      setDisabled(false);
    }

    setVal(parts);
    setValuesArray((prevArray) => [...prevArray, ...parts]);
    setInputValue(value);
    setError("");
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = parseInt(value, 10);
    console.log("Value : ", numericValue);

    if (type_picked === "Mega") {
      if (!value || [5, 10, 20].includes(numericValue)) {
        setBetAmount(value === "" ? "" : numericValue);
        setError("");
      } else {
        setBetAmount(value);
        setError("Allowed values for Mega are 5, 10, or 20.");
      }
    } else if (type_picked === "Direct") {
      if (
        !value ||
        Array.from({ length: 20 }, (_, i) => i + 1).includes(numericValue)
      ) {
        setBetAmount(value === "" ? "" : numericValue);
        setError("");
      } else {
        setBetAmount(value);
        setError("Allowed values for Direct are 1 to 20");
      }
    } else {
      const value = e.target.value.replace(/[^0-9]/g, "");
      setBetAmount(value === "" ? 0 : parseInt(value, 10));
    }
  };

  const back = () => {
    navigate("/");
  };

  const determineGame = (selectedGame, type) => {
    if (type === "Direct") {
      return Number(selectedGame);
    } else if (type === "Perm") {
      return Number(selectedGame) + 1;
    }else if (type === "Mega") {
      return 1;
    }else if (type === "Banker") {
      return 2;
    }
  };

  function isValidValue(value) {
    const current = ranges.filter(
      (range) => range.game === Number(selectedGame)
    );
    return current.some((range) => value >= range.min && value <= range.max);
  }

  function getRange(value) {
    return ranges.filter((range) => range.game === Number(selectedGame));
  }

  const placeBet = () => {
    if (error !== "") {
      return;
    }

    const permValidation = isValidValue(val.length);
    const range = getRange(val.length);

    const megaValidation =
      val.length >= 6 &&
      type_picked === "Mega" &&
      Number(betAmount) > 0 &&
      !val.some((item) => Number(item) > 57);
    const directValidation =
      val.length === selectedGame &&
      type_picked === "Direct" &&
      Number(betAmount) > 0 &&
      !val.some((item) => Number(item) > 57);

    const bankerValidation =
      val.length === 1 &&
      type_picked === "Banker" &&
      Number(betAmount) > 0 &&
      !val.some((item) => Number(item) > 57);

    if (
      megaValidation ||
      directValidation ||
      bankerValidation ||
      permValidation
    ) {
      const transaction = {
        numbers: inputValue,
        betAmount: betAmount,
        game: determineGame(selectedGame, type_picked),
        type: type,
        typePicked: type_picked,
        movedPastPayment: false,
      };
      dispatch(addTransactionData(transaction));
      navigate("/single_game_selection");
    } else {
      if (!permValidation && type_picked === "Perm") {
        setError(
          `Selected Perm numbers has to be between ${range[0].min} and ${range[0].max}`
        );
      } else {
        setError(
          "Kindly verify if the game, amount or numbers selected meets the required length."
        );
      }
    }
  };

  // const handlePaymentScreen = () => {
  //   navigate("/single_game_payment");
  // };
  return (
    <>
      <div className="h-full flex flex-col bg-[#F7F7F7] w-screen p-5">
        <div className="bg-[#F7F7F7] h-auto rounded-lg mb-5 ">
          <div className="flex justify-center items-center ml-2">
            <div onClick={back} className="w-auto">
              <FontAwesomeIcon icon={faChevronLeft} />
            </div>
            <div className="flex flex-wrap justify-center items-center w-screen font-Poppins text-xl">
              <p className="flex justify-start items-start text-black">
                {type}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white h-auto p-5 rounded-lg flex flex-col justify-center items-center">
          <div className="flex flex-col justify-start items-start w-full mb-5">
            {/* <span className="font-semibold text-md mb-5 font-Poppins">
              Draw 148
            </span> */}
            {/* <span className="font-normal text-sm font-Poppins">
              Mon 17/10/2024 10:00
            </span> */}
          </div>
          {type_picked === "Direct" ? (
            <div className="flex flex-wrap justify-center items-center">
              {direct
                .filter(
                  (game) =>
                    !(
                      ((type === "Anopa" || type === "Midday") &&
                        (game.id === 5 || game.id === 6)) ||
                      (type === "6/57" && game.id === 5)
                    )
                )
                .map((game) => (
                  <div
                    key={game.id}
                    className="flex flex-wrap bg-gray-100 h-24 w-24 justify-center items-center m-1 rounded-md"
                    onClick={() => selectGame(game.id)}
                    style={{
                      border:
                        selectedGame === game.id
                          ? "3px solid #3DB6BC"
                          : "0px solid gray",
                      backgroundColor:
                        selectedGame === game.id ? "#F6FCFD" : "#F7F7F7",
                      fontWeight: selectedGame === game.id ? "bold" : "normal",
                    }}
                  >
                    <p className="flex flex-col text-black font-Poppins w-full justify-center items-center p-2">
                      <img
                        alt="logo"
                        src={game.imageUrl}
                        className="h-10 w-16"
                      />
                      {/* {game.game} */}
                    </p>
                  </div>
                ))}
            </div>
          ) : type_picked === "Perm" ? (
            <div className="flex flex-wrap justify-center items-center">
              {perm
                .filter(
                  (game) =>
                    !(
                      (type === "Anopa" || type === "Midday") &&
                      game.id === 4
                    ) ||
                    (type === "6/57" && game.id === 4)
                )
                .map((game) => (
                  <div
                    key={game.id}
                    className="flex bg-gray-100 h-24 w-24 justify-center items-center m-1 rounded-md"
                    onClick={() => selectGame(game.id)}
                    style={{
                      border:
                        selectedGame === game.id
                          ? "2px solid #156064"
                          : "0px solid gray",
                      backgroundColor:
                        selectedGame === game.id ? "#F6FCFD" : "#F7F7F7",
                      fontWeight: selectedGame === game.id ? "bold" : "normal",
                    }}
                  >
                    <p className="flex text-black font-Poppins justify-center items-center w-full">
                      <img
                        alt="logo"
                        src={game.imageUrl}
                        className="h-10 w-16"
                      />
                      {/* {game.game} */}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-500 font-Poppins">
                {type_picked === "Mega" ? (
                  <p>
                    Kindly select 6 numbers between 1 & 57 seperated by a dash
                  </p>
                ) : (
                  <p>Kindly select a number between 1 & 57</p>
                )}
              </p>
            </div>
          )}
        </div>
        <div className="bg-white h-28 w-full p-5 rounded-lg mt-5">
          <p>Selections</p>
          <div>
            <Input
              type={"text"}
              placeholder={`${
                selectedGame === ""
                  ? `Please select a number`
                  : `Please pick ${selectedGame} numbers between 1 to 57`
              }`}
              className={`${
                error === ""
                  ? `bg-[#F5F5F7] input-md text-black text-sm`
                  : `bg-[#F5F5F7] input-md border-pink-500 text-pink-600 text-sm`
              }`}
              value={inputValue}
              onChange={handleInputChange}
            />
            {error && (
              <p className="text-rose-500 h-auto w-full text-sm">{error}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center bg-[#F7F7F7]">
        <div className="flex flex-row w-screen h-auto bg-white rounded-lg p-5 m-5">
          <div className="flex justify-start items-start flex-col flex-wrap mr-5 w-full">
            <p className="font-normal text-sm font-Poppins text-gray-400">
              Bet Amount
            </p>
            <p className="flex flex-row font-bold text-sm">
              <button
                onClick={decrement}
                className="flex justify-center items-center bg-gray-300 hover:bg-red-700 text-black h-auto w-10 rounded-xl mr-1 text-sm"
              >
                -
              </button>
              <button
                value={betAmount}
                onChange={handleAmountChange}
                className="flex justify-center items-center bg-gray-300 hover:bg-red-700 text-black h-auto w-10 rounded-xl font-bold mr-1 text-xl"
              >
                {betAmount}
              </button>
              <button
                onClick={increment}
                className="flex justify-center items-center bg-gray-300 hover:bg-red-700 text-black h-auto w-10 rounded-xl font-normal text-sm"
              >
                +
              </button>
            </p>
          </div>
          <div className="flex flex-wrap flex-col justify-end w-full">
            <p className="font-normal h-auto w-auto text-sm text-gray-400">
              Total Amount
            </p>
            <p className="font-bold h-auto w-auto text-xl text-black">
              <p>
                {" "}
                GHS{" "}
                <input
                  onChange={handleAmountChange}
                  className="w-16 border-2 border-black rounded-lg pl-2"
                  value={betAmount}
                />
              </p>
            </p>
          </div>
        </div>
        <footer className="flex flex-wrap justify-center items-center w-screen">
          <Button
            label={"Confirm"}
            disabled={!betAmount || !inputValue || error !== ""}
            onClick={placeBet}
            className="font-bold rounded-lg w-11/12 h-16 bg-primary text-white mb-5 text-base"
          />
        </footer>
      </div>
    </>
  );
};

export default SingleGame;
