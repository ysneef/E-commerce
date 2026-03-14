import { Col, Form, Input, Row } from "antd"
import { FormProps } from "antd/lib"
import _ from "lodash"
import React, { useEffect } from "react"

export interface TypeCriteriaUser {
  page: number
  pageSize: number
  connectionIds?: string[]
  freeText?: string
  orgId?: string
  scroll?: number
  scrollId?: string
  status?: string[]
  templateIds?: string[]
  toSyncedTime?: number
  categories?: string[]
  tags?: string[]
  orderBy?: string
}

interface IFormFilterProps extends FormProps {
  onSearch: (values: any) => void
  criteria: TypeCriteriaUser
  loading: boolean
  //   item: any
  visible: boolean
}

const FilterUser: React.FC<IFormFilterProps> = (props) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (!props.visible) {
      form.resetFields()
    }
  }, [props.visible])

  useEffect(() => {
    if (props.criteria.freeText) {
      form.setFieldsValue({ freeText: props.criteria.freeText })
    }
  }, [props.criteria])

  const onSearch = () => {
    form
      .validateFields()
      .then((values) => {
        const searchValue = values.userName?.trim()
        const payload = {
          freeText: searchValue,
        }
        props.onSearch(payload)
      })
      .catch((err) => {
        console.log("Validation Failed:", err)
      })
  }

  return (
    <Form form={form} layout="horizontal" title="Search">
      <Row gutter={[10, 10]} align="middle">
        <Col xs={5}>
          <Form.Item label="" name="userName">
            <Input.Search
              onPressEnter={onSearch}
              onSearch={onSearch}
              placeholder="Search by name"
              allowClear
              enterButton="Search"
              size="large"
              loading={props.loading}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default FilterUser
