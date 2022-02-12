import React, { useState, useEffect } from "react";

// Antd
import {
  Row,
  Col,
  Card,
  Avatar,
  Typography,
  Button,
  Tag,
  Input,
  Image,
  Layout,
  Statistic,
  Divider,
  Spin,
  Empty,
  notification,
} from "antd";
import {
  FileImageOutlined,
  EditOutlined,
  CommentOutlined,
  FlagOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

// Third-party package
import Timestamp from "react-timestamp";
import InfiniteScroll from "react-infinite-scroll-component";

// Redux
import { useSelector } from "react-redux";

// Router
import { useHistory, useLocation, Link } from "react-router-dom";

// API
import {
  getGroupById,
  checkGroupStatus,
  checkUserGroupStatus,
  createRequest,
  quitGroup,
} from "../../services/group";
import {
  notifyAdminRequest,
  notifyAdminLeave,
} from "../../services/notification";
import { getPostByGroupId } from "../../services/post";

// Component
import "./Group.css";

const { Title } = Typography;

const { Content } = Layout;

const suffix = (
  <FileImageOutlined
    style={{
      fontSize: 16,
      color: "#a9a9a9",
    }}
  />
);

function Group() {
  // Router
  const history = useHistory();
  const location = useLocation();

  // Redux
  const user = useSelector((state) => state);

  // State

  // Whether current user has joined the group
  const [joined, setJoined] = useState(false);

  // State to store the info of current group
  const [currentGroup, setCurGroup] = useState({ tags: [] });

  // State to indicate whether user has requested to join current group
  const [requested, setReqested] = useState(false);

  // State to indicate whether the whole component is in the loading phase
  const [loading, setLoading] = useState(false);

  // State to store posts
  const [postFetched, setPostFetched] = useState([]);
  const [currentPostPage, setCurPostPage] = useState(1);

  // State to indicate the number of posts fetched
  const [postNum, setPostNum] = useState(0);

  // State to indicate the relation between current user and current group
  const [userGroupStatus, setUserGroupStatus] = useState(0);

  const fetchStatus = async (groupId) => {
    try {
      // Fetch potential request from current user to current group
      const status = await checkGroupStatus(groupId);

      if (status.success && status.data.joined) {
        setJoined(true);
        setReqested(false);
      } else if (status.success && status.data.requested) {
        setJoined(false);
        setReqested(true);
      } else {
        setJoined(false);
        setReqested(false);
      }
      return status;
    } catch (err) {
      return err;
    }
  };

  // Function to handle the click of button join
  const handleJoinClick = async () => {
    try {
      const response = await createRequest(currentGroup._id);
      if (response.success) {
        notifyAdminRequest(currentGroup._id, user.id);
        fetchStatus(currentGroup._id);
        notification.success({
          message: "Request Sent",
          description: `A join request to ${currentGroup.name} has been sent`,
        });
      }
      return response;
    } catch (err) {
      notification.error({
        message: "Request Failed",
        description: "Oops! Some errors occurred.",
      });
      return err;
    }
  };

  // Function to handle user quit group
  const handleQuitClick = async () => {
    try {
      const response = await quitGroup(currentGroup._id);
      if (response.success) {
        notifyAdminLeave(currentGroup._id, user.id);
        notification.success({
          message: "Quit Successful",
          description: `You have left ${currentGroup.name}.`,
        });
      }
      history.push("/user/home");
      return response;
    } catch (err) {
      notification.error({
        message: "Quit Failed",
        description: "Oops! Some errors occurred.",
      });
      return err;
    }
  };

  // Function to fetch more post data while scrolling
  const fetchPostAfterScroll = async () => {
    const { data } = await getPostByGroupId(
      currentGroup._id,
      currentPostPage + 5,
      1
    );
    setPostFetched([...postFetched, ...data]);
    setCurPostPage(currentPostPage + 1);
  };

  // Effect hook functions
  const fetchGroup = async (groupId) => {
    try {
      const response = await getGroupById(groupId);

      // format date
      const temp = response.data.date.split("T")[0];
      setCurGroup({ ...response.data, date: temp });
      return response;
    } catch (err) {
      if (err.response.status === 403) {
        history.push("/403");
        return err;
      }
      if (err.response.status === 404 || err.response.status === 400) {
        history.push("/404");
        return err;
      }
      return err;
    }
  };

  // Fetch data for posts to be displayed in the home page
  const fetchPosts = async (groupId) => {
    const result = await getPostByGroupId(groupId, 1, 5);
    setPostFetched(result.data);
    setPostNum(result.total);
  };

  const fetchUserGroupStatus = async (groupId) => {
    try {
      const result = await checkUserGroupStatus(groupId);
      if (!result.data) {
        setUserGroupStatus({ isAdmin: false });
        return;
      }
      setUserGroupStatus(result.data);
    } catch (err) {
      setUserGroupStatus({ isAdmin: false });
    }
  };

  // Effect Hook
  useEffect(() => {
    setLoading(true);

    const idInPath = location.pathname.split("/")[3];

    fetchGroup(idInPath);
    fetchStatus(idInPath);
    fetchPosts(idInPath);
    fetchUserGroupStatus(idInPath);

    setLoading(false);
  }, []);

  return (
    <div>
      <Spin spinning={loading} size="large">
        <Layout>
          <Content>
            {/* Top area of a group page */}
            <Row>
              <Col span={24} style={{ marginTop: "64px" }}>
                <Card
                  bordered={false}
                  style={{
                    width: "100%",
                    backgroundColor: "#94D1BF",
                    borderRadius: "0px",
                  }}
                >
                  <Row justify="space-between">
                    <Col span={4} />
                    <Col span={16}>
                      <div className="group-title">
                        <div className="group-avatar">
                          <Avatar size={100} src={currentGroup.avatarUrl} />
                        </div>
                        <div>
                          <Title style={{ color: "white" }} level={1}>
                            {currentGroup.name}
                          </Title>
                          <span
                            style={{
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "20px",
                              marginRight: "5px",
                            }}
                          >
                            Tag:{" "}
                          </span>
                          {currentGroup.tags.map((item) => (
                            <Tag key={item.tagDocs[0].name} color="#40CFA4">
                              {item.tagDocs[0].name}
                            </Tag>
                          ))}
                        </div>

                        <div className="join-button">
                          {currentGroup.owner === user.id ? (
                            <Button size="large" ghost disabled>
                              Owner
                            </Button>
                          ) : joined === true ? (
                            <Button
                              size="large"
                              ghost
                              disabled={currentGroup.owner === user.id}
                              onClick={handleQuitClick}
                            >
                              Quit
                            </Button>
                          ) : requested === true ? (
                            <Button size="large" ghost disabled>
                              Requested
                            </Button>
                          ) : (
                            <Button
                              type="primary"
                              size="large"
                              onClick={handleJoinClick}
                            >
                              Join
                            </Button>
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col span={4} />
                  </Row>
                </Card>
              </Col>
            </Row>

            {/* Create a post area */}
            <Row style={{ marginBottom: "30px", marginTop: "30px" }}>
              <Col span={6} />
              <Col span={12}>
                <Card style={{ width: "100%" }}>
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
              </Col>
              <Col span={6} />
            </Row>

            <Row justify="space-around">
              <Col span={4} />

              {/* Posts display area */}
              <Col span={12}>
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
                          src={item.author[0].avatarUrl}
                          style={{ marginRight: "20px" }}
                        />
                        <span className="post-item-author">
                          Posted by{" "}
                          <Link to={`/user/${item.author[0]._id}`}>
                            {item.author[0].name}
                          </Link>{" "}
                          <Timestamp relative date={item.date} /> in{" "}
                          <Link to={`/user/group/${currentGroup._id}`}>
                            {currentGroup.name}
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

                          {item.author[0]._id !== user.id && (
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

                          {item.author[0]._id === user.id ||
                          userGroupStatus.isAdmin === true ? (
                            <Button
                              size="large"
                              type="text"
                              icon={<DeleteOutlined />}
                              onClick={() => {
                                history.push(`/user/post/${item._id}`);
                              }}
                              danger
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

              <Col span={4}>
                <Card title="About Group" style={{ width: "100%" }}>
                  <div>{currentGroup.aboutGroup}</div>
                  <Divider />
                  <div style={{ marginTop: "30px" }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Statistic
                          title="Created on"
                          value={currentGroup.date}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="Members"
                          value={currentGroup.userNum}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div style={{ marginTop: "25px" }}>
                    {joined ? (
                      <Button
                        onClick={() => {
                          history.push({
                            pathname: "/user/create_post",
                            state: {
                              media: false,
                            },
                          });
                        }}
                        style={{ width: "100%" }}
                        type="primary"
                      >
                        CREATE POST
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                </Card>
              </Col>
            </Row>
            <div style={{ height: "800px" }} />
          </Content>
        </Layout>
      </Spin>
    </div>
  );
}

export default Group;
