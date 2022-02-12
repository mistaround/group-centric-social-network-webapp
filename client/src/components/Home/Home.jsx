/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";

// Antd
import {
  Card,
  Row,
  Col,
  Layout,
  Avatar,
  Input,
  Button,
  Image,
  Spin,
  Pagination,
  Empty,
  Divider,
  Popover,
  Select,
} from "antd";
import {
  FileImageOutlined,
  EditOutlined,
  CommentOutlined,
  FlagOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";

// Third-party package
import Timestamp from "react-timestamp";
import InfiniteScroll from "react-infinite-scroll-component";

// Router
import { Link, useHistory } from "react-router-dom";

// Redux
import { useSelector } from "react-redux";

// Components
import "./Home.css";

// API
import {
  getPublicGroups,
  getPrivateGroups,
  getTrendingGroups,
  checkUserGroupStatus,
  getGroupsSortTime,
  getGroupsSortPost,
  getGroupsSortMember,
  getAllTags,
  getGroupsByTag,
} from "../../services/group";
import { getHomePosts } from "../../services/post";

const { Content } = Layout;
const { Option } = Select;

export default function Home() {
  // Router
  const history = useHistory();

  // Redux
  const user = useSelector((state) => state);

  // State:

  // State to indicate that the page is in the first time loading
  const [loading, setLoading] = useState(true);
  const [activeTabKey1, setActiveTabKey1] = useState("public");
  const tabList = [
    {
      key: "public",
      tab: "Public",
    },
    {
      key: "private",
      tab: "Private",
    },
  ];

  // State to store groups
  const [publicGroups, setPublicGroups] = useState([]);
  const [publicGroupNum, setPublicGroupNum] = useState(0);
  const [privateGroups, setPrivateGroups] = useState([]);
  const [privateGroupNum, setPrivateGroupNum] = useState(0);
  const [trendingGroup, setTrendingGroups] = useState([]);
  const [rightGroup, setRightGroups] = useState([]);
  const [rightGroupNum, setRightGroupNum] = useState(0);

  // State to indicate the current page of groups fetched
  const [currentPubGroupPage, setCurPubGroupPageNum] = useState(1);
  const [currentPriGroupPage, setCurPriGroupPageNum] = useState(1);
  const [currentRtGroupPage, setCurRtGroupPageNum] = useState(1);

  // State to store posts
  const [postFetched, setPostFetched] = useState([]);
  const [currentPostPage, setCurPostPage] = useState(1);

  // State to indicate the number of posts fetched
  const [postNum, setPostNum] = useState(0);

  // Sort
  const [curJoined, setCurJoined] = useState([]);
  const [isSortGroup, setIsSortGroup] = useState(false);
  // 1 for time 2 for post 3 for member 4 for tag
  const [sortType, setSortType] = useState(1);
  const [allTags, setAllTags] = useState([]);
  const [curTagIdx, setCurTagIdx] = useState(0);

  const onGroupCateChange = (key) => {
    setActiveTabKey1(key);
  };

  // Pagination onChange function - public groups
  const onPubGroupPageChange = async (current) => {
    const result = await getPublicGroups(5, current);
    setCurPubGroupPageNum(current);
    setPublicGroups(result.data);
  };

  // Pagination onChange function - private groups
  const onPriGroupPageChange = async (current) => {
    const result = await getPrivateGroups(5, current);
    setCurPriGroupPageNum(current);
    setPrivateGroups(result.data);
  };

  // Pagination onChange function - trending groups
  const onRtGroupPageChange = async (current) => {
    if (sortType === 1) {
      const res = await getGroupsSortTime(5, current);
      setCurRtGroupPageNum(current);
      setRightGroups(res.data);
      setRightGroupNum(res.total);
    } else if (sortType === 2) {
      const res = await getGroupsSortPost(5, current);
      setCurRtGroupPageNum(current);
      setRightGroups(res.data);
      setRightGroupNum(res.total);
    } else if (sortType === 3) {
      const res = await getGroupsSortMember(5, current);
      setCurRtGroupPageNum(current);
      setRightGroups(res.data);
      setRightGroupNum(res.total);
    } else if (sortType === 4) {
      const res = await getGroupsByTag(allTags[curTagIdx]._id, 5, current);
      setCurRtGroupPageNum(current);
      setRightGroups(res.data);
      setRightGroupNum(res.total);
    }
  };

  // Function to fetch more post data while scrolling
  const fetchPostAfterScroll = async () => {
    const { data } = await getHomePosts(5, currentPostPage + 1);
    setPostFetched([...postFetched, ...data]);
    setCurPostPage(currentPostPage + 1);
  };

  // Check the group use status
  const checkJoinedStatus = async (arr) => {
    const result = [];
    for (let i = 0; i < arr.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const res = await checkUserGroupStatus(arr[i]._id);
      result.push(res.data !== null);
    }
    return result;
  };

  // Selected handler
  const selectHandler = async (idx) => {
    setCurRtGroupPageNum(1);
    setIsSortGroup(true);
    setSortType(4);
    setCurTagIdx(idx);
    const res = await getGroupsByTag(allTags[idx]._id, 5, 1);
    setRightGroupNum(res.total);
    setRightGroups(res.data);
  };

  // Effect Hooks

  useEffect(() => {
    setLoading(true);

    // Fetch data for group list
    const fetchGroups = async () => {
      // public
      const resultPub = await getPublicGroups(5, currentPubGroupPage);
      setPublicGroups(resultPub.data);
      setPublicGroupNum(resultPub.total);

      // private
      const resultPri = await getPrivateGroups(5, currentPubGroupPage);
      setPrivateGroups(resultPri.data);
      setPrivateGroupNum(resultPri.total);

      // trending
      const resultTrd = await getTrendingGroups();
      setTrendingGroups(resultTrd.data);

      // tags
      const tags = await getAllTags();
      setAllTags(tags.data);
    };
    // Execute fetch function
    fetchGroups();

    // Fetch data for posts to be displayed in the home page
    const fetchPosts = async () => {
      const result = await getHomePosts(5, 1);
      setPostFetched(result.data);
      setPostNum(result.total);
    };
    // Execute fetch function
    fetchPosts();

    setLoading(false);
  }, []);

  useEffect(async () => {
    setLoading(true);
    if (isSortGroup) {
      if (sortType === 1) {
        const res = await getGroupsSortTime(5, 1);
        setCurRtGroupPageNum(1);
        setRightGroups(res.data);
        setRightGroupNum(res.total);
      } else if (sortType === 2) {
        const res = await getGroupsSortPost(5, 1);
        setCurRtGroupPageNum(1);
        setRightGroups(res.data);
        setRightGroupNum(res.total);
      } else if (sortType === 3) {
        const res = await getGroupsSortMember(5, 1);
        setCurRtGroupPageNum(1);
        setRightGroups(res.data);
        setRightGroupNum(res.total);
      }
    } else {
      const resultTrd = await getTrendingGroups();
      setTrendingGroups(resultTrd.data);
    }
    setLoading(false);
  }, [isSortGroup, sortType]);

  useEffect(async () => {
    // Joined Status
    let arr = [];
    if (!isSortGroup) {
      arr = await checkJoinedStatus(trendingGroup);
    } else {
      arr = await checkJoinedStatus(rightGroup);
    }
    setCurJoined(arr);
  }, [trendingGroup, rightGroup]);

  // Input suffix - create a post
  const suffix = (
    <FileImageOutlined
      style={{
        fontSize: 16,
        color: "#a9a9a9",
      }}
    />
  );

  return (
    <div>
      <Spin spinning={loading} size="large">
        <Layout>
          <Content style={{ marginTop: "100px" }}>
            <Row style={{ marginBottom: "30px" }}>
              <Col offset={6} span={10}>
                <Card style={{ width: "120%" }}>
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
                        id="postBtn"
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
                        style={{ marginLeft: "15px" }}
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
                        style={{ marginLeft: "15px" }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col span={1} />
              <Col span={4}>
                <Card
                  style={{ width: "110%", height: "600px" }}
                  title="My Groups"
                  tabList={tabList}
                  activeTabKey={activeTabKey1}
                  onTabChange={(key) => {
                    onGroupCateChange(key);
                  }}
                >
                  <div style={{ height: "300px" }}>
                    {publicGroupNum === 0 ? (
                      <Empty description={false} />
                    ) : activeTabKey1 === "public" ? (
                      publicGroups.map((item) => (
                        <div
                          key={item.groupDocs[0]._id}
                          style={{ marginTop: "20px", marginBottom: "20px" }}
                        >
                          <div className="group-item">
                            <Avatar src={item.groupDocs[0].avatarUrl} />
                            <Link
                              className="group-item-title"
                              to={`/user/group/${item.groupDocs[0]._id}`}
                            >
                              {item.groupDocs[0].name}
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      privateGroups.map((item) => (
                        <div
                          key={item.groupDocs[0]._id}
                          style={{ marginTop: "20px", marginBottom: "20px" }}
                        >
                          <div className="group-item">
                            <Avatar src={item.groupDocs[0].avatarUrl} />
                            <Link
                              className="group-item-title"
                              to={`/user/group/${item.groupDocs[0]._id}`}
                            >
                              {item.groupDocs[0].name}
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {activeTabKey1 === "public" ? (
                    <Pagination
                      style={{ marginTop: "40px", textAlign: "center" }}
                      size="small"
                      total={publicGroupNum}
                      pageSize={5}
                      current={currentPubGroupPage}
                      onChange={onPubGroupPageChange}
                    />
                  ) : (
                    <Pagination
                      style={{ marginTop: "40px", textAlign: "center" }}
                      size="small"
                      total={privateGroupNum}
                      pageSize={5}
                      current={currentPriGroupPage}
                      onChange={onPriGroupPageChange}
                    />
                  )}

                  <div style={{ marginTop: "30px" }}>
                    <Button
                      style={{ width: "100%" }}
                      type="primary"
                      onClick={() => {
                        history.push("/user/create_group");
                      }}
                    >
                      CREATE GROUP
                    </Button>
                  </div>
                </Card>
              </Col>
              <Col span={1} />
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
                        key={item.post._id}
                        style={{ width: "100%", marginBottom: "30px" }}
                      >
                        <Avatar
                          src={item.userDocs[0].avatarUrl}
                          style={{ marginRight: "20px" }}
                        />
                        <span className="post-item-author">
                          Posted by{" "}
                          <Link to={`/user/${item.userDocs[0]._id}`}>
                            {item.userDocs[0].name}
                          </Link>{" "}
                          <Timestamp relative date={item.post.date} /> in{" "}
                          <Link to={`/user/group/${item.groupDocs[0]._id}`}>
                            {item.groupDocs[0].name}
                          </Link>
                        </span>
                        <div className="post-item-title">{item.post.title}</div>
                        <div className="post-item-content">
                          {item.post.content}
                        </div>
                        <div className="post-item-image-container">
                          {item.post.hasVideo === true ? (
                            // eslint-disable-next-line jsx-a11y/media-has-caption
                            <video width="100%" controls>
                              <source src={item.post.mediaUrl[0]} />
                              Your browser does not support video element
                            </video>
                          ) : item.post.hasAudio === true ? (
                            // eslint-disable-next-line jsx-a11y/media-has-caption
                            <audio controls>
                              <source src={item.post.mediaUrl[0]} />
                              Your browser does not support audio element.
                            </audio>
                          ) : (
                            <Image
                              src={item.post.mediaUrl[0]}
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
                              history.push(`/user/post/${item.post._id}`);
                            }}
                          >
                            Comment
                          </Button>

                          {item.userDocs[0]._id !== user.id && (
                            <Button
                              size="large"
                              type="text"
                              icon={<FlagOutlined />}
                              onClick={() => {
                                history.push(`/user/post/${item.post._id}`);
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
                              history.push(`/user/post/${item.post._id}`);
                            }}
                          >
                            Hide
                          </Button>

                          {item.userDocs[0]._id === user.id ||
                          item.status[0].isAdmin === true ? (
                            <Button
                              size="large"
                              type="text"
                              icon={<DeleteOutlined />}
                              danger
                              onClick={() => {
                                history.push(`/user/post/${item.post._id}`);
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
                <Card
                  style={{
                    width: "110%",
                    height: "600px",
                  }}
                  title="Trending Groups"
                  extra={
                    <Popover
                      trigger="click"
                      title={<>Sort By</>}
                      content={
                        <div>
                          <div>
                            <Button
                              size="small"
                              onClick={() => {
                                setIsSortGroup(true);
                                setSortType(1);
                              }}
                            >
                              Latest
                            </Button>
                            <Button
                              size="small"
                              onClick={() => {
                                setIsSortGroup(true);
                                setSortType(2);
                              }}
                            >
                              Posts
                            </Button>
                            <Button
                              size="small"
                              onClick={() => {
                                setIsSortGroup(true);
                                setSortType(3);
                              }}
                            >
                              Members
                            </Button>
                            <Button
                              size="small"
                              onClick={() => {
                                setIsSortGroup(false);
                              }}
                            >
                              Suggest
                            </Button>
                          </div>
                          <div
                            style={{ marginTop: "5px", marginBottom: "5px" }}
                          >
                            Or Tag:
                          </div>
                          <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Search to Select"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            onSelect={(e) => selectHandler(e)}
                          >
                            {allTags.map((item, index) => (
                              <Option key={item._id} value={index}>
                                {item.name}
                              </Option>
                            ))}
                          </Select>
                        </div>
                      }
                    >
                      <Button size="small">
                        <SortAscendingOutlined />
                      </Button>
                    </Popover>
                  }
                >
                  <div style={{ overflow: "scroll", height: "450px" }}>
                    {isSortGroup
                      ? rightGroup.map((item, index) => (
                          <div key={item._id}>
                            <Card style={{ backgroundColor: "#eeeeee" }}>
                              <Row
                                height="100px"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Col span={6}>
                                  <Avatar size={32} src={item.avatarUrl} />
                                </Col>
                                <Col span={18}>
                                  <Link to={`/user/group/${item._id}`}>
                                    {item.name}
                                  </Link>
                                </Col>
                              </Row>
                              <Row
                                style={{
                                  marginTop: "20px",
                                }}
                              >
                                {curJoined[index] ? (
                                  <Button
                                    size="small"
                                    block
                                    type="primary"
                                    disabled
                                  >
                                    Joined
                                  </Button>
                                ) : (
                                  <Button
                                    size="small"
                                    block
                                    type="primary"
                                    href={`/user/group/${item._id}`}
                                    style={{ marginTop: "10px" }}
                                  >
                                    Have a look
                                  </Button>
                                )}
                              </Row>
                            </Card>
                            <Divider />
                          </div>
                        ))
                      : trendingGroup.map((item, index) => (
                          <div key={item._id}>
                            <Card style={{ backgroundColor: "#eeeeee" }}>
                              <Row
                                height="100px"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Col span={6}>
                                  <Avatar size={32} src={item.avatarUrl} />
                                </Col>
                                <Col span={18}>
                                  <Link to={`/user/group/${item._id}`}>
                                    {item.name}
                                  </Link>
                                </Col>
                              </Row>
                              <Row
                                style={{
                                  marginTop: "20px",
                                }}
                              >
                                {curJoined[index] ? (
                                  <Button
                                    size="small"
                                    block
                                    type="primary"
                                    disabled
                                  >
                                    Joined
                                  </Button>
                                ) : (
                                  <Button
                                    size="small"
                                    block
                                    type="primary"
                                    href={`/user/group/${item._id}`}
                                    style={{ marginTop: "10px" }}
                                  >
                                    Have a look
                                  </Button>
                                )}
                              </Row>
                            </Card>
                            <Divider />
                          </div>
                        ))}
                  </div>
                  <Pagination
                    style={
                      isSortGroup
                        ? {
                            marginTop: "20px",
                            textAlign: "center",
                            display: "block",
                          }
                        : {
                            marginTop: "20px",
                            textAlign: "center",
                            display: "none",
                          }
                    }
                    size="small"
                    total={rightGroupNum}
                    pageSize={5}
                    current={currentRtGroupPage}
                    onChange={onRtGroupPageChange}
                  />
                </Card>
              </Col>
              <Col span={1} />
            </Row>
            <div style={{ height: "300px" }} />
          </Content>
        </Layout>
      </Spin>
    </div>
  );
}
