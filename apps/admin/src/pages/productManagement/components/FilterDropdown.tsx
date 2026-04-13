import { FilterOutlined } from "@ant-design/icons";
import { Button, Dropdown, Form, Menu, Modal, Radio, Select } from "antd";
import React from "react";
import CategorySelect from "./drawer/DrawerAddUpdateProductForm/CategorySelect";

interface FilterDropdownProps {
  onApplyFilters: () => void;
  modalType: "status" | "category" | "brand" | null;
  setModalType: React.Dispatch<
    React.SetStateAction<"status" | "category" | "brand" | null>
  >;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  onApplyFilters,
  modalType,
  setModalType,
}) => {

  const closeModal = () => {
    setModalType(null);
  };

  const menu = (
    <Menu
      onClick={({ key }) =>
        setModalType(key as "status" | "category" | "brand")
      }
      items={[
        { key: "status", label: "Status" },
        { key: "category", label: "Category" },
        { key: "brand", label: "Brand" },
      ]}
    />
  );

  return (
    <>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button type="primary" size="large">
          <FilterOutlined /> Filter
        </Button>
      </Dropdown>

      {/* Status Filter */}
      <Modal
        title="Filter by Status"
        open={modalType === "status"}
        onCancel={closeModal}
        onOk={() => {
          onApplyFilters();
          closeModal();
        }}
      >
        <Form.Item name="status">
          <Radio.Group>
            <Radio value={true}>Active</Radio>
            <Radio value={false}>Inactive</Radio>
          </Radio.Group>
        </Form.Item>
      </Modal>

      {/* Category Filter */}
      <Modal
        title="Filter by Category"
        open={modalType === "category"}
        onCancel={closeModal}
        onOk={() => {
          onApplyFilters();
          closeModal();
        }}
      >
        <Form.Item name="category" label="Category">
          <CategorySelect multiple="multiple" />
        </Form.Item>
      </Modal>

      {/* Brand Filter */}
      <Modal
        title="Filter by Brand"
        open={modalType === "brand"}
        onCancel={closeModal}
        onOk={() => {
          onApplyFilters();
          closeModal();
        }}
      >
        <Form.Item name="brand" label="Brand">
          <Select mode="multiple" placeholder="Select brand">
            <Select.Option value="Nike">Nike</Select.Option>
            <Select.Option value="Adidas">Adidas</Select.Option>
            <Select.Option value="Puma">Puma</Select.Option>
            <Select.Option value="New Balance">New Balance</Select.Option>
            <Select.Option value="Reebok">Reebok</Select.Option>
            <Select.Option value="Skechers">Skechers</Select.Option>
            <Select.Option value="Asics">Asics</Select.Option>
          </Select>
        </Form.Item>
      </Modal>
    </>
  );
};

export default FilterDropdown;
