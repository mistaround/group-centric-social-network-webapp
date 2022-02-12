import React, { useState, useEffect } from "react";

// Antd
import {
  Layout,
  Spin,
  Card,
  Avatar,
  Image,
  Button,
  Empty,
  Row,
  Col,
  Input,
  Typography,
} from "antd";
import {
  FileImageOutlined,
  EditOutlined,
  CommentOutlined,
  FlagOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
  SmileOutlined,
  SmileFilled,
  CalendarOutlined,
  CalendarFilled,
} from "@ant-design/icons";

// Third-party package
import Timestamp from "react-timestamp";
import InfiniteScroll from "react-infinite-scroll-component";

// Router
import { Link, useHistory } from "react-router-dom";

// Redux
import { useSelector } from "react-redux";

// API
import { getPostOfCurUser } from "../../services/post";
import { getUserInfo } from "../../services/user";

// Component
const { Content } = Layout;
const { Paragraph } = Typography;

// Input suffix - create a post
const suffix = (
  <FileImageOutlined
    style={{
      fontSize: 16,
      color: "#a9a9a9",
    }}
  />
);

function PersonalProfile() {
  // Router
  const history = useHistory();

  // Redux
  const user = useSelector((state) => state);

  // State

  // State to store posts
  const [postFetched, setPostFetched] = useState([{ _id: "" }]);
  const [currentPostPage, setCurPostPage] = useState(1);
  // State to indicate the number of posts fetched
  const [postNum, setPostNum] = useState(0);

  // State to indicate that the page is in the first time loading
  const [loading, setLoading] = useState(false);

  // State to store the info of current user
  const [currentUser, setCurUser] = useState({});

  // Function to render the whole page
  const fetchPost = async () => {
    try {
      const response = await getPostOfCurUser(1, 5);
      setPostFetched([...response.data]);
      setPostNum(response.total);
      return response;
    } catch (err) {
      return err;
    }
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

  // Function to fetch more post data while scrolling
  const fetchPostAfterScroll = async () => {
    const { data } = await getPostOfCurUser(currentPostPage + 1, 5);
    setPostFetched([...postFetched, ...data]);
    setCurPostPage(currentPostPage + 1);
  };

  // Effect Hook
  useEffect(() => {
    setLoading(true);
    fetchPost();
    fetchUser();
    setLoading(false);
  }, []);

  return (
    <div>
      <Spin spinning={loading}>
        <Layout>
          <Content style={{ marginTop: "100px" }}>
            <Row style={{ marginBottom: "30px" }}>
              <Col span={6} />
              <Col span={12}>
                <Card style={{ width: "100%", marginBottom: "30px" }}>
                  <Row>
                    <Col span={1} />
                    <Col span={1}>
                      <Avatar size="large" src={user.avatarUrl} />
                    </Col>
                    <Col span={18}>
                      <Input
                        onClick={() => {
                          history.push({
                            pathname: "/user/create_post",
                            state: {
                              media: false,
                            },
                          });
                        }}
                        placeholder="Create a Post"
                        size="large"
                        suffix={suffix}
                        style={{ width: "90%", marginLeft: "35px" }}
                      />
                    </Col>
                    <Col span={4}>
                      <Button
                        onClick={() => {
                          history.push({
                            pathname: "/user/create_post",
                            state: {
                              media: false,
                            },
                          });
                        }}
                        type="dashed"
                        icon={<EditOutlined />}
                        size="large"
                        style={{ marginLeft: "20px" }}
                      />
                      <Button
                        onClick={() => {
                          history.push({
                            pathname: "/user/create_post",
                            state: {
                              media: true,
                            },
                          });
                        }}
                        type="dashed"
                        icon={<FileImageOutlined />}
                        size="large"
                        style={{ marginLeft: "20px" }}
                      />
                    </Col>
                  </Row>
                </Card>

                {postNum === 0 ? (
                  <Card>
                    <Empty style={{ marginTop: "30px" }} />
                  </Card>
                ) : (
                  <InfiniteScroll
                    dataLength={postFetched.length}
                    next={fetchPostAfterScroll}
                    hasMore={postNum !== postFetched.length}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                      <p style={{ textAlign: "center", color: "#40cfa4" }}>
                        Yay! You have seen it all
                      </p>
                    }
                  >
                    {postFetched.map((item) => (
                      <Card
                        key={item._id}
                        style={{ width: "100%", marginBottom: "30px" }}
                      >
                        <Avatar
                          src={user.avatarUrl}
                          style={{ marginRight: "20px" }}
                        />
                        <span className="post-item-author">
                          Posted by{" "}
                          <Link to={`/user/${user.id}`}>{user.name}</Link>{" "}
                          <Timestamp relative date={item.date} /> in{" "}
                          <Link to={`/user/group/${item.groupDocs._id}`}>
                            {item.groupDocs.name}
                          </Link>
                        </span>
                        <div className="post-item-title">{item.title}</div>
                        <div className="post-item-content">{item.content}</div>
                        <div className="post-item-image-container">
                          {item.hasVideo === true ? (
                            // eslint-disable-next-line jsx-a11y/media-has-caption
                            <video width="100%" controls>
                              <source src={item.mediaUrl[0]} />
                              Your browser does not support video element
                            </video>
                          ) : item.hasAudio === true ? (
                            // eslint-disable-next-line jsx-a11y/media-has-caption
                            <audio controls>
                              <source src={item.mediaUrl[0]} />
                              Your browser does not support audio element.
                            </audio>
                          ) : (
                            <Image
                              src={item.mediaUrl[0]}
                              className="post-item-image"
                              fallback="data:image/png;base64,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"
                            />
                          )}
                        </div>
                        <div style={{ marginTop: "15px" }}>
                          <Button
                            size="large"
                            type="text"
                            icon={<CommentOutlined />}
                            onClick={() => {
                              history.push(`/user/post/${item._id}`);
                            }}
                          >
                            Comment
                          </Button>

                          {item.userId !== user.id && (
                            <Button
                              size="large"
                              type="text"
                              icon={<FlagOutlined />}
                              onClick={() => {
                                history.push(`/user/post/${item._id}`);
                              }}
                            >
                              Flag
                            </Button>
                          )}

                          <Button
                            size="large"
                            type="text"
                            icon={<EyeInvisibleOutlined />}
                            onClick={() => {
                              history.push(`/user/post/${item._id}`);
                            }}
                          >
                            Hide
                          </Button>

                          {item.userId === user.id ? (
                            <Button
                              size="large"
                              type="text"
                              icon={<DeleteOutlined />}
                              danger
                              onClick={() => {
                                history.push(`/user/post/${item._id}`);
                              }}
                            >
                              Delete
                            </Button>
                          ) : (
                            ""
                          )}
                        </div>
                      </Card>
                    ))}
                  </InfiniteScroll>
                )}
              </Col>
              <Col span={1} />
              <Col span={4}>
                <Card style={{ marginTop: "50%" }} title="Account Information">
                  <Row justify="center">
                    <Avatar size={100} src={user.avatarUrl} />
                  </Row>
                  <Row style={{ marginTop: "15%" }} justify="center">
                    <div style={{ marginRight: "5%" }}>Username:</div>
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
                  </Row>
                  <Row justify="center">
                    <div style={{ marginRight: "5%" }}>Registration Date:</div>
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
                  </Row>
                </Card>
              </Col>
              <Col span={1} />
            </Row>
          </Content>
        </Layout>
      </Spin>
    </div>
  );
}

export default PersonalProfile;
