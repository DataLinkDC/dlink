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


import React, {useEffect, useRef, useState} from "react";
import {DownOutlined, PlusOutlined} from '@ant-design/icons';
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, Drawer, Dropdown, Menu, Modal} from 'antd';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import ProDescriptions from '@ant-design/pro-descriptions';
import {AlertGroupTableListItem} from "@/pages/AlertGroup/data";
import {handleAddOrUpdate, handleRemove, queryData, updateEnabled} from "@/components/Common/crud";
import AlertGroupForm from "@/pages/AlertGroup/components/AlertGroupForm";
import {showAlertInstance} from "@/components/Studio/StudioEvent/DDL";
import {connect} from "umi";

const url = '/api/alertGroup';
const AlertGroupTableList: React.FC<{}> = (props: any) => {
  const {dispatch} = props;
  const [row, setRow] = useState<AlertGroupTableListItem>();
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<AlertGroupTableListItem[]>([]);

  useEffect(() => {
    showAlertInstance(dispatch);
  }, []);

  const editAndDelete = (key: string | number, currentItem: AlertGroupTableListItem) => {
    if (key === 'edit') {
      setFormValues(currentItem);
      handleUpdateModalVisible(true);
    } else if (key === 'delete') {
      Modal.confirm({
        title: '?????????????????????',
        content: '????????????????????????????????????',
        okText: '??????',
        cancelText: '??????',
        onOk: async () => {
          await handleRemove(url, [currentItem]);
          actionRef.current?.reloadAndRest?.();
        }
      });
    }
  };

  const MoreBtn: React.FC<{
    item: AlertGroupTableListItem;
  }> = ({item}) => (
    <Dropdown
      overlay={
        <Menu onClick={({key}) => editAndDelete(key, item)}>
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

  const columns: ProColumns<AlertGroupTableListItem>[] = [
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
      title: '?????????ID',
      dataIndex: 'id',
      hideInTable: true,
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '????????????',
      sorter: true,
      dataIndex: 'alertInstanceIds',
      hideInTable: true,
      hideInForm: true,
      hideInSearch: true,
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
          text: '?????????',
          value: 1,
        },
        {
          text: '?????????',
          value: 0,
        },
      ],
      filterMultiple: false,
      valueEnum: {
        true: {text: '?????????', status: 'Success'},
        false: {text: '?????????', status: 'Error'},
      },
    },
    {
      title: '????????????',
      dataIndex: 'createTime',
      sorter: true,
      valueType: 'dateTime',
      hideInTable: true
    },
    {
      title: '??????????????????',
      dataIndex: 'updateTime',
      sorter: true,
      valueType: 'dateTime',
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
      <ProTable<AlertGroupTableListItem>
        headerTitle="???????????????"
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
        request={(params, sorter, filter) => queryData(url, {...params, sorter, filter})}
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
                ???????????????????????? {selectedRowsState.length - selectedRowsState.reduce((pre, item) => pre + (item.enabled ? 1 : 0), 0)} ???
              </span>
            </div>
          }
        >
          <Button type="primary" danger
                  onClick={() => {
                    Modal.confirm({
                      title: '???????????????',
                      content: '????????????????????????????????????',
                      okText: '??????',
                      cancelText: '??????',
                      onOk: async () => {
                        await handleRemove(url, selectedRowsState);
                        setSelectedRows([]);
                        actionRef.current?.reloadAndRest?.();
                      }
                    });
                  }}
          >
            ????????????
          </Button>
          <Button type="primary"
                  onClick={() => {
                    Modal.confirm({
                      title: '???????????????',
                      content: '????????????????????????????????????',
                      okText: '??????',
                      cancelText: '??????',
                      onOk: async () => {
                        await updateEnabled(url, selectedRowsState, true);
                        setSelectedRows([]);
                        actionRef.current?.reloadAndRest?.();
                      }
                    });
                  }}
          >????????????</Button>
          <Button danger
                  onClick={() => {
                    Modal.confirm({
                      title: '???????????????',
                      content: '????????????????????????????????????',
                      okText: '??????',
                      cancelText: '??????',
                      onOk: async () => {
                        await updateEnabled(url, selectedRowsState, false);
                        setSelectedRows([]);
                        actionRef.current?.reloadAndRest?.();
                      }
                    });
                  }}
          >????????????</Button>
        </FooterToolbar>
      )}
      <AlertGroupForm
        onSubmit={async (value) => {
          const success = await handleAddOrUpdate(url, value);
          if (success) {
            handleModalVisible(false);
            setFormValues({});
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleModalVisible(false);
        }}
        modalVisible={modalVisible}
        values={{}}
      />
      {formValues && Object.keys(formValues).length ? (
        <AlertGroupForm
          onSubmit={async (value) => {
            const success = await handleAddOrUpdate(url, value);
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
          modalVisible={updateModalVisible}
          values={formValues}
        />
      ): null}
      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions<AlertGroupTableListItem>
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

export default  connect()(AlertGroupTableList);
