import React, { useState, useEffect } from "react";

// Router
import { useHistory, useLocation } from "react-router-dom";

// Antd
import {
  Layout,
  Card,
  Row,
  Col,
  Select,
  Avatar,
  Form,
  Input,
  Button,
  notification,
  Divider,
  Upload,
  message,
} from "antd";
import {
  CameraOutlined,
  FileTextOutlined,
  InboxOutlined,
} from "@ant-design/icons";

// API
import { getPublicGroups, getPrivateGroups } from "../../services/group";
import { createPost } from "../../services/post";

// Component
import { getToken } from "../../utils/auth";

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

function CreatePost() {
  // Router
  const history = useHistory();
  const location = useLocation();

  // State:

  // State to store the status of file upload
  const [uploadRes, setUploadRes] = useState(null);

  // State to store all types of groups fetched
  const [groupFetched, setGroupFetched] = useState([]);

  // State to indicate which tab is selected currently
  const tabListNoTitle = [
    {
      key: "pureText",
      tab: (
        <div>
          <FileTextOutlined />
          Pure Text
        </div>
      ),
    },
    {
      key: "imageAndVideo",
      tab: (
        <div>
          <CameraOutlined />
          Image Audio and Video
        </div>
      ),
    },
  ];

  const [activeTabKey, setActiveTabKey] = useState("pureText");

  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  // Form functions
  const onTextFinish = async (values) => {
    const reqBody = { ...values, hasVideo: false, hasAudio: false };

    try {
      const response = await createPost(reqBody);
      if (response.success) {
        notification.success({
          message: "Post Created",
          description: `Thanks for your sharing!`,
        });
      }
      history.push("/user/home");
      return response;
    } catch (err) {
      notification.error({
        message: "Post Creation Failed",
        description: "Oops! Some errors occurred.",
      });
      return err;
    }
  };

  const onMediaFinish = async (values) => {
    let reqBody;
    if (uploadRes.type === "image/jpeg" || uploadRes.type === "image/png") {
      reqBody = {
        ...values,
        hasVideo: false,
        hasAudio: false,
        mediaUrl: [
          `${process.env.REACT_APP_AWS}/${uploadRes.response.data.key}`,
        ],
      };
    } else if (uploadRes.type === "audio/mpeg") {
      reqBody = {
        ...values,
        hasVideo: false,
        hasAudio: true,
        mediaUrl: [
          `${process.env.REACT_APP_AWS}/${uploadRes.response.data.key}`,
        ],
      };
    } else {
      reqBody = {
        ...values,
        hasVideo: true,
        hasAudio: false,
        mediaUrl: [
          `${process.env.REACT_APP_AWS}/${uploadRes.response.data.key}`,
        ],
      };
    }

    try {
      const response = await createPost(reqBody);
      if (response.success) {
        notification.success({
          message: "Post Created",
          description: `Thanks for your sharing!`,
        });
      }
      history.push("/user/home");
      return response;
    } catch (err) {
      notification.error({
        message: "Post Creation Failed",
        description: "Oops! Some errors occurred.",
      });
      return err;
    }
  };

  // Effect Hooks
  useEffect(() => {
    const fetchGroups = async () => {
      // Get the number of two type groups
      const temp1 = await getPublicGroups(1, 1);
      const temp2 = await getPrivateGroups(1, 1);
      const publicNum = temp1.total;
      const privateNum = temp2.total;

      const publicGroups = await getPublicGroups(publicNum, 1);
      const privateGroups = await getPrivateGroups(privateNum, 1);

      setGroupFetched([...publicGroups.data, ...privateGroups.data]);
    };

    if (location.state !== undefined) {
      if (location.state.media) {
        setActiveTabKey("imageAndVideo");
      }
    }

    fetchGroups();
  }, []);

  // Card Tab
  const textTab = (
    <div style={{ marginTop: "10px" }}>
      <Form
        name="text"
        onFinish={onTextFinish}
        autoComplete="off"
        // initialValues={{ groupId: 123 }}
      >
        <Form.Item
          label="Group"
          name="groupId"
          rules={[
            {
              required: true,
              message: "Please select a group!",
            },
          ]}
        >
          <Select
            id="selectBtn"
            style={{ width: "50%" }}
            showSearch
            placeholder="Select a group"
            optionFilterProp="children"
            allowClear
            filterOption={(input, option) => {
              const val = Array.isArray(option.children)
                ? option.children.join("")
                : option.children.toLowerCase();
              return val
                ? val.toLowerCase().indexOf(input.toLowerCase()) >= 0
                : null;
            }}
          >
            {groupFetched.map((item) => (
              <Option key={item.groupId} value={item.groupId}>
                <Avatar
                  size="small"
                  src={item.groupDocs[0].avatarUrl}
                  style={{ marginRight: "10px" }}
                />
                {item.groupDocs[0].name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: "Please input your post title!",
            },
            {
              min: 1,
              max: 128,
              message: "The length of title cannot exceed 128 characters",
            },
          ]}
        >
          <Input placeholder="What is your post title" id="titleInpt" allowClear />
        </Form.Item>

        <Form.Item label="Content" name="content">
          <TextArea
            allowClear
            showCount
            maxLength={1200}
            placeholder="(Optional)"
            autoSize={{ minRows: 4, maxRows: 20 }}
            style={{ height: 120 }}
          />
        </Form.Item>

        <Form.Item>
          <Row>
            <Col span={18} />
            <Col span={6}>
              <Button type="primary" htmlType="submit" id="createBtn">
                CREATE POST
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
    </div>
  );

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
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "video/mp4" ||
        file.type === "audio/mpeg";
      if (!fileTypeValid) {
        message.error("Only JPEG, PNG, MP4 and MP3 are allowed to be uploaded");
      }
      const isLt25M = file.size / 1024 / 1024 < 25;
      if (!isLt25M) {
        message.error("File must smaller than 25MB!");
      }
      return fileTypeValid && isLt25M;
    },
  };

  // Media tab
  const mediaTab = (
    <div style={{ marginTop: "10px" }}>
      <Form name="text" onFinish={onMediaFinish} autoComplete="off">
        <Form.Item
          label="Group"
          name="groupId"
          rules={[
            {
              required: true,
              message: "Please select a group!",
            },
          ]}
        >
          <Select
            style={{ width: "50%" }}
            showSearch
            placeholder="Select a group"
            optionFilterProp="children"
            allowClear
            filterOption={(input, option) => {
              const val = Array.isArray(option.children)
                ? option.children.join("")
                : option.children.toLowerCase();
              return val
                ? val.toLowerCase().indexOf(input.toLowerCase()) >= 0
                : null;
            }}
          >
            {groupFetched.map((item) => (
              <Option key={item.groupId} value={item.groupId}>
                <Avatar
                  size="small"
                  src={item.groupDocs[0].avatarUrl}
                  style={{ marginRight: "10px" }}
                />
                {item.groupDocs[0].name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: "Please input your post title!",
            },
            {
              min: 1,
              max: 128,
              message: "The length of title cannot exceed 128 characters",
            },
          ]}
        >
          <Input placeholder="What is your post title" allowClear />
        </Form.Item>

        <Form.Item label="Content" name="content">
          <TextArea
            allowClear
            showCount
            maxLength={1200}
            placeholder="(Optional)"
            autoSize={{ minRows: 4, maxRows: 20 }}
            style={{ height: 120 }}
          />
        </Form.Item>

        <Form.Item
          label="Attachment"
          rules={[
            {
              required: true,
              message: "Please input your post title!",
            },
          ]}
        >
          <Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single upload. Strictly prohibit from uploading
              company data or other band files
            </p>
          </Dragger>
        </Form.Item>

        <Form.Item>
          <Row>
            <Col span={18} />
            <Col span={6}>
              <Button
                type="primary"
                htmlType="submit"
                disabled={uploadRes === null}
              >
                CREATE POST
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
    </div>
  );

  const contentList = {
    pureText: textTab,
    imageAndVideo: mediaTab,
  };

  return (
    <div>
      <Layout style={{ height: "120%" }}>
        <Content style={{ marginTop: "100px", height: "120%" }}>
          <Row>
            <Col span={4} />
            <Col span={16}>
              <Divider style={{ marginTop: "50px" }}>Create a Post</Divider>
              <Card
                style={{ width: "100%", marginTop: "30px" }}
                tabList={tabListNoTitle}
                activeTabKey={activeTabKey}
                onTabChange={(key) => {
                  onTabChange(key);
                }}
              >
                {/* Card Tab */}
                {contentList[activeTabKey]}
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

export default CreatePost;
