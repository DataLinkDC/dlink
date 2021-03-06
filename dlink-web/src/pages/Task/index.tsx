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


import {DownOutlined, PlusOutlined, UserOutlined} from '@ant-design/icons';
import {Button, message, Input, Drawer, Modal} from 'antd';
import React, {useState, useRef} from 'react';
import {PageContainer, FooterToolbar} from '@ant-design/pro-layout';
import type {ProColumns, ActionType} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import type {TaskTableListItem} from './data.d';

import styles from './index.less';

import Dropdown from "antd/es/dropdown/dropdown";
import Menu from "antd/es/menu";
import {handleAddOrUpdate, handleRemove, handleSubmit, queryData, updateEnabled} from "@/components/Common/crud";

const url = '/api/task';

const TaskTableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TaskTableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TaskTableListItem[]>([]);

  const editAndDelete = (key: string | number, currentItem: TaskTableListItem) => {
    if (key === 'edit') {
      handleUpdateModalVisible(true);
      setFormValues(currentItem);
    } else if (key === 'delete') {
      Modal.confirm({
        title: '????????????',
        content: '???????????????????????????',
        okText: '??????',
        cancelText: '??????',
        onOk:async () => {
          await handleRemove(url,[currentItem]);
          actionRef.current?.reloadAndRest?.();
        }
      });
    } else if (key === 'submit') {
      Modal.confirm({
        title: '????????????',
        content: '???????????????????????????',
        okText: '??????',
        cancelText: '??????',
        onOk:async () => {
          await handleSubmit(url+'/submit','??????',[currentItem]);
          actionRef.current?.reloadAndRest?.();
        }
      });
    }
  };


  const MoreBtn: React.FC<{
    item: TaskTableListItem;
  }> = ({item}) => (
    <Dropdown
      overlay={
        <Menu onClick={({key}) => editAndDelete(key, item)}>
          <Menu.Item key="submit">??????</Menu.Item>
          <Menu.Item key="edit">??????</Menu.Item>
          <Menu.Item key="delete">??????</Menu.Item>
        </Menu>
      }
    >
      <a>
        ?????? <DownOutlined/>
      </a>
    </Dropdown>
  );

  const columns: ProColumns<TaskTableListItem>[] = [
    {
      title: '??????',
      dataIndex: 'name',
      tip: '??????????????????',
      sorter: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '??????????????????',
          },
        ],
      },
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: '??????ID',
      dataIndex: 'id',
      hideInTable: true,
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '??????',
      sorter: true,
      dataIndex: 'alias',
      hideInTable: false,
    },
    {
      title: '??????',
      sorter: true,
      dataIndex: 'type',
      hideInForm: false,
      hideInSearch: true,
      hideInTable: false,
    },
    {
      title: 'CheckPoint',
      sorter: true,
      dataIndex: 'checkPoint',
      hideInForm: false,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: 'SavePointPath',
      sorter: true,
      dataIndex: 'savePointPath',
      hideInForm: false,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: 'Parallelism',
      sorter: true,
      dataIndex: 'parallelism',
      hideInForm: false,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: 'Fragment',
      sorter: true,
      dataIndex: 'fragment',
      hideInForm: false,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '??????ID',
      sorter: true,
      dataIndex: 'clusterId',
      hideInForm: false,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '??????',
      sorter: true,
      dataIndex: 'clusterName',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '??????',
      sorter: true,
      valueType: 'textarea',
      dataIndex: 'note',
      hideInForm: false,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '????????????',
      dataIndex: 'enabled',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: false,
      filters: [
        {
          text: '??????',
          value: 1,
        },
        {
          text: '??????',
          value: 0,
        },
      ],
      filterMultiple: false,
      valueEnum: {
        true: { text: '??????', status: 'Success' },
        false: { text: '??????', status: 'Error' },
      },
    },
    {
      title: '????????????',
      dataIndex: 'createTime',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      hideInTable:true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return <Input {...rest} placeholder="????????????????????????" />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '??????????????????',
      dataIndex: 'updateTime',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return <Input {...rest} placeholder="????????????????????????" />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '??????',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          onClick={() => {
            handleUpdateModalVisible(true);
            setFormValues(record);
          }}
        >
          ??????
        </a>,
        <MoreBtn key="more" item={record}/>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TaskTableListItem>
        headerTitle="????????????"
        actionRef={actionRef}
        rowKey="id"
        search={{
        labelWidth: 120,
      }}
        toolBarRender={() => [
        <Button type="primary" onClick={() => handleModalVisible(true)}>
          <PlusOutlined/> ??????
        </Button>,
      ]}
        request={(params, sorter, filter) => queryData(url,{...params, sorter, filter})}
        columns={columns}
        rowSelection={{
        onChange: (_, selectedRows) => setSelectedRows(selectedRows),
      }}
        />
        {selectedRowsState?.length > 0 && (
          <FooterToolbar
            extra={
              <div>
                ????????? <a style={{fontWeight: 600}}>{selectedRowsState.length}</a> ???&nbsp;&nbsp;
                <span>
                ????????????????????? {selectedRowsState.length - selectedRowsState.reduce((pre, item) => pre + (item.enabled ? 1 : 0), 0)} ???
              </span>
              </div>
            }
          >
            <Button type="primary" danger
                    onClick ={()=>{
                      Modal.confirm({
                        title: '????????????',
                        content: '?????????????????????????????????',
                        okText: '??????',
                        cancelText: '??????',
                        onOk:async () => {
                          await handleRemove(url,selectedRowsState);
                          setSelectedRows([]);
                          actionRef.current?.reloadAndRest?.();
                        }
                      });
                    }}
            >
              ????????????
            </Button>
            <Button type="primary"
                    onClick ={()=>{
                      Modal.confirm({
                        title: '????????????',
                        content: '?????????????????????????????????',
                        okText: '??????',
                        cancelText: '??????',
                        onOk:async () => {
                          await updateEnabled(url,selectedRowsState, true);
                          setSelectedRows([]);
                          actionRef.current?.reloadAndRest?.();
                        }
                      });
                    }}
            >????????????</Button>
            <Button danger
                    onClick ={()=>{
                      Modal.confirm({
                        title: '????????????',
                        content: '?????????????????????????????????',
                        okText: '??????',
                        cancelText: '??????',
                        onOk:async () => {
                          await updateEnabled(url,selectedRowsState, false);
                          setSelectedRows([]);
                          actionRef.current?.reloadAndRest?.();
                        }
                      });
                    }}
            >????????????</Button>
          </FooterToolbar>
        )}
        <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
          <ProTable<TaskTableListItem, TaskTableListItem>
          onSubmit={async (value) => {
          const success = await handleAddOrUpdate(url,value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
          rowKey="id"
          type="form"
          columns={columns}
          />
        </CreateForm>
        {formValues && Object.keys(formValues).length ? (
          <UpdateForm
            onSubmit={async (value) => {
              const success = await handleAddOrUpdate(url,value);
              if (success) {
                handleUpdateModalVisible(false);
                setFormValues({});
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            onCancel={() => {
              handleUpdateModalVisible(false);
              setFormValues({});
            }}
            updateModalVisible={updateModalVisible}
            values={formValues}
          />
        ) : null}

        <Drawer
          width={600}
          visible={!!row}
          onClose={() => {
            setRow(undefined);
          }}
          closable={false}
        >
          {row?.name && (
            <ProDescriptions<TaskTableListItem>
              column={2}
              title={row?.name}
              request={async () => ({
              data: row || {},
            })}
              params={{
              id: row?.name,
            }}
              columns={columns}
              />
              )}
        </Drawer>
    </PageContainer>
);
};

export default TaskTableList;
