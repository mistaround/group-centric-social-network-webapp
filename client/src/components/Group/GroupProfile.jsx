import React, { useState, useEffect } from "react";

// Antd
import {
  Layout,
  Spin,
  Row,
  Col,
  Button,
  Pagination,
  Avatar,
  Card,
  Empty,
  Select,
  Statistic,
  Typography,
  Tag,
  Divider,
  Table,
  notification,
  Modal,
  Form,
  message,
  Upload,
  Input,
} from "antd";
import {
  LockOutlined,
  CalendarOutlined,
  UserOutlined,
  ReadOutlined,
  FileImageOutlined,
  FlagOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
  CrownOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  InboxOutlined,
  GiftOutlined,
  WechatOutlined,
} from "@ant-design/icons";

// Redux
import { useSelector } from "react-redux";

// Router
import { Link, useHistory } from "react-router-dom";

// API
import {
  getPublicGroups,
  getPrivateGroups,
  getGroupById,
  updateGroupInfo,
} from "../../services/group";
import {
  getUserById,
  getUserByGroup,
  checkUserGroupRelation,
  promoteUser,
  demoteUser,
  searchUser,
} from "../../services/user";
import {
  notifyMemberPromotion,
  notifyInviteeDecision,
} from "../../services/notification";

// Token
import { getToken } from "../../utils/auth";
import createChat from "../../services/chat";

const { Content } = Layout;
const { Option } = Select;
const { Title, Paragraph } = Typography;
const { Dragger } = Upload;
const { Search } = Input;
const { Meta } = Card;

