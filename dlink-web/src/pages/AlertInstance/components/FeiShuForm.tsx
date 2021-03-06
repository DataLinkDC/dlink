/*
 *
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */


import React, {useState} from 'react';
import {Button, Divider, Form, Input, Modal, Radio, Switch} from 'antd';
import {AlertInstanceTableListItem} from "@/pages/AlertInstance/data";
import {buildJSONData, getJSONData} from "@/pages/AlertInstance/function";
import {ALERT_TYPE} from "@/pages/AlertInstance/conf";

export type AlertInstanceFormProps = {
  onCancel: (flag?: boolean) => void;
  onSubmit: (values: Partial<AlertInstanceTableListItem>) => void;
  onTest: (values: Partial<AlertInstanceTableListItem>) => void;
  modalVisible: boolean;
  values: Partial<AlertInstanceTableListItem>;
};

const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};

const FeiShuForm: React.FC<AlertInstanceFormProps> = (props) => {

  const [form] = Form.useForm();
  const [formVals, setFormVals] = useState<Partial<AlertInstanceTableListItem>>({
    id: props.values?.id,
    name: props.values?.name,
    type: ALERT_TYPE.FEISHU,
    params: props.values?.params,
    enabled: props.values?.enabled,
  });

  const {
    onSubmit: handleSubmit,
    onTest: handleTest,
    onCancel: handleModalVisible,
    modalVisible,
  } = props;

  const onValuesChange = (change: any,all: any)=>{
    setFormVals({...formVals,...change});
  };

  const submitForm = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals(buildJSONData(formVals,fieldsValue));
    handleSubmit(buildJSONData(formVals,fieldsValue));
  };

  const sendTestForm = async () => {
    const fieldsValue = await form.getFieldsValue();
    setFormVals(buildJSONData(formVals,fieldsValue));
    handleTest(buildJSONData(formVals,fieldsValue));
  };

  const renderContent = (vals) => {
    return (
      <>
        <Divider>????????????</Divider>
        <Form.Item
          name="name"
          label="??????"
          rules={[{required: true, message: '??????????????????'}]}
        >
          <Input placeholder="???????????????"/>
        </Form.Item>
        <Form.Item
          name="webhook"
          label="??????"
          rules={[{required: true, message: '?????????WebHook???'}]}
        >
          <Input placeholder="?????????WebHook"/>
        </Form.Item>
        <Form.Item
          name="keyword"
          label="?????????"
        >
          <Input placeholder="?????????keyword"/>
        </Form.Item>
        <Form.Item
          name="secret"
          label="??????"
        >
          <Input placeholder="?????????secret"/>
        </Form.Item>
        <Form.Item
          name="isEnableProxy"
          label="????????????">
          <Switch checkedChildren="???" unCheckedChildren="???"
                  defaultChecked={vals.isEnableProxy}/>
        </Form.Item>
        {vals.isEnableProxy?<>
          <Form.Item
            name="proxy"
            label="??????"
          >
            <Input placeholder="?????????proxy"/>
          </Form.Item>
          <Form.Item
            name="port"
            label="?????????"
          >
            <Input placeholder="?????????port"/>
          </Form.Item>
          <Form.Item
            name="user"
            label="??????"
          >
            <Input placeholder="?????????user"/>
          </Form.Item>
          <Form.Item
            name="password"
            label="??????"
          >
            <Input.Password placeholder="?????????password"/>
          </Form.Item></>:undefined
        }
        <Form.Item
          name="isAtAll"
          label="@?????????">
          <Switch checkedChildren="??????" unCheckedChildren="??????"
                  defaultChecked={vals.isAtAll}/>
        </Form.Item>
        { ( !vals.isAtAll )&&
          <Form.Item
            name="users"
            label="???@??????"
            rules={[{required: true, message: '????????????@???????????????????????????!',}]}
          >
            <Input placeholder="????????????@??????ID(???????????????????????????ID),??????????????????!"/>
          </Form.Item>
        }
        <Form.Item
          name="enabled"
          label="????????????">
          <Switch checkedChildren="??????" unCheckedChildren="??????"
                  defaultChecked={vals.enabled}/>
        </Form.Item>
        <Form.Item
          name="msgtype"
          label="????????????"
          rules={[{required: true, message: '????????????????????????'}]}
        >
          <Radio.Group >
            <Radio value='post'>?????????</Radio>
            <Radio value='text'>??????</Radio>
          </Radio.Group>
        </Form.Item>
      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleModalVisible(false)}>??????</Button>
        <Button type="primary" onClick={() => sendTestForm()}>??????</Button>
        <Button type="primary" onClick={() => submitForm()}>
          ??????
        </Button>
      </>
    );
  };


  return (
    <Modal
      width={1200}
      bodyStyle={{padding: '32px 40px 48px'}}
      destroyOnClose
      title={formVals.id?"????????????????????????":"????????????????????????"}
      visible={modalVisible}
      footer={renderFooter()}
      onCancel={() => handleModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={getJSONData(formVals)}
        onValuesChange={onValuesChange}
      >
        {renderContent(getJSONData(formVals))}
      </Form>
    </Modal>
  );
};

export default FeiShuForm;
