/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from "react";
import { Menu, Badge, Avatar, Divider } from "antd";
import PropTypes from "prop-types";
import instance from "../../utils/request";
import store from "../../store/store";

function Contacts(props) {
  const {
    setIsSameGroup,
    setCurChatmateId,
    arrivalMessage,
    messageSent,
    setMessageSent,
  } = props;
  Contacts.propTypes = {
    setIsSameGroup: PropTypes.func.isRequired,
    setCurChatmateId: PropTypes.func.isRequired,
    arrivalMessage: PropTypes.instanceOf(Object).isRequired,
    messageSent: PropTypes.bool.isRequired,
    setMessageSent: PropTypes.func.isRequired,
  };
  const [contacts, setContacts] = useState([]);
  const myInfo = store.getState();

  useEffect(() => {
    if (messageSent) {
      setMessageSent(false);
    }
    instance.get(`/api/chat`).then((res) => setContacts(res.data));
  }, [arrivalMessage, messageSent]);
  return (
    <div
      style={{
        width: 240,
        height: 500,
        borderRadius: "20px 0px 0px 20px",
        paddingTop: "10px",
        overflow: "scroll",
        backgroundColor: "#ffffff",
        marginRight: 1,
      }}
    >
      <div
        style={{
          width: 240,
          fontSize: "20px",
          marginTop: "50px",
          marginLeft: "25px",
          color: "#40cfa4",
        }}
        orientation="left"
      >
        Contacts
      </div>
      <Divider dashed />
      <Menu mode="inline" style={{ width: 241 }}>
        {contacts.map((obj) => (
          <Menu.Item
            key={obj.senderId === myInfo.id ? obj.receiverId : obj.senderId}
            style={{
              width: 200,
              borderRadius: "10px",
              marginLeft: "20px",
              paddingLeft: "10px",
              paddingTop: "25px",
              paddingBottom: "25px",
            }}
            onClick={async (e) => {
              setCurChatmateId(e.key);
              const res = await instance.get(`/api/chat/same/${e.key}`);
              setIsSameGroup(res.data);
            }}
          >
            <Badge>
              <Avatar src={`${obj.avatarUrl}`} shape="round" size="medium" />
            </Badge>
            {obj.name}
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
}

export default Contacts;
