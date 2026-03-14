import Lottie from "react-lottie";
import animationData from "../../public/Animation - 1744982668892.json";


const DashboardContent = () => {
  // const columns = [
  //   {
  //     title: "Product",
  //     dataIndex: "product",
  //     key: "product",
  //   },
  //   {
  //     title: "Orders",
  //     dataIndex: "orders",
  //     key: "orders",
  //   },
  //   {
  //     title: "Value",
  //     dataIndex: "value",
  //     key: "value",
  //   },
  //   {
  //     title: "Refunds",
  //     dataIndex: "refunds",
  //     key: "refunds",
  //   },
  // ]

  // const dataSource = [
  //   {
  //     key: "1",
  //     product: "Nike V22 Running",
  //     orders: "8,232",
  //     value: "$130,992",
  //     refunds: "13",
  //   },
  //   {
  //     key: "2",
  //     product: "Business Kit (Mug + Notebook)",
  //     orders: "12,821",
  //     value: "$80,250",
  //     refunds: "40",
  //   },
  //   {
  //     key: "3",
  //     product: "Black Chair",
  //     orders: "2,421",
  //     value: "$40,600",
  //     refunds: "54",
  //   },
  // ]
  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData, 
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <>
      {/* <Title level={2} style={{ marginBottom: 24 }}>
        Dashboard Overview
      </Title> */}

      {/* <Row gutter={[16, 16]}>
        {["Today's Users", "Revenue", "Followers"].map((title, index) => (
          <Col span={8} key={index}>
            <Card bordered={false} hoverable>
              <Statistic
                title={title}
                value={
                  index === 1 ? 34000
                  : index === 2 ?
                    91
                  : 2300
                }
                prefix={index === 1 ? "$" : undefined}
                suffix={index === 0 ? "Users" : undefined}
                valueStyle={{ color: "#3f8600" }}
                prefix={<ArrowUpOutlined />}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
        <Col span={24}>
          <Card title="Top Selling Products" bordered={false} hoverable>
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={{ pageSize: 5 }}
            />
            <Text type="secondary">Updated just now</Text>
          </Card>
        </Col>
      </Row> */}
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative">
          <div className="absolute top-0 left-0 w-full h-full z-0">
            <Lottie options={defaultOptions} height="100%" width="100%" />
          </div>
          
          <div className="relative z-10 text-center p-8 bg-white bg-opacity-80 rounded-xl shadow-lg">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Dashboard Overview</h1>
            <p className="text-xl text-gray-700 mb-6">Wishing you a productive day! 🎯</p>
          </div>
        </div>
    </>
  )
}

export default DashboardContent
