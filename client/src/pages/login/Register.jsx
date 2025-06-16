import { Link, useNavigate } from "react-router-dom";
import { api2 } from "../../utils";
import { useState } from "react";
import Rubric from "../../components/Rubric";
import { Form, Input, Button, Modal } from "antd";

export default function Register() {
  const [register, setRegister] = useState({});
  const [emailError, setEmailError] = useState(null); // Store email error message
  const navigate = useNavigate();

  const onFinish = async () => {
    const response = await api2("/login/daftar", "POST", register);
    console.log(response.status);

    if (response.status == 201) {
      setRegister({});
      navigate("/login");
    } else if (response.status == 401) {
      setEmailError(response.message || "Email sudah terdaftar!");
    } else {
      Modal.error({
        title: "Error",
        content: response.message || "Terjadi kesalahan. Silakan coba lagi.",
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
        <h3 className="text-3xl text-center mb-6">Register</h3>
        <Form layout="vertical" onFinish={onFinish} className="space-y-4" validateTrigger="onSubmit">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Invalid email format" },
            ]}
            /* tampilkan error backend saja, biarkan error bawaan AntD bekerja */
            validateStatus={emailError ? "error" : undefined}
            help={emailError || undefined}
          >
            <Input
              value={register.email ?? ""}
              onChange={(e) => {
                setEmailError(null);                 // hapus pesan backend kalau user ubah input
                setRegister({ ...register, email: e.target.value });
              }}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password
              value={register.password ?? ""}
              onChange={(e) => setRegister({ ...register, password: e.target.value })}
            />
          </Form.Item>

          <Form.Item
            label="Full Name"
            name="full_name"
            rules={[{ required: true, message: "Full Name is required" }]}
          >
            <Input
              value={register.full_name ?? ""}
              onChange={(e) => setRegister({ ...register, full_name: e.target.value })}
            />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input
              value={register.username ?? ""}
              onChange={(e) => setRegister({ ...register, username: e.target.value })}
            />
          </Form.Item>


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
              to="/forgout"
              className="bg-[#E4E4D0] px-4 py-1 rounded-md text-sm hover:text-[rgb(84_108_84)] transition duration-150"
            >
              Forgot
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
