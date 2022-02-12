/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from "react";
import { Avatar, Upload, Input, Button, message, Image, Row, Col } from "antd";
import {
  LoadingOutlined,
  SendOutlined,
  PictureOutlined,
  VideoCameraAddOutlined,
  AudioOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import instance from "../../utils/request";
import socket from "../../utils/socket";
import store from "../../store/store";
import { getToken } from "../../utils/auth";
import "./Message.css";

const { TextArea } = Input;

export default function Messenger(props) {
  const {
    yourInfo,
    chatId,
    isSameGroup,
    arrivalMessage,
    setChatId,
    setMessageSent,
  } = props;
  Messenger.propTypes = {
    yourInfo: PropTypes.instanceOf(Object).isRequired,
    arrivalMessage: PropTypes.instanceOf(Object).isRequired,
    chatId: PropTypes.string.isRequired,
    isSameGroup: PropTypes.bool.isRequired,
    setChatId: PropTypes.func.isRequired,
    setMessageSent: PropTypes.func.isRequired,
  };
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPgae] = useState(0);
  const [textValue, setTextValue] = useState("");
  const myInfo = store.getState();

  const sendFile = (file) => {
    let type = "";
    if (file.type === "image/jpeg" || file.type === "image/png") {
      type = "picture";
    } else if (file.type === "audio/mpeg") {
      type = "audio";
    } else {
      type = "video";
    }
    if (yourInfo._id !== "0") {
      const messageBody = {
        senderId: myInfo.id,
        receiverId: yourInfo._id,
        chatId,
        type,
        text: file.response.data.Key,
      };
      try {
        socket.emit("sendMessage", messageBody);
        // No need to async
        instance.post(`/api/message/`, messageBody).then((res) => {
          setMessages([
            { _id: res.data._id, ...messageBody, date: res.data.date },
            ...messages,
          ]);
        });
        instance.put(`/api/user/${yourInfo._id}`, {
          hasNewMessage: true,
        });
        setMessageSent(true);
      } catch (err) {
        return err;
      }
    }
  };

  const fileProps = {
    name: "file",
    headers: { "auth-token": getToken() },
    action: `${process.env.REACT_APP_DOMAIN}/api/file`,
    multiple: false,
    maxCount: 1,
    showUploadList: false,
    disabled: !isSameGroup,
    onChange(info) {
      if (info.file.status === "done") {
        sendFile(info.file);
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  const picProps = {
    ...fileProps,
    beforeUpload(file) {
      const fileTypeValid =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!fileTypeValid) {
        message.error("Only JPEG, PNG are allowed to be uploaded");
      }
      const isLt25M = file.size / 1024 / 1024 < 25;
      if (!isLt25M) {
        message.error("File must smaller than 25MB!");
      }
      return fileTypeValid && isLt25M;
    },
  };
  const audioProps = {
    ...fileProps,
    beforeUpload(file) {
      const fileTypeValid = file.type === "audio/mpeg";
      if (!fileTypeValid) {
        message.error("Only MP3 are allowed to be uploaded");
      }
      const isLt25M = file.size / 1024 / 1024 < 25;
      if (!isLt25M) {
        message.error("File must smaller than 25MB!");
      }
      return fileTypeValid && isLt25M;
    },
  };
  const videoProps = {
    ...fileProps,
    beforeUpload(file) {
      const fileTypeValid = file.type === "video/mp4";
      if (!fileTypeValid) {
        message.error("Only MP4 are allowed to be uploaded");
      }
      const isLt25M = file.size / 1024 / 1024 < 25;
      if (!isLt25M) {
        message.error("File must smaller than 25MB!");
      }
      return fileTypeValid && isLt25M;
    },
  };
  const clickHandler = async () => {
    if (isSameGroup) {
      const textObj = document.getElementById("textArea");
      const text = textObj.value;
      setTextValue("");
      if (yourInfo._id !== "0") {
        const messageBody = {
          senderId: myInfo.id,
          receiverId: yourInfo._id,
          chatId,
          type: "text",
          text,
        };
        try {
          socket.emit("sendMessage", messageBody);
          // No need to async
          instance.post(`/api/message/`, messageBody).then((res) => {
            setMessages([
              { _id: res.data._id, ...messageBody, date: res.data.date },
              ...messages,
            ]);
          });
          instance.put(`/api/user/${yourInfo._id}`, {
            hasNewMessage: true,
          });
          setMessageSent(true);
        } catch (err) {
          return err;
        }
      }
    } else {
      message.info(
        `Sorry, you can't chat with ${yourInfo.name} because you two are not in a same group`
      );
    }
  };

  const loadMoreData = () => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      instance.get(`/api/message/${chatId}?skip=${page + 1}`).then((res) => {
        setMessages(res.data.messages);
        setTotal(res.data.total);
      });
      setPgae(page + 1);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const scrollHandler = () => {
    const div = document.getElementById("infiniteScroll");
    if (messages.length !== total) {
      if (
        0.8 * (div.scrollHeight + Math.round(div.scrollTop)) <=
        div.clientHeight
      ) {
        loadMoreData();
      }
    }
  };

  useEffect(() => {
    const getChatId = async () => {
      try {
        instance.get(`/api/chat/${yourInfo._id}`).then((res) => {
          setChatId(res.data._id);
        });
      } catch (err) {
        return err;
      }
    };
    if (yourInfo._id !== "0") {
      getChatId();
      setPgae(0);
    }
  }, [yourInfo]);

  useEffect(() => {
    if (chatId !== "0") {
      try {
        instance.get(`/api/message/${chatId}?skip=${1}`).then((res) => {
          setMessages(res.data.messages);
          setTotal(res.data.total);
        });
      } catch (err) {
        return err;
      }
    }
  }, [chatId]);

  useEffect(() => {
    if (arrivalMessage.senderId === yourInfo._id) {
      setMessages([arrivalMessage, ...messages]);
      // setMessageReceived(true);
    }
  }, [arrivalMessage]);

  const display = (obj, user) => {
    let inner = obj.text;
    if (obj.type === "picture") {
      inner = (
        <Image width={360} src={`${process.env.REACT_APP_AWS}/${inner}`} />
      );
    } else if (obj.type === "audio") {
      inner = (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio controls>
          <source
            src={`${process.env.REACT_APP_AWS}/${inner}`}
            type="audio/mpeg"
          />
        </audio>
      );
    } else if (obj.type === "video") {
      inner = (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video width="320" height="240" controls>
          <source
            src={`${process.env.REACT_APP_AWS}/${inner}`}
            type="video/mp4"
          />
        </video>
      );
    }
    if (user === "me") {
      return (
        <div key={obj._id} style={{ marginTop: 5, marginBottom: 10 }}>
          <div className="time_me">
            {new Date(obj.date).toLocaleTimeString()}
          </div>
          <div className="message_box_me">
            <Avatar src={`${myInfo.avatarUrl}`} />
            <div className="text_box_me">{inner}</div>
          </div>
        </div>
      );
    }
    return (
      <div key={obj._id} style={{ marginTop: 5, marginBottom: 10 }}>
        <div className="time_you">
          {new Date(obj.date).toLocaleTimeString()}
        </div>
        <div className="message_box_you">
          <Avatar src={`${yourInfo.avatarUrl}`} />
          <div className="text_box_you">{inner}</div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        id="infiniteScroll"
        onScroll={() => scrollHandler()}
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          overflowY: "scroll",
          height: 390,
          width: 750,
          padding: "0 16px",
          borderRadius: "0px 20px 0px 0px",
          backgroundColor: "#ffffff",
        }}
      >
        {messages.map((obj) => {
          if (obj.senderId === myInfo.id) {
            return display(obj, "me");
          }
          return display(obj, "you");
        })}
        <div
          style={
            loading
              ? {
                  marginTop: "10px",
                  display: "flex",
                  flexDirection: "column-reverse",
                  alignItems: "flex-start",
                }
              : { display: "none" }
          }
        >
          <LoadingOutlined />
        </div>
      </div>
      <div>
        <Row
          align="middle"
          justify="space-around"
          style={{
            width: 750,
            marginTop: 1,
            height: 109,
            borderRadius: "0px 0px 20px 0px",
            backgroundColor: "#ffffff",
          }}
        >
          <Col span={1} />
          <Col span={1} style={{ display: "flex", flexDirection: "column" }}>
            <Upload {...picProps}>
              <Button
                size="small"
                icon={<PictureOutlined />}
                style={{ marginTop: 2, marginBottom: 2 }}
              />
            </Upload>
            <Upload {...audioProps}>
              <Button
                size="small"
                icon={<AudioOutlined />}
                style={{ marginTop: 2, marginBottom: 2 }}
              />
            </Upload>
            <Upload {...videoProps}>
              <Button
                size="small"
                icon={<VideoCameraAddOutlined />}
                style={{ marginTop: 2, marginBottom: 2 }}
              />
            </Upload>
          </Col>
          <Col span={1} />
          <Col span={16} style={{ marginTop: 10 }}>
            <TextArea
              id="textArea"
              rows={2}
              showCount
              allowClear
              maxLength={200}
              size="large"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              style={{ width: 500, height: 50, marginBottom: 25, fontSize: 12 }}
            />
          </Col>
          <Col span={1} />
          <Col span={3} style={{ marginBottom: 10 }}>
            <Button
              onClick={() => clickHandler()}
              type="primary"
              shape="round"
              icon={<SendOutlined />}
              size="large"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}
