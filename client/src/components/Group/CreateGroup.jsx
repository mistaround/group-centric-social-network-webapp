import React from "react";

// Antd
import {
  Layout,
  Row,
  Col,
  Card,
  Divider,
  Form,
  Input,
  Button,
  Switch,
  Select,
  notification,
} from "antd";

// Router
import { useHistory } from "react-router-dom";

// API
import { createGroup, validateGroupName } from "../../services/group";

// Component

const { Content } = Layout;
const { TextArea } = Input;

function CreateGroup() {
  // Router
  const history = useHistory();

  // Form functions
  const onFinish = async (values) => {
    const reqBody = { ...values };

    try {
      const response = await createGroup(reqBody);
      if (response.success) {
        notification.success({
          message: "Group Created",
          description: `Congratulations! Your group has been successfully created. Please start your journey!`,
        });
      }
      history.push("/user/home");
      return response;
    } catch (err) {
      notification.error({
        message: "Group Creation Failed",
        description: "Oops! Some errors occurred.",
      });
      return err;
    }
  };

  return (
    <div>
      <Layout>
        <Content style={{ marginTop: "100px" }}>
          <Row style={{ marginTop: "70px" }}>
            <Col span={4} />
            <Col span={16}>
              <Divider>Create a Group</Divider>
              <Card style={{ width: "100%" }}>
                <Form
                  name="group"
                  onFinish={onFinish}
                  autoComplete="off"
                  initialValues={{ isPrivate: false }}
                >
                  <Form.Item
                    label="Name"
                    name="name"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please input your group name!",
                      },
                      {
                        min: 5,
                        max: 30,
                        message:
                          "The length of group name should be within 5 to 30 characters. (Special characters allowed)",
                      },
                      () => ({
                        async validator(_, value) {
                          if (value === "") {
                            return Promise.reject();
                          }
                          const response = await validateGroupName(value);

                          if (!response.occupied) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("This group name has been occupied!")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input
                      allowClear
                      placeholder="Please input the name of your group"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Type"
                    name="isPrivate"
                    valuePropName="checked"
                    rules={[
                      {
                        required: true,
                        message: "Please select a type for your group!",
                      },
                    ]}
                  >
                    <Switch
                      style={{ marginLeft: "8px" }}
                      size="large"
                      checkedChildren="Private"
                      unCheckedChildren="Public"
                      defaultChecked={false}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Tags"
                    name="tags"
                    rules={[
                      {
                        required: true,
                        message:
                          "Please assign at least one tag to your group!",
                      },
                      () => ({
                        validator(_, value) {
                          if (value === undefined) {
                            return Promise.reject(
                              new Error(
                                "The number of tags should be within 1 to 5."
                              )
                            );
                          }
                          if (value.length <= 0 || value.length > 5) {
                            return Promise.reject(
                              new Error(
                                "The number of tags should be within 1 to 5."
                              )
                            );
                          }
                          for (let i = 0; i < value.length; i += 1) {
                            if (value[i].length > 30) {
                              return Promise.reject(
                                new Error(
                                  "The length of each tag should be within 1 to 30 characters."
                                )
                              );
                            }
                          }
                          for (let i = 0; i < value.length; i += 1) {
                            const str = value[i].replace(
                              // eslint-disable-next-line no-useless-escape
                              /[\-\_\,\!\|\~\`\(\)\#\$\%\^\&\*\{\}\:\;\"\L\<\>\ \、\·\+\?]/g,
                              ""
                            );
                            if (str.length === 0) {
                              return Promise.reject(
                                new Error(
                                  "Tag should not simply contain special characters!"
                                )
                              );
                            }
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <Select
                      mode="tags"
                      style={{ width: "100%" }}
                      placeholder="Please input topics your group might cover"
                    />
                  </Form.Item>

                  <Form.Item label="About" name="aboutGroup">
                    <TextArea
                      allowClear
                      showCount
                      maxLength={2048}
                      placeholder="(Optional)"
                      autoSize={{ minRows: 6, maxRows: 50 }}
                      style={{ height: 180 }}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Row>
                      <Col span={18} />
                      <Col span={6}>
                        <Button type="primary" htmlType="submit">
                          CREATE GROUP
                        </Button>
                        <Button
                          style={{ marginLeft: "20px" }}
                          onClick={() => {
                            history.goBack();
                          }}
                          type="default"
                        >
                          CANCEL
                        </Button>
                      </Col>
                    </Row>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col span={4} />
          </Row>
          <div style={{ height: "800px" }} />
        </Content>
      </Layout>
    </div>
  );
}

export default CreateGroup;
