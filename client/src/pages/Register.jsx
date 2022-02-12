import React from "react";

// Antd
import { Form, Input, Button, Card, Row, Col, notification } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  KeyOutlined,
} from "@ant-design/icons";

// Router
import { Link, useHistory } from "react-router-dom";

// API
import { validateUsername } from "../services/user";
import { userRegister } from "../services/auth";

// Static
import backgroundImg from "../images/login-background.jpg";
import "./Register.css";
import logo from "../images/logo.png";

export default function Register() {
  const history = useHistory();
  const onFinish = async (values) => {
    const data = {
      name: values.username,
      password: values.password,
      email: values.email,
    };

    // Call register API
    try {
      const response = await userRegister(data);
      if (response.success) {
        notification.success({
          message: "Registration Successful",
          description: `Welcome to ShareYou, new friend!`,
        });
        history.push("/login");
      }
      return response;
    } catch (err) {
      notification.error({
        message: "Registration Failed",
        description: "Oops! Some errors occurred.",
      });
      return err;
    }
  };

  return (
    <Row>
      <Col span={12}>
        <img
          style={{ width: "100%", height: "100%" }}
          src={backgroundImg}
          alt="Missing Pic"
        />
      </Col>
      <Col className="register-form-background" span={12}>
        <Row>
          <Col span={4} />
          <Col span={16}>
            <img
              src={logo}
              alt="logo"
              style={{
                width: "90%",
                height: "85%",
              }}
            />
          </Col>
          <Col span={4} />
        </Row>
        <Row>
          <Card
            title="Sign up"
            bordered={false}
            className="register-form-container"
          >
            <Form
              name="register"
              className="register-form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your Username!" },
                  {
                    min: 5,
                    max: 20,
                    message: "Username should be within 5 to 20 characters",
                  },
                  {
                    pattern: new RegExp(/^[a-zA-Z0-9]*$/),
                    message: "Username should be alphanumeric",
                  },
                  () => ({
                    async validator(_, value) {
                      if (value === "") {
                        return Promise.reject();
                      }
                      const response = await validateUsername(value);

                      if (!response.occupied) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("This username has been occupied!")
                      );
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                  id="newNameInpt"
                  allowClear
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your Email Address!",
                  },
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                ]}
                hasFeedback
              >
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="Email Address"
                  id="newEmailInpt"
                  allowClear
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                  {
                    min: 6,
                    max: 20,
                    message: "Password should be within 6 to 20 characters",
                  },
                  {
                    pattern: new RegExp(
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,20}$/
                    ),
                    message:
                      "Password should contain at least one capital letter, and one lower-case letter",
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  id="newPwdInpt"
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item
                name="confirm_password"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your Password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<KeyOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Confirm Password"
                  id="confirmPwdInpt"
                  allowClear
                />
              </Form.Item>

              <Form.Item style={{ textAlign: "center" }}>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  id="registerBtn"
                >
                  Sign up
                </Button>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  Already have an account? <Link to="/login">Sign in</Link>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </Row>
      </Col>
    </Row>
  );
}
