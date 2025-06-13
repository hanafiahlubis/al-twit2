import { useContext } from "react";
import { AllStateContext } from "../App";
import { api } from "../utils";
import { useOutletContext } from "react-router-dom";

export default function RekomendasiFollower() {
  const { allFollower, setAllFollower, setFollower } =
    useContext(AllStateContext);
  const user = useOutletContext()[0];

  return (
    <div className="h-screen flex  items-center w-[30%] sticky top-0">
      {allFollower.length > 0 && (

        <div className="flex flex-col p-1 rounded-lg border-black border-[1px]">
          <h1 className="text-center font-bold border-black border-b-2">
            Rekomendasi Following
          </h1>

          <div className="h-max  w-full flex flex-col gap-5 ">
            {allFollower?.map((follower, i) => (
              <span key={i} className="flex justify-between">
                <h3>{follower.full_name} </h3>
                <button
                  onClick={async () => {
                    await api.post("/follower", {
                      ...follower,
                      me: user?.id,
                      to: follower.id,
                    });
                    api.get("/posting").then(() => {
                      setAllFollower(
                        allFollower.filter((f) => f.id !== follower.id)
                      );
                      console.log(allFollower);

                      setFollower({});
                    });
                    // api.post("/follower", follower);
                  }}
                >
                  Follow
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
