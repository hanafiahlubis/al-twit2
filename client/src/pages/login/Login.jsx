import { useNavigate, useOutletContext, Link, Navigate } from "react-router-dom";
import Rubric from "../../components/Rubric";
import { useState } from "react";
import { Button, Form, Input } from "antd";
import { api } from "../../utils.js";

export default function Login() {
  const [login, setLogin] = useState({});
  const navigate = useNavigate();
  const [user, setUser] = useOutletContext();

  if (user) return <Navigate to="/" />;

  const onFinish = async () => {
    const response = await fetch(`http://localhost:3000/api/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(login),
    });

    if (response.ok) {
      setUser(await api.get("/login/me"));
      navigate("/");
    } else {
      const message = await response.text();
      alert(message);
    }
  };

  return (
    <div className="flex-col sm:flex-row flex items-center gap-4 h-screen justify-evenly w-full bg-[#AEC3AE]">
      <Rubric />
      <div className="w-[80%] sm:w-[46%] lg:w-[34%] bg-[#94A684] p-12 rounded-lg">
        <h3 className="text-3xl text-center mb-6">Login</h3>
        <Form
          layout="vertical"
          onFinish={onFinish}
          validateTrigger="onSubmit"
          className="space-y-4"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Invalid email format!" },
            ]}
          >
            <Input
              maxLength={30}
              placeholder="example@example.com"
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              maxLength={30}
              placeholder="Enter your password"  
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
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
              to="/forgout"
              className="bg-[#E4E4D0] px-4 py-1 rounded-md text-sm hover:text-[rgb(174,195,174)] transition duration-150"
            >
              Forgot
            </Link>
            <Link
              to="/register"
              className="bg-[#E4E4D0] px-4 py-1 rounded-md text-sm hover:text-[rgb(174,195,174)] transition duration-150"
            >
              Register
            </Link>
          </div>


        </Form>
      </div>
    </div>
  );
}
