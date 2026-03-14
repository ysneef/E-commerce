import React from "react";
import { Drawer } from "antd";
import ReactJson from '@uiw/react-json-view';

interface DrawerViewJsonProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  title?: string
}

const DrawerViewJson: React.FC<DrawerViewJsonProps> = ({ isOpen, onClose, data, title }) => {
  return (
    <Drawer
      title={title ?? "View Json"}
      placement="right"
      width={600}
      onClose={onClose}
      open={isOpen}
    >
      {data ? <ReactJson value={data} /> : "Invalid data!"}
    </Drawer>
  );
};

export default DrawerViewJson;
