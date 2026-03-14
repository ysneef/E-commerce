import Form, { FormItemProps } from "antd/lib/form";
import React, { ReactNode } from "react"

type Iprops = FormItemProps & {
    children?: ReactNode
    style?: React.CSSProperties
}

export const O2OFormItem = (props: Iprops) =>{
    return <Form.Item {...props} style={{
        ...props.style || {}, ...{
            marginBottom: 0
        }
    }} colon={false} >
        {props.children}
    </Form.Item>
}