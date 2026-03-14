import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout } from "antd";
import { ReactNode, useState } from "react";
import HeaderBar from "../layout/HeaderBar";
import SiderMenu from "./SiderMenu";

const { Sider, Header, Content } = Layout;

interface LayoutWrapperProps {
  children: ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={230}
        style={{ background: "#fff" }}
      >
        <SiderMenu collapsed={collapsed} />
      </Sider>

      {/* Main layout */}
      <Layout>
        
        {/* Header */}
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            size="large"
          />

          <HeaderBar />
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: "16px",
            padding: "20px",
            background: "#fff",
            borderRadius: "8px"
          }}
        >
          {children}
        </Content>

      </Layout>
    </Layout>
  );
};

export default LayoutWrapper;