function GroupProfile() {
  // Router
  const history = useHistory();

  // Redux
  const currentUser = useSelector((state) => state);

  // State:

  // search bar loading state
  const [searching, setSearching] = useState(false);
  const [userSearched, setUserSearched] = useState(null);

  // State to indicate that the page is in the first time loading
  const [loading, setLoading] = useState(true);

  // State to indicate active tab in Grouplist
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

  // State to indicate whether the avatar setting modal should be visible
  const [avatarFormVisible, setAvatarFormVisible] = useState(false);
  // State to indicate whether backend has reset the avatar
  const [avatarStatus, setAvatarStatus] = useState(false);
  // State to store the status of file upload
  const [uploadRes, setUploadRes] = useState(null);

  // State to store all users in the selected group
  const [usersInSelGroup, setUsersInSelGroup] = useState(null);

  // State to store the relation between current user and selected group
  const [currentRelation, setCurRelation] = useState(null);

  // State to store the pagination states of table
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // State to store all types of groups fetched
  const [groupFetched, setGroupFetched] = useState([]);

  // State to store the group selected
  const [groupSelected, setGroupSelected] = useState(null);

  // State to store groups
  const [publicGroups, setPublicGroups] = useState([]);
  const [publicGroupNum, setPublicGroupNum] = useState(0);
  const [privateGroups, setPrivateGroups] = useState([]);
  const [privateGroupNum, setPrivateGroupNum] = useState(0);

  // State to indicate the current page of groups fetched
  const [currentPubGroupPage, setCurPubGroupPageNum] = useState(1);
  const [currentPriGroupPage, setCurPriGroupPageNum] = useState(1);

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

  // Select component functions
  const onChange = async (value) => {
    const response = await getGroupById(value);
    const owner = await getUserById(response.data.owner);
    const users = await getUserByGroup(value, 1, 5);

    const relation = await checkUserGroupRelation(value);
    setTotal(users.total);
    setCurRelation(relation.data);
    setUsersInSelGroup(users.data);
    setGroupSelected({ ...response.data, ownerName: owner.data.name });
  };

  // Table functions
  const handlePromote = async (record) => {
    try {
      const response = await promoteUser({
        userId: record.user._id,
        groupId: groupSelected._id,
      });
      if (response.success) {
        notifyMemberPromotion(record.user._id, groupSelected._id);
        notification.success({
          message: "User Promoted",
          description: `${record.user.name} is now an administrator of ${groupSelected.name}`,
        });
      }
      // Reload data
      const users = await getUserByGroup(groupSelected._id, page, 5);
      setUsersInSelGroup(users.data);
      return users;
    } catch (err) {
      notification.error({
        message: "User Promotion Failed",
        description: "Oops! Some errors occurred.",
      });
      return err;
    }
  };

  const handleDemote = async (record) => {
    try {
      const response = await demoteUser({
        userId: record.user._id,
        groupId: groupSelected._id,
      });
      if (response.success) {
        const res = await checkUserGroupRelation(groupSelected._id);
        setCurRelation(res.data);
        notification.success({
          message: "User Demoted",
          description: `${record.user.name} is no more the administrator of ${groupSelected.name}`,
        });
      }
      // Reload data
      const users = await getUserByGroup(groupSelected._id, page, 5);
      setUsersInSelGroup(users.data);
      return users;
    } catch (err) {
      notification.error({
        message: "User Demotion Failed",
        description: "Oops! Some errors occurred.",
      });
      return err;
    }
  };

  const onPageChange = async (current) => {
    setPage(current);
    const response = await getUserByGroup(groupSelected._id, current, 5);
    setUsersInSelGroup(response.data);
  };

  // Function to check if the user fetched is in group selected
  const checkJoin = (userId) => {
    for (let i = 0; i < usersInSelGroup.length; i += 1) {
      if (userId === usersInSelGroup[i].user._id) {
        return true;
      }
    }
    return false;
  };

  // Function to create a chat
  const initializeChat = async (senderId, receiverId) => {
    try {
      const data = { senderId, receiverId };
      const response = await createChat(data);
      if (response.success) {
        history.push("/user/chat");
      }
      return response;
    } catch (err) {
      return notification.error({
        message: "Create Chat Failed",
        description: "Oops! Some errors occurred.",
      });
    }
  };

  // Table parameters

  const paginationProps = {
    showTotal: () => `${total} items in total`,
    current: page,
    pageSize: 5,
    total,
    onChange: (current) => onPageChange(current),
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "user",
      key: "name",
      align: "center",
      render: (user) => {
        if (user._id === groupSelected.owner) {
          return (
            <div>
              <CrownOutlined
                style={{
                  color: "#FFD700",
                  marginRight: "10px",
                }}
              />
              {user.name}
              <Button
                style={{ marginLeft: "10px" }}
                disabled={currentUser.id === user._id}
                type="primary"
                icon={<WechatOutlined />}
                onClick={() => initializeChat(currentUser.id, user._id)}
              />
            </div>
          );
        }
        return (
          <div>
            <span>{user.name}</span>
            <Button
              style={{ marginLeft: "10px" }}
              disabled={currentUser.id === user._id}
              type="primary"
              icon={<WechatOutlined />}
              onClick={() => initializeChat(currentUser.id, user._id)}
            />
          </div>
        );
      },
    },

    {
      title: "Role",
      dataIndex: "isAdmin",
      key: "isAdmin",
      align: "center",
      render: (isAdmin) => {
        if (isAdmin) {
          return <Tag color="#40CFA4">ADMIN</Tag>;
        }
        return <Tag color="#DEE8E3">MEMBER</Tag>;
      },
    },

    {
      title: "Action",
      key: "action",
      align: "center",
      // eslint-disable-next-line consistent-return
      render: (record) => {
        if (record.user._id === groupSelected.owner) {
          return (
            <div>
              No operations allowed for the owner{" "}
              <CrownOutlined style={{ color: "#FFD700" }} /> :)
            </div>
          );
        }
        if (currentRelation.isAdmin) {
          if (record.isAdmin) {
            return (
              <Button
                type="danger"
                icon={<UserDeleteOutlined />}
                size="small"
                onClick={() => handleDemote(record)}
              >
                Revoke
              </Button>
            );
          }
          return (
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              size="small"
              onClick={() => handlePromote(record)}
            >
              Promote
            </Button>
          );
        }
        return <div>Not authorized to conduct any operation.</div>;
      },
    },
  ];

  // Functions used in effect hook and render the whole page
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
  };

  const fetchGroupsForSelect = async () => {
    // Get the number of two type groups
    const temp1 = await getPublicGroups(1, 1);
    const temp2 = await getPrivateGroups(1, 1);
    const publicNum = temp1.total;
    const privateNum = temp2.total;

    const pubGroups = await getPublicGroups(publicNum, 1);
    const priGroups = await getPrivateGroups(privateNum, 1);

    setGroupFetched([...pubGroups.data, ...priGroups.data]);
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
      const response = await updateGroupInfo(groupSelected._id, reqBody);
      if (response.success) {
        fetchGroups();
        fetchGroupsForSelect();
        const res = await getGroupById(groupSelected._id);
        const owner = await getUserById(res.data.owner);
        setGroupSelected({ ...res.data, ownerName: owner.data.name });

        notification.success({
          message: "Group Avatar Changed",
          description: `Hope you members like it.`,
        });
      }
      setAvatarFormVisible(false);
      setAvatarStatus(false);
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

  // Search Bar functions
  const handleSearch = async (value) => {
    if (!value) {
      return 0;
    }

    try {
      setSearching(true);
      const response = await searchUser(value);
      setUserSearched(response.data);
      setSearching(false);

      return response;
    } catch (err) {
      message.error(`Cannot find user named ${value}.`, 5);
      setSearching(false);
      return err;
    }
  };

  // Invite searched user
  const inviteUser = async (invitee, inviter, group) => {
    notifyInviteeDecision(invitee, inviter, group);
    notification.success({
      message: "Invitation Sent",
      description: `Your invitation has been sent to ${userSearched.name}.`,
    });
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

  // Function to change the about group content
  const changeAboutGroupInDB = async (value) => {
    try {
      const response = await updateGroupInfo(groupSelected._id, {
        aboutGroup: value,
      });
      if (response.success) {
        const res = await getGroupById(groupSelected._id);
        setGroupSelected(res.data);
        notification.success({
          message: "Edit Successful",
          description: `The change of about content for ${groupSelected.name} has been saved.`,
        });
      }
      return response;
    } catch (err) {
      notification.error({
        message: "Edit Failed",
        description: "Oops! Some errors occurred.",
      });
      return err;
    }
  };

  // Effect Hooks
  useEffect(() => {
    setLoading(true);
    // Execute fetch function
    fetchGroups();
    fetchGroupsForSelect();
    setLoading(false);
  }, []);

  return (
    <div>
      <Spin spinning={loading} size="large">
        <Layout>
          <Content style={{ marginTop: "100px" }}>
            <Row justify="space-around">
              <Col span={4} />
              <Col span={16}>
                <Select
                  style={{ width: "60%" }}
                  showSearch
                  onChange={onChange}
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
              </Col>
            </Row>
            <Row style={{ marginTop: "30px" }} justify="space-around">
              <Col span={4}>
                <Card
                  style={{ width: "110%", height: "100% !important" }}
                  title="My Groups"
                  tabList={tabList}
                  activeTabKey={activeTabKey1}
                  onTabChange={(key) => {
                    onGroupCateChange(key);
                  }}
                >
                  {publicGroupNum === 0 ? (
                    <Empty description={false} />
                  ) : activeTabKey1 === "public" ? (
                    publicGroups.map((item) => (
                      <div className="group-item" key={item.groupDocs[0]._id}>
                        <Avatar src={item.groupDocs[0].avatarUrl} />
                        <Link
                          className="group-item-title"
                          to={`/user/group/${item.groupDocs[0]._id}`}
                        >
                          {item.groupDocs[0].name}
                        </Link>
                      </div>
                    ))
                  ) : (
                    privateGroups.map((item) => (
                      <div className="group-item" key={item.groupDocs[0]._id}>
                        <Avatar src={item.groupDocs[0].avatarUrl} />
                        <Link
                          className="group-item-title"
                          to={`/user/group/${item.groupDocs[0]._id}`}
                        >
                          {item.groupDocs[0].name}
                        </Link>
                      </div>
                    ))
                  )}
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
              <Col span={16}>
                {groupSelected ? (
                  <Card title="Group Inforamtion">
                    <Row align="middle">
                      <Avatar
                        style={{ marginRight: "10px" }}
                        onClick={() => {
                          if (currentRelation.isAdmin) {
                            showAvatarModal();
                          }
                        }}
                        size={150}
                        src={groupSelected.avatarUrl}
                      />

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
                                Support for a single upload. Strictly prohibit
                                from uploading company data or other band files
                              </p>
                            </Dragger>
                          </Form.Item>
                        </Form>
                      </Modal>

                      <Title level={4}>
                        {groupSelected.name}
                        {!groupSelected.isPrivate ? (
                          <ReadOutlined
                            style={{ marginLeft: "20px", color: "#40CFA4" }}
                          />
                        ) : (
                          <LockOutlined
                            style={{ marginLeft: "20px", color: "#40CFA4" }}
                          />
                        )}
                      </Title>
                      <div
                        style={{
                          marginLeft: "3%",
                          transform: "translateY(-20%)",
                        }}
                      >
                        {groupSelected.tags.map((item) => (
                          <Tag key={item.tagDocs[0].name} color="#40CFA4">
                            {item.tagDocs[0].name}
                          </Tag>
                        ))}
                      </div>
                    </Row>
                    <Row style={{ marginTop: "20px", marginLeft: "10%" }}>
                      <Col span={8}>
                        <Statistic
                          title="Registration Date"
                          value={groupSelected.date.split("T")[0]}
                          prefix={<CalendarOutlined />}
                        />
                      </Col>

                      <Col span={8}>
                        <Statistic
                          title="Number of Members"
                          value={groupSelected.userNum}
                          prefix={<UserOutlined />}
                        />
                      </Col>

                      <Col span={8}>
                        <Statistic
                          title="Number of Posts"
                          value={groupSelected.postNum}
                          prefix={<FileImageOutlined />}
                        />
                      </Col>
                    </Row>
                    <Row
                      style={{ marginTop: "50px", marginLeft: "10%" }}
                      justify="space-around"
                    >
                      <Col span={8}>
                        <Statistic
                          title="Number of Posts Flagged"
                          value={groupSelected.flagNum}
                          prefix={<FlagOutlined />}
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic
                          title="Number of Posts Hidden"
                          value={groupSelected.userNum}
                          prefix={<EyeInvisibleOutlined />}
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic
                          title="Number of Posts Deleted"
                          value={groupSelected.postDelNum}
                          prefix={<DeleteOutlined />}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Divider style={{ marginTop: "40px" }} orientation="left">
                        About Group
                      </Divider>

                      {currentRelation.isAdmin ? (
                        <Paragraph
                          style={{
                            marginLeft: "10%",
                            marginTop: "1%",
                            width: "100%",
                          }}
                          editable={{
                            onChange: changeAboutGroupInDB,
                            maxLength: 2048,
                            autoSize: { maxRows: 10, minRows: 3 },
                          }}
                        >
                          {groupSelected.aboutGroup
                            ? groupSelected.aboutGroup
                            : "It's still empty! What about telling us something different? :)"}
                        </Paragraph>
                      ) : (
                        <Paragraph
                          style={{
                            marginLeft: "10%",
                            marginTop: "1%",
                            width: "100%",
                          }}
                        >
                          {groupSelected.aboutGroup}
                        </Paragraph>
                      )}
                    </Row>

                    <Row style={{ marginTop: "30px" }}>
                      <Divider orientation="left">Invite User</Divider>
                    </Row>
                    <Row style={{ marginBottom: "20px" }}>
                      <Search
                        placeholder="Please input an exact username"
                        enterButton="Search"
                        size="default"
                        onSearch={handleSearch}
                        loading={searching}
                      />
                    </Row>
                    <Row justify="center">
                      {userSearched && (
                        <Card
                          hoverable
                          style={{ width: 240 }}
                          cover={
                            <img
                              alt={userSearched.name}
                              src={userSearched.avatarUrl}
                            />
                          }
                          actions={
                            !checkJoin(userSearched._id) && [
                              <GiftOutlined
                                onClick={() =>
                                  inviteUser(
                                    userSearched._id,
                                    currentUser.id,
                                    groupSelected._id
                                  )
                                }
                                key="Invite"
                              />,
                            ]
                          }
                        >
                          <Meta
                            title={userSearched.name}
                            description={userSearched.date.split("T")[0]}
                          />
                        </Card>
                      )}
                    </Row>
                    <Row style={{ marginTop: "30px" }}>
                      <Divider orientation="left">Group Memebers</Divider>
                    </Row>
                    <Row>
                      <Table
                        pagination={paginationProps}
                        style={{ width: "100%" }}
                        columns={columns}
                        dataSource={usersInSelGroup}
                        rowKey={(record) => record.user._id}
                      />
                    </Row>
                  </Card>
                ) : (
                  <p style={{ color: "#5c5c5c" }}>
                    Please select a group to view detailed info
                  </p>
                )}
              </Col>
            </Row>
            <div style={{ height: "300px" }} />
          </Content>
        </Layout>
      </Spin>
    </div>
  );
}

export default GroupProfile;
