/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from "react";

// Antd
import {
  Layout,
  Spin,
  Card,
  Row,
  Col,
  Avatar,
  Image,
  Button,
  Form,
  Input,
  Comment,
  Divider,
  Empty,
  notification,
  Typography,
  Tooltip,
  Popconfirm,
} from "antd";
import {
  FlagOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
  FlagFilled,
} from "@ant-design/icons";

// Third-party package
import Timestamp from "react-timestamp";
import InfiniteScroll from "react-infinite-scroll-component";

// Router
import { Link, useLocation, useHistory } from "react-router-dom";

// Redux
import { useSelector } from "react-redux";

// API
import {
  getPostById,
  getCommentByPostId,
  createComment,
  editComment,
  createFlag,
  enableHide,
  checkHide,
  deletePost,
  deleteComment,
} from "../../services/post";
import { checkUserGroupRelation } from "../../services/user";
import {
  notifyAdminFlag,
  notifyAuthorDelete,
  notifyFlaggerDelete,
  oneProcessAllProcessE7,
} from "../../services/notification";

// Component
const { Content } = Layout;
const { TextArea } = Input;
const { Paragraph } = Typography;

function PostDetail() {
  // Router
  const location = useLocation();
  const history = useHistory();

  // Redux
  const user = useSelector((state) => state);

  // State

  // State to indicate whether the whole page is first time loading
  const [loading, setLoading] = useState(false);

  // State to indicate whether the whole page is first time loading
  const [submitting, setSubmitting] = useState(false);

  // State to indicate the current page of comment
  const [currentPage, setCurPage] = useState(1);

  // State to store the content in the comment editor
  const [content, setContent] = useState(null);

  // State to store the content of post fetched
  const [postFetched, setPostFetched] = useState({
    userDocs: {},
    groupDocs: {},
    mediaUrl: [],
  });

  // State to store comments fetched
  const [commentFetched, setCommentFetched] = useState([]);
  const [commentNum, setCommentNum] = useState(0);

  // State to store the relation between current user and group current post belongs to
  const [currentRelation, setCurRelation] = useState({});

  // Effect Hook

  // Function to fetch post
  const fetchPost = async (postId) => {
    try {
      // Fetch post
      const response = await getPostById(postId);

      if (response.deactivated) {
        return history.push("/404");
      }

      setPostFetched({ ...response.data[0] });

      // Get whether the current user is the admin of the group this post belongs to
      const relation = await checkUserGroupRelation(
        response.data[0].groupDocs._id
      );

      // if user does not belongs to this group, check if this group is private
      if (!relation.data && response.data[0].groupDocs.isPrivate) {
        history.push("/403");
      }

      if (!relation.data) {
        return setCurRelation({ isAdmin: false });
      }
      setCurRelation(relation.data);

      return response;
    } catch (err) {
      if (err.response.status === 404 || err.response.status === 400) {
        return history.push("/404");
      }
      return err;
    }
  };

  // Function to check if current user has hidden this post
  const checkHideStatus = async (postId) => {
    try {
      const hideExisted = await checkHide(postId);
      if (hideExisted.success && hideExisted.exist) {
        history.push("/404");
      }
      return hideExisted;
    } catch (err) {
      return err;
    }
  };

  // Function for user to flag a post
  const flagPost = async () => {
    try {
      const postId = location.pathname.split("/")[3];
      const response = await createFlag(postId);

      if (response.success) {
        notifyAdminFlag(postFetched.groupDocs._id, postId);
        notification.success({
          message: "Flag Successful",
          description: `Post "${postFetched.title}" has been flagged. Administrators will get involved soon.`,
        });
        fetchPost(postId);
      }
    } catch (err) {
      notification.error({
        message: "Flag Failed",
        description: "Oops! Some errors occurred.",
      });
    }
  };

  // Function for user to hide a post
  const hidePost = async () => {
    try {
      const postId = location.pathname.split("/")[3];
      const response = await enableHide(postId);

      if (response.success) {
        notification.success({
          message: "Hide Successful",
          description: `Post "${postFetched.title}" has been hidden.`,
        });
        history.push("/user/home");
      }
    } catch (err) {
      notification.error({
        message: "Hide Failed",
        description: "Oops! Some errors occurred.",
      });
    }
  };

  // Function to handle post deletion
  const handlePostDelete = async () => {
    try {
      const postId = location.pathname.split("/")[3];
      if (currentRelation.isAdmin) {
        notifyAuthorDelete(postFetched.userDocs._id, postId);
        oneProcessAllProcessE7(
          postFetched.userDocs._id,
          postId,
          postFetched.groupDocs._id
        );
        notifyFlaggerDelete(postId);
      }
      const response = await deletePost(postId);
      if (response.success) {
        notification.success({
          message: "Delete Successful",
          description: `Post "${postFetched.title}" has been deleted.`,
        });
        history.push("/user/home");
      }
    } catch (err) {
      notification.error({
        message: "Delete Failed",
        description: "Oops! Some errors occurred.",
      });
    }
  };

  // Function to fetch comments of the given post
  // eslint-disable-next-line consistent-return
  const fetchComment = async (postId, page, size) => {
    try {
      const response = await getCommentByPostId(postId, page, size);
      setCommentFetched([...response.data]);
      setCommentNum(response.total);
    } catch (err) {
      return err;
    }
  };

  // Function to fetch more comment data while scrolling
  const fetchCommentAfterScroll = async () => {
    const idInPath = location.pathname.split("/")[3];
    const { data } = await getCommentByPostId(idInPath, currentPage + 1, 5);
    setCommentFetched([...commentFetched, ...data]);
    setCurPage(currentPage + 1);
  };

  useEffect(() => {
    setLoading(true);

    const idInPath = location.pathname.split("/")[3];
    checkHideStatus(idInPath);
    fetchPost(idInPath);
    fetchComment(idInPath, 1, 5);

    setLoading(false);
  }, []);

  // Editor functions

  const handleSubmit = async () => {
    if (!content) {
      return;
    }
    setSubmitting(true);
    const idInPath = location.pathname.split("/")[3];
    const reqbody = { postId: idInPath, content };

    try {
      const response = await createComment(reqbody);
      if (response.success) {
        notification.success({
          message: "Comment Created",
          description: `Comment has been made on post '${postFetched.title}'`,
        });
        setContent(null);
        setSubmitting(false);
        fetchComment(idInPath, 1, currentPage * 5);
      }
    } catch (err) {
      notification.error({
        message: "Comment Creation Failed",
        description: "Oops! Some errors occurred.",
      });
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  // Function to edit content of comment
  const handleCommentEdit = async (value, commentId) => {
    if (!value) {
      return;
    }
    const reqBody = { content: value };
    const response = await editComment(commentId, reqBody);

    try {
      if (response.success) {
        notification.success({
          message: "Edit Successful",
          description: `The change of your comment is effective.`,
        });

        // reload data
        const idInPath = location.pathname.split("/")[3];
        fetchComment(idInPath, 1, currentPage * 5);
      }
    } catch (err) {
      notification.error({
        message: "Edit Failed",
        description: "Oops! Some errors occurred.",
      });
    }
  };

  const handleCommentDelete = async (value) => {
    try {
      const response = await deleteComment(value);
      if (response.success) {
        notification.success({
          message: "Delete Successful",
          description: `Your comment has been deleted.`,
        });

        // reload data
        const idInPath = location.pathname.split("/")[3];
        fetchComment(idInPath, 1, currentPage * 5 - 1);
      }
    } catch (err) {
      notification.error({
        message: "Delete Failed",
        description: "Oops! Some errors occurred.",
      });
    }
  };

  return (
    <div>
      <Spin spinning={loading} size="large">
        <Layout>
          <Content style={{ marginTop: "100px" }}>
            <Row justify="center">
              <Col span={14}>
                <Card style={{ width: "100%", marginBottom: "30px" }}>
                  <Avatar
                    src={postFetched.userDocs.avatarUrl}
                    style={{ marginRight: "20px" }}
                  />
                  <span className="post-item-author">
                    Posted by{" "}
                    <Link to={`/user/${postFetched.userDocs._id}`}>
                      {postFetched.userDocs.name}
                    </Link>{" "}
                    <Timestamp relative date={postFetched.date} /> in{" "}
                    <Link to={`/user/group/${postFetched.groupDocs._id}`}>
                      {postFetched.groupDocs.name}
                    </Link>
                  </span>
                  <div className="post-item-title">{postFetched.title}</div>
                  <div className="post-item-content">{postFetched.content}</div>
                  <div className="post-item-image-container">
                    {postFetched.hasVideo === true ? (
                      // eslint-disable-next-line jsx-a11y/media-has-caption
                      <video width="100%" controls>
                        <source src={postFetched.mediaUrl[0]} />
                        Your browser does not support video element
                      </video>
                    ) : postFetched.hasAudio === true ? (
                      // eslint-disable-next-line jsx-a11y/media-has-caption
                      <audio controls>
                        <source src={postFetched.mediaUrl[0]} />
                        Your browser does not support audio element.
                      </audio>
                    ) : (
                      <Image
                        src={postFetched.mediaUrl[0]}
                        className="post-item-image"
                        fallback="data:image/png;base64,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"
                      />
                    )}
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    {postFetched.userDocs._id !== user.id &&
                      (postFetched.flagged ? (
                        <Button
                          disabled
                          size="large"
                          type="text"
                          icon={
                            <FlagFilled
                              style={{
                                color: "#40cfa4",
                              }}
                            />
                          }
                        >
                          <span
                            style={{
                              color: "#40cfa4",
                            }}
                          >
                            Flag
                          </span>
                        </Button>
                      ) : (
                        <Button
                          size="large"
                          onClick={flagPost}
                          type="text"
                          icon={<FlagOutlined />}
                        >
                          Flag
                        </Button>
                      ))}

                    <Button
                      size="large"
                      type="text"
                      onClick={hidePost}
                      icon={<EyeInvisibleOutlined />}
                    >
                      Hide
                    </Button>

                    {postFetched.userDocs._id === user.id ||
                    currentRelation.isAdmin === true ? (
                      <Button
                        size="large"
                        type="text"
                        onClick={handlePostDelete}
                        icon={<DeleteOutlined />}
                        danger
                      >
                        Delete
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                </Card>

                <Divider style={{ marginTop: "50px" }}>Comments</Divider>
                <Card style={{ width: "100%", marginBottom: "30px" }}>
                  <Comment
                    avatar={<Avatar src={user.avatarUrl} alt={user.name} />}
                    content={
                      <div>
                        <Form.Item>
                          <TextArea
                            rows={4}
                            onChange={handleChange}
                            value={content}
                            maxLength={2048}
                            autoSize={{ minRows: 4, maxRows: 20 }}
                            allowClear
                            showCount
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button
                            htmlType="submit"
                            loading={submitting}
                            onClick={handleSubmit}
                            type="primary"
                            disabled={!content}
                          >
                            ADD COMMENT
                          </Button>
                        </Form.Item>
                      </div>
                    }
                  />
                  {commentNum === 0 ? (
                    <Empty style={{ marginTop: "10px" }} />
                  ) : (
                    <InfiniteScroll
                      dataLength={commentFetched.length}
                      next={fetchCommentAfterScroll}
                      hasMore={commentNum !== commentFetched.length}
                      loader={<h4>Loading...</h4>}
                      endMessage={
                        <p
                          style={{
                            textAlign: "center",
                            color: "#40cfa4",
                            marginTop: "50px",
                          }}
                        >
                          Yay! You have seen it all
                        </p>
                      }
                    >
                      {commentFetched.map((item) => (
                        <Comment
                          actions={[
                            <Tooltip
                              key="comment-basic-like"
                              title="Delete your comment"
                            >
                              {item.userId === user.id && (
                                <Popconfirm
                                  title="Are you sure to delete this comment?"
                                  onConfirm={() =>
                                    handleCommentDelete(item._id)
                                  }
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <span role="button">
                                    <span
                                      style={{
                                        marginLeft: "10px",
                                      }}
                                      className="comment-action"
                                    >
                                      Delete
                                    </span>
                                  </span>
                                </Popconfirm>
                              )}
                            </Tooltip>,
                          ]}
                          key={item._id}
                          author={
                            <Link to={`/user/${item.userId}`}>{item.name}</Link>
                          }
                          avatar={
                            <Avatar src={item.avatarUrl} alt={item.name} />
                          }
                          content={
                            item.userId === user.id ? (
                              <Paragraph
                                style={{
                                  marginLeft: "1%",
                                  marginTop: "1%",
                                  width: "100%",
                                }}
                                editable={{
                                  onChange: (value) =>
                                    handleCommentEdit(value, item._id),
                                  maxLength: 2048,
                                  autoSize: { maxRows: 10, minRows: 3 },
                                }}
                              >
                                {item.content}
                              </Paragraph>
                            ) : (
                              <Paragraph
                                style={{
                                  marginLeft: "1%",
                                  marginTop: "1%",
                                  width: "100%",
                                }}
                              >
                                {item.content}
                              </Paragraph>
                            )
                          }
                          datetime={<Timestamp relative date={item.date} />}
                        />
                      ))}
                    </InfiniteScroll>
                  )}
                </Card>
              </Col>
            </Row>
            <div style={{ height: "200px" }} />
          </Content>
        </Layout>
      </Spin>
    </div>
  );
}

export default PostDetail;
