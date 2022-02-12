import React, { useState, useEffect } from "react";

// Antd
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  notification,
  Avatar,
  message,
  Upload,
  Switch,
} from "antd";
import {
  SmileOutlined,
  SmileFilled,
  EditOutlined,
  InboxOutlined,
  CalendarOutlined,
  CalendarFilled,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

// Redux
import { useSelector } from "react-redux";

// Router
import { useHistory } from "react-router-dom";

// Token
import { getToken, clearToken } from "../../utils/auth";

// API
import { validatePassword, updateUser, getUserInfo } from "../../services/user";

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

function AccountSettings() {
  // Router
  const history = useHistory();

  // Form
  const [pwdForm] = Form.useForm();

  // Redux
  const user = useSelector((state) => state);

  // State

  // State to store the info of current user
  const [currentUser, setCurUser] = useState({});

  // State to indicate whether the password setting modal should be visible
  const [pwdFormVisible, setPwdFormVisible] = useState(false);
  // State to indicate whether the avatar setting modal should be visible
  const [avatarFormVisible, setAvatarFormVisible] = useState(false);

  // State to indicate whether backend has reset the password
  const [resetStatus, setStatus] = useState(false);
  // State to indicate whether backend has reset the avatar
  const [avatarStatus, setAvatarStatus] = useState(false);

  // State to store the status of file upload
  const [uploadRes, setUploadRes] = useState(null);

  // Change password Modal functions
  const showPwdModal = () => {
    setPwdFormVisible(true);
  };

  const handlePwdCancel = () => {
    pwdForm.resetFields();
    setPwdFormVisible(false);
  };

  const handlePwdOk = async () => {
    try {
      const values = await pwdForm.validateFields();

      const response = await updateUser(user.id, { password: values.password });
      if (response.success) {
        notification.success({
          message: "Password Changed",
          description: `Do not tell everyone your password. ^ ^`,
        });
      }
      pwdForm.resetFields();
      setPwdFormVisible(false);
      setStatus(false);
      return response;
    } catch (err) {
      if (err.errorFields.length !== 0) {
        return notification.error({
          message: "Change Password Failed",
          description: "Please make sure all fields are filled in correctly.",
        });
      }
      notification.error({
        message: "Change Password Failed",
        description: "Oops! Some errors occurred.",
      });
      return err;
    }
  };

  // Change Avatar Modal functions
  const showAvatarModal = () => {
    setAvatarFormVisible(true);
  };

  const handleAvatarOk = async () => {
    setAvatarStatus(true);
    const reqBody = {
      avatarUrl: `${process.env.REACT_APP_AWS}/${uploadRes.response.data.key}`,
    };
    try {
      const response = await updateUser(user.id, reqBody);
      if (response.success) {
        notification.success({
          message: "Avatar Changed",
          description: `Now you will be redirected to Sign in page.`,
        });
      }
      setAvatarFormVisible(false);
      setAvatarStatus(false);
      setTimeout(() => {
        clearToken();
        history.push("/login");
      }, 2000);
      return response;
    } catch (err) {
      notification.error({
        message: "Change Avatar Failed",
        description: "Oops! Some errors occurred.",
      });
      return err;
    }
  };

  const handleAvatarCancel = () => {
    setAvatarFormVisible(false);
  };

  // File upload component
  const draggerProps = {
    name: "file",
    multiple: false,
    headers: { "auth-token": getToken() },
    action: `${process.env.REACT_APP_DOMAIN}/api/file`,
    maxCount: 1,

    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        // if user remove the file uploaded
        if (info.fileList.length === 0) {
          setUploadRes(null);
        }
      }
      if (status === "done") {
        setUploadRes(info.file);
        message.success(`${info.file.name} file uploaded successfully.`, 5);
      } else if (status === "error") {
        setUploadRes(null);
        message.error(`${info.file.name} file upload failed.`, 5);
      }
    },

    // Before upload processing functio
    beforeUpload(file) {
      const fileTypeValid =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!fileTypeValid) {
        message.error("Only JPEG and PNG are allowed to be uploaded");
      }
      const isLt25M = file.size / 1024 / 1024 < 25;
      if (!isLt25M) {
        message.error("File must smaller than 25MB!");
      }
      return fileTypeValid && isLt25M;
    },
  };

  // Function executed in effect hook and whole page render
  const fetchUser = async () => {
    try {
      const response = await getUserInfo();
      const dateFormated = response.data.date.split("T")[0];
      setCurUser({ ...response.data, date: dateFormated });
      return response;
    } catch (err) {
      return err;
    }
  };

  // Function for user to change the status of activation
  const changeActiveStatus = async (value) => {
    try {
      const deactivated = value === false;
      const response = await updateUser(user.id, { deactivated });
      if (response.success && value === false) {
        notification.success({
          message: "Account Deactivated",
          description: `Related functionalities have been disabled for you account.`,
        });
      } else if (response.success && value === true) {
        notification.success({
          message: "Account Activated",
          description: `All functionalities have been enabled for you account.`,
        });
      }
      fetchUser();
      return response;
    } catch (err) {
      notification.error({
        message: "Failed to deactivate your account",
        description: "Oops! Some errors occurred.",
      });
      return err;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <Layout>
        <Content style={{ marginTop: "150px" }}>
          <Row>
            <Col span={3} />
            <Col span={18}>
              <Card title="Account Settings" bordered={false}>
                <div style={{ marginTop: "30px" }}>
                  <div>
                    <Row>
                      <Col span={14}>
                        <Title level={4}>Account Information</Title>
                        <Row style={{ marginTop: "90px" }}>
                          <Col span={4} />
                          <Col span={4}>Username:</Col>
                          <Col span={16}>
                            <Paragraph
                              copyable={{
                                icon: [
                                  <SmileOutlined key="copy-icon" />,
                                  <SmileFilled key="copied-icon" />,
                                ],
                                tooltips: [
                                  "Click here to copy you name",
                                  "You clicked!!",
                                ],
                              }}
                            >
                              {user.name}
                            </Paragraph>
                          </Col>
                        </Row>

                        <Row style={{ marginTop: "40px" }}>
                          <Col span={4} />
                          <Col span={4}>Registration Date:</Col>
                          <Col span={16}>
                            <Paragraph
                              copyable={{
                                icon: [
                                  <CalendarOutlined key="copy-icon" />,
                                  <CalendarFilled key="copied-icon" />,
                                ],
                                tooltips: [
                                  "Click here to copy you registration date",
                                  "You clicked!!",
                                ],
                              }}
                            >
                              {currentUser.date}
                            </Paragraph>
                          </Col>
                        </Row>

                        <Row style={{ marginTop: "40px" }}>
                          <Col span={4} />
                          <Col span={4}>Password:</Col>
                          <Col span={8}>
                            <Paragraph>
                              *********************************
                            </Paragraph>
                          </Col>
                          <Col span={8}>
                            <Button
                              type="primary"
                              icon={<EditOutlined />}
                              size="small"
                              onClick={showPwdModal}
                            >
                              Change
                            </Button>
                            <Modal
                              title="Change Password"
                              visible={pwdFormVisible}
                              onOk={handlePwdOk}
                              confirmLoading={resetStatus}
                              onCancel={handlePwdCancel}
                              okText="SUBMIT"
                              cancelText="CANCEL"
                              width={650}
                            >
                              <Form
                                form={pwdForm}
                                name="password"
                                onFinish={handlePwdOk}
                                autoComplete="off"
                              >
                                <Form.Item
                                  label="Old Password"
                                  name="oldPassword"
                                  hasFeedback
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Please input your old password!",
                                    },
                                    () => ({
                                      async validator(_, value) {
                                        if (value === "") {
                                          return Promise.reject();
                                        }
                                        const response = await validatePassword(
                                          value
                                        );

                                        if (response.success) {
                                          return Promise.resolve();
                                        }
                                        return Promise.reject(
                                          new Error("Password not match!")
                                        );
                                      },
                                    }),
                                  ]}
                                >
                                  <Input.Password allowClear />
                                </Form.Item>

                                <Form.Item
                                  label="New Password"
                                  name="password"
                                  hasFeedback
                                  dependencies={["oldPassword"]}
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Please input your new Password!",
                                    },
                                    {
                                      min: 6,
                                      max: 20,
                                      message:
                                        "Password should be within 6 to 20 characters",
                                    },
                                    {
                                      pattern: new RegExp(
                                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,20}$/
                                      ),
                                      message:
                                        "Password should contain at least one capital letter, and one lower-case letter",
                                    },
                                    ({ getFieldValue }) => ({
                                      async validator(_, value) {
                                        if (
                                          !value ||
                                          getFieldValue("oldPassword") !== value
                                        ) {
                                          return Promise.resolve();
                                        }

                                        return Promise.reject(
                                          new Error(
                                            "New password cannot be the same as the old one!"
                                          )
                                        );
                                      },
                                    }),
                                  ]}
                                >
                                  <Input.Password allowClear />
                                </Form.Item>

                                <Form.Item
                                  label="Confirm New Password"
                                  name="confirmPassword"
                                  hasFeedback
                                  dependencies={["password"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please confirm your Password!",
                                    },
                                    ({ getFieldValue }) => ({
                                      validator(_, value) {
                                        if (
                                          !value ||
                                          getFieldValue("password") === value
                                        ) {
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
                                >
                                  <Input.Password allowClear />
                                </Form.Item>
                              </Form>
                            </Modal>
                          </Col>
                        </Row>

                        <Row style={{ marginTop: "40px" }}>
                          <Col span={4} />
                          <Col span={4}>Activated:</Col>
                          <Col span={16}>
                            <Switch
                              checkedChildren={<CheckOutlined />}
                              unCheckedChildren={<CloseOutlined />}
                              checked={!currentUser.deactivated}
                              onChange={changeActiveStatus}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col span={10}>
                        <Title level={4}>Account Avatar</Title>
                        <Row style={{ marginTop: "40px" }}>
                          <Col span={3} />
                          <Col style={{ textAlign: "center" }} span={18}>
                            <Avatar size={250} src={user.avatarUrl} />
                          </Col>
                          <Col span={3} />
                          <Modal
                            title="Change Avatar"
                            visible={avatarFormVisible}
                            onOk={handleAvatarOk}
                            okButtonProps={{ disabled: uploadRes === null }}
                            confirmLoading={avatarStatus}
                            onCancel={handleAvatarCancel}
                            okText="SUBMIT"
                            cancelText="CANCEL"
                            width={750}
                          >
                            <Form>
                              <Form.Item>
                                <Dragger {...draggerProps}>
                                  <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                  </p>
                                  <p className="ant-upload-text">
                                    Click or drag file to this area to upload
                                  </p>
                                  <p className="ant-upload-hint">
                                    Support for a single upload. Strictly
                                    prohibit from uploading company data or
                                    other band files
                                  </p>
                                </Dragger>
                              </Form.Item>
                            </Form>
                          </Modal>
                        </Row>
                        <Row style={{ marginTop: "40px", textAlign: "center" }}>
                          <Col span={3} />
                          <Col span={18}>
                            <Button type="primary" onClick={showAvatarModal}>
                              Change Avatar
                            </Button>
                          </Col>
                          <Col span={3} />
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div style={{ height: "100px" }} />
              </Card>
            </Col>
            <Col span={3} />
          </Row>
        </Content>
        <div style={{ height: "500px" }} />
      </Layout>
    </div>
  );
}

export default AccountSettings;
