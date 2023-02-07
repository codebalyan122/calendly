import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const UserAvatar = ({ name, image, size, color, style }) => {
  const avatarSize = size || 64;
  const bgColor = color || "#1890ff";

  return image ? (
    <Avatar
      src={image}
      size={avatarSize}
      style={{ backgroundColor: bgColor }}
    />
  ) : name ? (
    <Avatar size={avatarSize} style={{ backgroundColor: bgColor }}>
      {name}
    </Avatar>
  ) : (
    <Avatar
      size={avatarSize}
      icon={<UserOutlined />}
      style={{ backgroundColor: bgColor }}
    />
  );
};
export default UserAvatar;
