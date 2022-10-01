import { io } from "socket.io-client";

// const socket = io(`${process.env.REACT_ENDPOINT}`);
const socket = io("http://localhost:5001");

export default socket;
