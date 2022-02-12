import { io } from "socket.io-client";

const socket = io("ws://localhost:8900");

export default socket;
