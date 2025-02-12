import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/myBetSearchbar";
import { OrbitProgress } from "react-loading-indicators";
import { useSelector } from "react-redux";

const Mybet = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  //const user = useSelector((state) => state.user.user);
  const user = useSelector((state) => state.user?.user);

  const memoizedUser = useMemo(() => {
      return user ? { ...user } : null;
    }, [user]);

  useEffect(() => {
    try {
      var token = null;
      if (memoizedUser) {
        token = memoizedUser.token;
      }
      const getMyBets = async () => {
        setLoading(true);
        console.log("Token => ", token);
        try {
          const res = await axios.get(
            "https://staging.afriluck.com/api/V1/app/my-bets",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          setLoading(false);
          console.log(res);

          if (res.status === 200) {
            setResults(res.data.success);
          }
        } catch (e) {
          setError("Oops, nothing to display here. Kindly log-in");
          setLoading(false);
          console.log(e);
        }
      };
      getMyBets();
    } catch (error) {
      try {
        setLoading(false);
        console.log(error);
        setError("Oops, nothing to display here. Kindly log-in");
      } catch (error) {
        console.log(error);
      }
    }
  }, [memoizedUser]);

  return (
    <>
      <div className="flex flex-col bg-[#F7F7F7] h-screen w-screen">
        <div className="">
          <SearchBar />
        </div>
        <div className="flex flex-col w-full mt-5">
          {results.map((result) => (
            <div className="bg-white rounded-lg h-auto m-5 p-3">
              <div className="flex flex-row w-auto">
                <span>
                  <img alt="afriluck" src="afriluck_lg.png" />
                </span>
                <div className="flex flex-col items-start text-gray-600 mb-2 font-sans text-wrap w-full ml-5">
                  <div className="flex flex-row font-semibold text-base">
                    <div className="mr-2">{result.draw_code},</div>
                    <div>{result.date}</div>
                  </div>
                  <div className="text-gray-600">{result.selected_numbers}</div>
                </div>
              </div>
              <hr />
              <div className="mt-2">
                <div class="flex justify-between w-full">
                  <div className="flex flex-row">
                    <div className="mr-2">
                      <img alt="share" src={"share.svg"} />{" "}
                    </div>
                    <div> Share</div>
                  </div>
                  <span>{result.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center h-screen">
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
        </div>
        {error && <p className="h-full text-wrap p-5 text-center">{error}</p>}
      </div>
    </>
  );
};

export default Mybet;
