import { Link, useNavigate } from "react-router-dom";
import { api2 } from "../../utils";
import { useState, useRef } from "react";
import Rubric from "../../components/Rubric";
import { Form, Input, Button, Modal } from "antd";  // Import Modal from antd

export default function Forgout() {
  const [forgout, setForgout] = useState({});
  const [openPassword, setOpenPassword] = useState(false);
  const temp = useRef(0);
  const navigate = useNavigate();

  const onFinish = async () => {
    if (temp.current === 1) {
      await api2("/login/forgout", "PUT", forgout);

      // Pop-up success message using Modal
      Modal.success({
        title: "Success",
        content: "Berhasil Mengubah Sandi",
        okButtonProps: {
          style: {
            backgroundColor: "#94A684", // Color matching with 'Forgot' button
            borderColor: "#94A684", // Matching border color
            color: "#000", // White text
          },
        },
        onOk() {
          setOpenPassword(false);
          temp.current = 0;
          setForgout({});
          navigate("/login");
        },
      });

    } else {
      await api2("/login/check", "POST", forgout);
      setOpenPassword(true);
      temp.current++;
    }
  };

  return (
    <div className="flex-col sm:flex-row flex items-center gap-4 h-screen justify-evenly w-full bg-[#AEC3AE]">
      <Rubric />
      <div className="w-[80%] sm:w-[46%] lg:w-[34%] bg-[#94A684] p-12 rounded-lg">
        <h3 className="text-3xl text-center mb-6">Forgot</h3>
        <Form
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4"
          validateTrigger="onSubmit"
        >
          {!openPassword ? (
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Invalid email format" },
              ]}
            >
              <Input
                autoFocus
                value={forgout.email ?? ""}
                onChange={(e) =>
                  setForgout({ ...forgout, email: e.target.value })
                }
                placeholder="Enter your email"
              />
            </Form.Item>
          ) : (
            <Form.Item
              label="New Password"
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password
                autoFocus
                value={forgout.password ?? ""}
                onChange={(e) =>
                  setForgout({ ...forgout, password: e.target.value })
                }
                placeholder="Enter your new password"
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              htmlType="submit"
              block
              type="default"
              className="bg-[#E4E4D0] text-black hover:bg-[#94A684] transition duration-150"
            >
              Submit
            </Button>
          </Form.Item>

          <div className="flex justify-between">
            <Link
              to="/login"
              className="bg-[#E4E4D0] px-4 py-1 rounded-md text-sm hover:text-[rgb(84_108_84)] transition duration-150"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-[#E4E4D0] px-4 py-1 rounded-md text-sm hover:text-[rgb(84_108_84)] transition duration-150"
            >
              Register
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
