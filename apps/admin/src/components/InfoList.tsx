import * as React from "react"
import { Row, Col, Button, Typography } from "antd"
import { SyncOutlined } from "@ant-design/icons"
import { FormattedNumber, IntlProvider } from "react-intl"

interface Props {
  list: number
  refresh: () => void
  right?: React.ReactNode
  actions?: React.ReactNode
}

export const InfoList = (props: Props) => {
  return (
    <IntlProvider locale="en">
      <Row gutter={[16, 16]} justify="space-between" align="middle">
        <Col>
          <Button
            type="primary"
            size="small"
            icon={<SyncOutlined />}
            shape="circle"
            onClick={props.refresh}
          />
          <Typography.Text className="ml-2 text-primary">
            <strong>
              Found <FormattedNumber value={props.list} /> record(s)
            </strong>
          </Typography.Text>
          {props?.actions ? props?.actions : null}
        </Col>
        {props.right ?
          <Col>{props.right}</Col>
        : null}
      </Row>
    </IntlProvider>
  )
}
