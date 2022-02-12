/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Col, Empty, Layout, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import Messenger from "../components/Chat/Messenger";
import Contacts from "../components/Chat/Contacts";
import instance from "../utils/request";
import socket from "../utils/socket";

function Chat() {
  const history = useHistory();
  const [yourInfo, setYourInfo] = useState({ _id: "0" });
  const [curChatmateId, setCurChatmateId] = useState(null);
  const [chatId, setChatId] = useState("0");
  const [isSameGroup, setIsSameGroup] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState({});
  const [messageSent, setMessageSent] = useState(false);
  // Socket Stuff
  useEffect(() => {
    socket.on("getMessage", (data) => {
      if (history.location.pathname === "/user/chat") {
        setArrivalMessage({
          senderId: data.senderId,
          receiverId: data.receiverId,
          chatId: data.chatId,
          type: data.type,
          text: data.text,
        });
      }
    });
  }, []);
  useEffect(() => {
    const getYourInfo = async () => {
      try {
        instance
          .get(`/api/user/${curChatmateId}`)
          .then((res) => setYourInfo(res.data));
      } catch (err) {
        return err;
      }
    };
    if (curChatmateId !== null) {
      getYourInfo();
    }
  }, [curChatmateId]);
  return (
    <div>
      <Layout>
        <Content style={{ marginTop: "100px", height: `calc(100vh - 64px)` }}>
          <Row>
            <Col span={4} />
            <Col span={20} style={{ marginTop: "20px" }}>
              <Row>
                <Contacts
                  setIsSameGroup={setIsSameGroup}
                  setCurChatmateId={setCurChatmateId}
                  arrivalMessage={arrivalMessage}
                  setMessageSent={setMessageSent}
                  messageSent={messageSent}
                />
                {curChatmateId ? (
                  <>
                    <Messenger
                      yourInfo={yourInfo}
                      chatId={chatId}
                      isSameGroup={isSameGroup}
                      arrivalMessage={arrivalMessage}
                      setChatId={setChatId}
                      setMessageSent={setMessageSent}
                    />
                  </>
                ) : (
                  <div
                    style={{
                      height: 500,
                      width: 750,
                      borderRadius: "0px 20px 20px 0px",
                      backgroundColor: "#ffffff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "0 16px",
                    }}
                  >
                    <Empty />
                  </div>
                )}
              </Row>
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  );
}

export default Chat;
