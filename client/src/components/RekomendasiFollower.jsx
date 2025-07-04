import { useContext } from "react";
import { AllStateContext } from "../App";
import { api } from "../utils";
import { useOutletContext } from "react-router-dom";

export default function RekomendasiFollower() {
  const { allFollower, setAllFollower, setFollower } =
    useContext(AllStateContext);
  const user = useOutletContext()[0];

  return (
    <div className="h-screen flex items-center justify-center sticky top-0 p-6">
      {allFollower.length > 0 && (
        <div className="bg-green-50 rounded-lg shadow-lg border border-gray-200 w-full max-w-md p-6">
          <h1 className="text-center font-bold text-xl text-gray-800 mb-4">
            Rekomendasi Following
          </h1>

          <div className="space-y-5">
            {allFollower?.map((follower, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm hover:bg-gray-50 transition gap-1"
              >
                <h3 className="font-medium text-gray-700">{follower.full_name}</h3>
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
                      setFollower({});
                    });
                  }}
                  className="bg-[#52c41a] text-white px-5 py-2 rounded-md hover:bg-teal-600 transition"
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
