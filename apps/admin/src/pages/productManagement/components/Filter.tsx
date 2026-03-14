import { Col, Form, FormProps, Input, Row, Tag } from "antd";
import React, { JSX, useEffect, useState } from "react";
import FilterDropdown from "./FilterDropdown";

export interface TypeCriteriaProduct {
  page: number;
  pageSize: number;
  connectionIds?: string[];
  freeText?: string;
  status?: string[];
  orderBy?: string;
  category?: string[];
  brand?: string[];
}

interface IFormFilterProps extends FormProps {
  onSearch: (values: TypeCriteriaProduct) => void;
  criteria: TypeCriteriaProduct;
  loading: boolean;
  visible: boolean;
}

const FilterProduct: React.FC<IFormFilterProps> = ({ onSearch, criteria, loading, visible }) => {
  const [form] = Form.useForm();
  const [modalType, setModalType] = useState<null | "status" | "category" | "brand">(null);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form]);

  // useEffect(() => {
  //   form.setFieldsValue({
  //     freeText: criteria.freeText,
  //     status: criteria.status,
  //     category: criteria.category,
  //     brand: criteria.brand,
  //   });
  // }, [JSON.stringify(criteria), form]);

  const handleSearch = () => {
    const values = form.getFieldsValue();
    console.log("🚀 ~ handleSearch ~ values:", values)
    const payload: TypeCriteriaProduct = {
      page: criteria.page,
      pageSize: criteria.pageSize,
      freeText: values.freeText?.trim(),
      status: values.status,
      category: values.category,
      brand: values.brand,
    };
    onSearch(payload);
  };

  const handleRemoveFilter = (filter: string, value?: any) => {
    const currentValues = form.getFieldsValue();
    if (filter === "freeText") {
      form.setFieldsValue({ freeText: undefined });
    } else if (filter === "status" && value) {
      form.setFieldsValue({
        status: currentValues.status?.filter((s: string) => s !== value),
      });
    } else if (filter === "category" && value) {
      form.setFieldsValue({
        category: currentValues.category?.filter((c: string) => c !== value),
      });
    } else if (filter === "brand" && value) {
      form.setFieldsValue({
        brand: currentValues.brand?.filter((b: string) => b !== value),
      });
    }
    handleSearch();
  };

  const renderTags = () => {
    const values = form.getFieldsValue();
    const tags: JSX.Element[] = [];

    if (values.status !== undefined) {
      tags.push(
        <Tag
          key={`status-${status}`}
          onClick={() => setModalType("status")}
          closable
          onClose={(e) => {
            e.preventDefault();
            handleRemoveFilter("status", status);
          }}
          color={values.status ? "green" : "red"}
        >
          Status {values.status ? "Active" : "Inactive"}
        </Tag>
      );
    }

    if (values.category?.length) {
      tags.push(
        ...values.category.map((category: string) => (
          <Tag
            key={`category-${category}`}
            onClick={() => setModalType("category")}
            closable
            onClose={(e) => {
              e.preventDefault();
              handleRemoveFilter("category", category);
            }}
            color="orange"
          >
            Category: {category}
          </Tag>
        ))
      );
    }

    if (values.brand?.length) {
      tags.push(
        ...values.brand.map((brand: string) => (
          <Tag
            key={`brand-${brand}`}
            onClick={() => setModalType("brand")}
            closable
            onClose={(e) => {
              e.preventDefault();
              handleRemoveFilter("brand", brand)
            }}
            color="purple"
            
          >
            Brand: {brand}
          </Tag>
        ))
      );
    }

    return tags.length > 0 ? (
      <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tags}
      </div>
    ) : null;
  };

  return (
    <Form 
      form={form} 
      layout="horizontal" 
      style={{ marginBottom: 10 }}
    >
      <Row gutter={[10, 10]} align="middle">
        
        <Col flex="auto">
          <Form.Item name="freeText" noStyle>
            <Input.Search
              placeholder="Product"
              allowClear
              enterButton="Search"
              size="large"
              loading={loading}
              onSearch={(value) => {
                if (!value) {
                  form.setFieldsValue({ freeText: undefined });
                }
                handleSearch();
              }}
            />
          </Form.Item>
        </Col>

        <Col>
          <FilterDropdown
            onApplyFilters={handleSearch}
            modalType={modalType}
            setModalType={setModalType}
          />
        </Col>

      </Row>

      {renderTags()}
    </Form>
  );
};

export default FilterProduct;