/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Layout, List, Button, Divider } from "antd";
import { Content } from "antd/lib/layout/layout";
import InfiniteScroll from "react-infinite-scroll-component";
import instance from "../utils/request";
import {
  processNotification,
  notifyAdminInvitation,
  notifyAuthorDelete,
  notifyInviterDeniedByInvitee,
  notifyInviteeDenied,
  notifyFlaggerDelete,
  notifyInviterDeniedByAdmin,
  notifyFlaggerNotDelete,
  notifyRequesterDenied,
  oneProcessAllProcessE6,
  oneProcessAllProcessE7,
  oneProcessAllProcessE9,
  oneClickAllClickE2,
  notifyRequesterAccepted,
} from "../services/notification";
import { joinGroup, removeRequest } from "../services/group";
import { deleteFlag, deletePostById, undoFlag } from "../services/post";
import socket from "../utils/socket";

function Notification() {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [newNotification, setNewNotification] = useState(false);

  useEffect(() => {
    const componentDidMount = () => {
      instance.get(`/api/notification?skip=${page}`).then((res) => {
        setData(res.data);
        setTotal(res.total);
        setPage(page + 1);
      });
    };
    componentDidMount();
  }, []);

  const loadMoreData = (num) => {
    if (loading) {
      return;
    }
    setLoading(true);
    instance
      .get(`/api/notification?skip=${page}`)
      .then((res) => {
        setData(res.data);
        setTotal(res.total);
        setPage(page + num);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    socket.on("getNotification", () => {
      if (history.location.pathname === "/user/notification") {
        setNewNotification(true);
        loadMoreData(0);
      }
    });
  }, []);

  useEffect(() => {
    loadMoreData(0);
    return () => {
      setClicked(false);
    };
  }, [clicked]);

  useEffect(() => {
    if (newNotification === true) {
      loadMoreData(0);
      setNewNotification(false);
    }
  }, [newNotification]);

  const clickHandler = async (e, item, type) => {
    e.target.disabled = true;
    if (type === "accept") {
      if (item.eventId === 2) {
        notifyAdminInvitation(item.inviteeId, item.inviterId, item.groupId);
        oneClickAllClickE2(item.groupId, item.inviteeId);
        processNotification(item._id);
      } else if (item.eventId === 6) {
        joinGroup(item.groupId, item.inviteeId);
        notifyRequesterAccepted(item.inviteeId, item.groupId);
        oneProcessAllProcessE6(item.groupId, item.inviterId, item.inviteeId);
      } else if (item.eventId === 7) {
        if (!item.processed) {
          // eventId, groupId, postId, authorId => same notifications
          notifyAuthorDelete(item.authorId, item.postId);
          notifyFlaggerDelete(item.postId);
          oneProcessAllProcessE7(item.groupId, item.postId, item.authorId);
          deletePostById(item.postId);
        }
      } else if (item.eventId === 9) {
        joinGroup(item.groupId, item.requesterId);
        notifyRequesterAccepted(item.requesterId, item.groupId);
        await oneProcessAllProcessE9(item.groupId, item.requesterId);
        removeRequest(item.groupId, item.requesterId);
      }
    } else if (type === "deny") {
      if (item.eventId === 2) {
        notifyInviterDeniedByInvitee(
          item.inviteeId,
          item.inviterId,
          item.groupId
        );
        oneClickAllClickE2(item.groupId, item.inviteeId);
        processNotification(item._id);
      } else if (item.eventId === 6) {
        if (!item.processed) {
          // eventId, groupId, inviterId, inviteeId => same notifications
          notifyInviteeDenied(item.inviteeId, item.inviterId, item.groupId);
          notifyInviterDeniedByAdmin(
            item.inviteeId,
            item.inviterId,
            item.groupId
          );
          oneProcessAllProcessE6(item.groupId, item.inviterId, item.inviteeId);
        }
      } else if (item.eventId === 7) {
        if (!item.processed) {
          // eventId, groupId, postId, authorId => same notifications
          notifyFlaggerNotDelete(item.postId);
          oneProcessAllProcessE7(item.groupId, item.postId, item.authorId);
          undoFlag(item.postId);
          deleteFlag(item.postId);
        }
      } else if (item.eventId === 9) {
        if (!item.processed) {
          // eventId, groupId, requesterId => same notifications
          notifyRequesterDenied(item.requesterId, item.groupId);
          await oneProcessAllProcessE9(item.groupId, item.requesterId);
          removeRequest(item.groupId, item.requesterId);
        }
      }
    } else {
      processNotification(item._id);
    }
    setClicked(true);
  };

  const choices = (item) => {
    if (item.processed) {
      return (
        <div
          style={{ marginRight: "20px", color: "#40cfa4", fontStyle: "italic" }}
        >
          Processed
        </div>
      );
    }
    return (
      <>
        <div style={{ display: "flex" }}>
          <Button
            key="Accept"
            style={
              item.haveChoice
                ? { display: "block", marginRight: "20px" }
                : { display: "none" }
            }
            onClick={(e) => clickHandler(e, item, "accept")}
          >
            Accept
          </Button>
          <Button
            key="Deny"
            style={
              item.haveChoice
                ? { display: "block", marginRight: "20px" }
                : { display: "none" }
            }
            onClick={(e) => clickHandler(e, item, "deny")}
          >
            Deny
          </Button>
        </div>
        <Button
          key="Read"
          style={
            item.haveChoice
              ? { display: "none" }
              : { display: "block", marginRight: "20px" }
          }
          onClick={(e) => clickHandler(e, item, "read")}
        >
          Read
        </Button>
      </>
    );
  };

  return (
    <div>
      <Layout>
        <Divider
          style={{
            marginTop: "90px",
            fontSize: "24px",
            color: "#40cfa4",
          }}
        >
          Notifications
        </Divider>
        <Content
          style={{
            height: "86vh",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <InfiniteScroll
            style={{
              marginTop: "5px",
              width: "1000px",
              height: "500px",
              backgroundColor: "#FFFFFF",
              overflow: "auto",
              padding: "10px 16px",
              borderRadius: "20px",
            }}
            dataLength={data.length}
            next={() => loadMoreData(1)}
            hasMore={data.length !== total}
          >
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={(item) => (
                <List.Item
                  key={item._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "20px",
                      justifyContent: "space-around",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#777777",
                        marginTop: "10px",
                      }}
                    >
                      {new Date(item.date).toLocaleString()}
                    </p>
                    <p> {item.text} </p>
                  </div>
                  {choices(item)}
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </Content>
      </Layout>
    </div>
  );
}

export default Notification;
