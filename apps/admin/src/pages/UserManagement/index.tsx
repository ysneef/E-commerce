import { DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { Avatar, Button, Table, Tag, Tooltip, notification, Popconfirm } from "antd"
import moment from "moment"
import { useState } from "react"
import { useAsyncRetry } from "react-use"
import { maskPhone } from "../../Utils/Funtions"
import { InfoList } from "../../components/InfoList"
import UserApi from "./api/User.api"
import FilterUser from "./components/Filter"
import AddUser from "./components/drawer/AddUser"
import { TUser } from "./models/User.model"

const ROLE_TAG_CONFIG = {
  admin: { color: "red", label: "Admin" },
  user: { color: "blue", label: "User" },
};

const UserManagement = () => {
  const [api, contextHolder] = notification.useNotification();

  const [criteria, setCriteria] = useState({
    loading: false,
    payload: {
      page: 1,
      pageSize: 10,
      role: undefined,
      createdAt: undefined,
    },
  })

  const { value, error, loading, retry } = useAsyncRetry(
    () => UserApi.getUser(criteria.payload),
    [criteria]
  )

  const [isAdding, setIsAdding] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [loadingAction, setLoadingAction] = useState(false);


  const handleSearch = (values: any) => {
    setCriteria((prev) => ({
      ...prev,
      payload: {
        ...prev.payload,
        ...values,
        page: 1, // Reset về trang đầu khi tìm kiếm
      },
    }))
  }

  const handleAddUser = async (values: any) => {
    try {
      setIsAdding(true);
      const response = await UserApi.createUser(values);
      console.log("🚀 ~ handleAddUser ~ response:", response)

      if (!response.success) {
        api.error({
          message: "Error",
          description: response.message || "Invalid data!",
        });
        return;
      }

      api.success({
        message: "Success",
        description: "User added successfully!",
      });

      setOpenForm(false);
      retry();
    } catch (error) {
      console.log("🚀 ~ handleAddUser ~ error:", error);
    } finally {
      setIsAdding(false);
    }
  };


  const handleTableChange = (pagination: any) => {
    setCriteria((prev) => ({
      ...prev,
      payload: {
        ...prev.payload,
        page: pagination.current,
        pageSize: pagination.pageSize,
      },
    }));
  };

  if (error)
    return (
      <div className="text-center text-xl text-red-500">
        Error: {error.message}
      </div>
    )

  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => {
        const { page = 1, pageSize = 10 } = criteria.payload || {};
        return (page - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      width: 90,
      render: (avatar: any) => (
        <Avatar src={avatar||"https://storage.googleapis.com/pangocdp-images/p-act/public/c9385ae058a24a129175d183ec46711e.png"} size={"large"} />
      ),
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      render: (phone: any) => (
        <Tooltip title={phone}>{maskPhone(phone, 2, 4)}</Tooltip>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 180,
      ellipsis: true,
      render: (address: any) => (
        <Tooltip title={address||"--/--"}>{address||"--/--"}</Tooltip>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: string) => {
        const { color = "default", label = role } = ROLE_TAG_CONFIG[role as keyof typeof ROLE_TAG_CONFIG] || {};
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (createdAt: any) => (
        <Tooltip title={moment(createdAt).format("DD/MM/YYYY HH:mm:ss")}>
          {moment(createdAt).fromNow()}
        </Tooltip>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_: any, record: TUser) => (
        <Popconfirm
          title="Delete user"
          description="Are you sure you want to delete this user?"
          onConfirm={() => handleDeleteUser(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Tooltip title="Delete">
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
              loading={loadingAction}
            />
          </Tooltip>
        </Popconfirm>
      ),
    },
  ]

  const handleDeleteUser = async (id: string) => {
    try {
      setLoadingAction(true);
      const response = await UserApi.deleteUser(id);

      if (response.success) {
        api.success({
          message: "Success",
          description: "User deleted successfully!",
        });
        retry();
      } else {
        api.error({
          message: "Error",
          description: response.message || "Failed to delete user!",
        });
      }
    } catch (error) {
      console.log("🚀 ~ handleDeleteUser ~ error:", error);
      api.error({
        message: "Error",
        description: "An error occurred while deleting user!",
      });
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        User List
      </h2>
      <FilterUser
        loading={loading}
        criteria={criteria.payload}
        visible={true}
        onSearch={handleSearch}
      />
      <InfoList
        right={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenForm(true)}>
            Add
          </Button>
        }
        list={value ? value?.data.length : 0}
        refresh={retry}
      />
      <Table
        loading={loading}
        dataSource={value?.data}
        columns={columns}
        rowKey="_id"
        // pagination={false}
        style={{marginTop: 10}}
        scroll={{ x: 'calc(700px + 50%)' }}
        pagination={{
          current: criteria.payload.page,
          pageSize: criteria.payload.pageSize,
          total: value?.totalItems || 0,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
        onChange={handleTableChange}
      />
      <AddUser
        visible={openForm}
        onSubmit={handleAddUser} 
        onCancel={() => setOpenForm(false)} 
        loading={isAdding}
        onClose={() => setOpenForm(false)}
      />
      {contextHolder}
    </div>
  )
}

export default UserManagement
