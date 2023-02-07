import { message } from "antd";

export const showMessage = (type, messageText) => {
  switch (type) {
    case "success":
      return message.success(messageText);
    case "info":
      return message.info(messageText);
    case "error":
      return message.error(messageText);
    case "warning":
      return message.warning(messageText);
    default:
      return;
  }
};
