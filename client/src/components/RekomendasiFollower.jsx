import { useContext } from "react";
import { AllStateContext } from "../App";
import { api } from "../utils";
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";

export default function RekomendasiFollower() {
  const { allFollower, setFollower, follower } = useContext(AllStateContext);
  const user = useOutletContext()[0];
  useEffect(() => {
    if (follower.me && follower.to) {
      console.log(follower);

      postData();
    }
  }, [follower]);
  async function postData() {
    await api.post("/follower", follower);
  }
  return (
    <div className="h-screen flex  items-center w-[30%] sticky top-0">
      <div className="flex flex-col p-1 rounded-lg border-black border-[1px]">
        <h1 className="text-center font-bold border-black border-b-2">
          Rekomendasi Following
        </h1>
        <div className="h-max  w-full flex flex-col gap-5 ">
          {allFollower?.map((x, i) => (
            <span key={i} className="flex justify-between">
              <h3>{x.full_name} </h3>
              <button
                onClick={() => {
                  setFollower({
                    ...follower,
                    me: user?.id,
                    to: x.id,
                  });
                  console.log(follower);
                  // api.post("/follower", follower);
                }}
              >
                Follow
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
