import { Input, Modal } from "antd"; // Import Input from Ant Design
import { Link, useNavigate } from "react-router-dom";
import { api2 } from "../../utils";
import { useState, useRef } from "react";
import Rubric from "../../components/Rubric";

export default function Forgout() {
  const [forgout, setForgout] = useState({});
  const [openPassword, setOpenPassword] = useState(false);
  const temp = useRef(0);
  const navigate = useNavigate();

  const onFinish = async (e) => {
    e.preventDefault();

    try {
      if (temp.current === 1) {
        const response = await api2("/login/forgout", "PUT", forgout);

        if (response.success) {
          const modal = Modal.success({
            title: "Success",
            content: "Berhasil Mengubah Sandi",
            style: {
              top: "10px",
            },
            okButtonProps: {
              style: {
                backgroundColor: "#94A684",
                borderColor: "#94A684",
                color: "#000",
              },
            },
            onOk() {
              setOpenPassword(false);
              temp.current = 0;
              setForgout({});
              navigate("/login");
            },
          });

          setTimeout(() => {
            navigate("/login");
            modal.destroy();
          }, 10000);
        } else {
          Modal.error({
            title: "Error",
            content: "Gagal Mengubah Sandi. Silakan coba lagi.",
            style: {
              top: "10px",
            },
            okButtonProps: {
              style: {
                backgroundColor: "#94A684",
                borderColor: "#94A684",
                color: "#000",
              },
            },
          });
        }
      } else {
        const response = await api2("/login/check", "POST", forgout);

        if (response.success === true) {
          setOpenPassword(true);
          temp.current++;
        } else {
          Modal.error({
            title: "Email Failed",
            content: "Email tidak terdaftar. Silakan periksa kembali.",
            style: {
              top: "10px",
            },
            okButtonProps: {
              style: {
                backgroundColor: "#94A684",
                borderColor: "#94A684",
                color: "#000",
              },
            },
          });
        }
      }
    } catch (error) {
      Modal.error({
        title: "Error",
        content: "Terjadi kesalahan. Silakan coba lagi.",
        style: {
          top: "10px",
        },
        okButtonProps: {
          style: {
            backgroundColor: "#94A684",
            borderColor: "#94A684",
            color: "#000",
          },
        },
      });
    }
  };

  return (
    <div className="flex-col sm:flex-row flex items-center gap-4 h-screen justify-evenly w-full bg-[#AEC3AE]">
      <Rubric />
      <div className="w-[80%] sm:w-[46%] lg:w-[34%] bg-[#94A684] p-12 rounded-lg">
        <h3 className="text-3xl text-center mb-6">Forgot</h3>
        <form onSubmit={onFinish} className="space-y-4">
          {!openPassword ? (
            <div>
              <label className="block text-white mb-2" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                maxLength={30}
                value={forgout.email ?? ""}
                onChange={(e) => setForgout({ ...forgout, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-white mb-2" htmlFor="password">
                New Password
              </label>
              <Input.Password
                id="password"
                maxLength={30}
                value={forgout.password ?? ""}
                onChange={(e) => setForgout({ ...forgout, password: e.target.value })}
                placeholder="Enter your new password"
                className="w-full"
                required
              />
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full bg-[#E4E4D0] text-black hover:bg-[#94A684] hover:shadow-lg transition-all duration-150 py-2 rounded-md"
            >
              Submit
            </button>
          </div>

          <div className="flex justify-between">
            <Link
              to="/login"
              className="bg-[#E4E4D0] px-4 py-1 rounded-md text-sm hover:bg-[#94A684] hover:shadow-lg transition duration-150"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-[#E4E4D0] px-4 py-1 rounded-md text-sm hover:bg-[#94A684] hover:shadow-lg transition duration-150"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
