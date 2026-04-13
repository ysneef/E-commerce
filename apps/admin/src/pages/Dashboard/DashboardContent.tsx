import {
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Typography,
  Spin,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";

import { Line } from "@ant-design/charts";
import { AdminApi } from "../../api/apiRequest";

const { Title } = Typography;

const DashboardContent = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // ================= FETCH =================
  const fetchDashboard = async () => {
    setLoading(true);

    try {
      const res = await AdminApi.axiosGet({
        data: { endpoint: "/api/dashboard" },
      });

      if (res?.status === 200) {
        setData(res.data); // data.users là số lượng user role "user"
      } else {
        console.error("API lỗi:", res);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <Spin size="large" />;

  // ================= CHART =================
  const chartConfig = {
    data: data?.monthlyRevenue || [],
    xField: "month",
    yField: "value",
    smooth: true,
    height: 300,
  };

  // ================= TABLE =================
  const columns = [
    {
      title: "Product Name",
      dataIndex: "name", // hiển thị tên sản phẩm
      key: "name",
    },
    {
      title: "Orders",
      dataIndex: "quantity", // số lượng sản phẩm được order
      key: "quantity",
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (val: number) => `$${val.toFixed(2)}`, // format tiền
    },
  ];



  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Dashboard
      </h2>

      {/* ===== STATS ===== */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Users"
              value={data?.users || 0} // trực tiếp số lượng user role "user"
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Orders"
              value={data?.orders || 0}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Revenue"
              value={data?.revenue || 0}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
      </Row>

      {/* ===== CHART ===== */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col span={24}>
          <Card title="Revenue by Month">
            <Line {...chartConfig} />
          </Card>
        </Col>
      </Row>

      {/* ===== TABLE ===== */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col span={24}>
          <Card title="Top Products">
            <Table
              dataSource={data?.topProducts || []}
              columns={columns}
              rowKey="_id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardContent;
