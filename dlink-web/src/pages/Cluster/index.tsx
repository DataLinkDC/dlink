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


import {ClearOutlined, DownOutlined, HeartOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Drawer, Input, message, Modal} from 'antd';
import React, {useRef, useState} from 'react';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import type {ClusterTableListItem} from './data.d';

import Dropdown from "antd/es/dropdown/dropdown";
import Menu from "antd/es/menu";
import {
  getData,
  handleAddOrUpdate,
  handleOption,
  handleRemove,
  queryData,
  updateEnabled
} from "@/components/Common/crud";
import {showCluster, showSessionCluster} from "@/components/Studio/StudioEvent/DDL";
import {RUN_MODE} from "@/components/Studio/conf";
import ClusterForm from "@/pages/Cluster/components/ClusterForm";

const TextArea = Input.TextArea;
const url = '/api/cluster';

const ClusterTableList: React.FC<{}> = (props: any) => {
  const {dispatch} = props;
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<ClusterTableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<ClusterTableListItem[]>([]);

  const editAndDelete = (key: string | number, currentItem: ClusterTableListItem) => {
    if (key === 'edit') {
      handleUpdateModalVisible(true);
      setFormValues(currentItem);
    } else if (key === 'delete') {
      Modal.confirm({
        title: '????????????',
        content: '???????????????????????????',
        okText: '??????',
        cancelText: '??????',
        onOk: async () => {
          await handleRemove(url, [currentItem]);
          actionRef.current?.reloadAndRest?.();
        }
      });
    }
  };

  const checkHeartBeats = async () => {
    await handleOption(url + '/heartbeats', '????????????', null);
    actionRef.current?.reloadAndRest?.();
  };

  const clearCluster = async () => {

    Modal.confirm({
      title: '????????????',
      content: '??????????????????????????????????????????????????????',
      okText: '??????',
      cancelText: '??????',
      onOk: async () => {
        const {datas} = await getData(url + '/clear', '????????????', null);
        message.success(`????????????${datas}?????????`);
        actionRef.current?.reloadAndRest?.();
      }
    });
  };

  const MoreBtn: React.FC<{
    item: ClusterTableListItem;
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

  const columns: ProColumns<ClusterTableListItem>[] = [
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
      filters: [
        {
          text: 'Yarn Session',
          value: RUN_MODE.YARN_SESSION,
        },
        {
          text: 'Standalone',
          value: RUN_MODE.STANDALONE,
        },
        {
          text: 'Yarn Per-Job',
          value: RUN_MODE.YARN_PER_JOB,
        },
        {
          text: 'Yarn Application',
          value: RUN_MODE.YARN_APPLICATION,
        },
        {
          text: 'Kubernetes Session',
          value: RUN_MODE.KUBERNETES_SESSION,
        },
        {
          text: 'Kubernetes Application',
          value: RUN_MODE.KUBERNETES_APPLICATION,
        },
      ],
      filterMultiple: false,
      valueEnum: {
        'yarn-session': {text: 'Yarn Session'},
        'standalone': {text: 'Standalone'},
        'yarn-per-job': {text: 'Yarn Per-Job'},
        'yarn-application': {text: 'Yarn Application'},
        'kubernetes-session': {text: 'Kubernetes Session'},
        'kubernetes-application': {text: 'Kubernetes Application'},
      },
    },
    {
      title: 'JobManager HA ??????',
      sorter: true,
      dataIndex: 'hosts',
      valueType: 'textarea',
      hideInForm: false,
      hideInSearch: true,
      hideInTable: true,
      renderFormItem: (item, {defaultRender, ...rest}, form) => {
        return <TextArea placeholder="?????? Flink ????????? JobManager ??? RestApi ???????????? HA ??????????????????????????????????????????????????????192.168.123.101:8081,192.168.123.102:8081,192.168.123.103:8081" allowClear autoSize={{ minRows: 3, maxRows: 10 }}/>;
      },
    },
    {
      title: '?????? JobManager ??????',
      sorter: true,
      dataIndex: 'jobManagerHost',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: false,
    },{
      title: '??????',
      sorter: true,
      dataIndex: 'version',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: false,
    },
    {
      title: '??????',
      dataIndex: 'status',
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
        1: {text: '??????', status: 'Success'},
        0: {text: '??????', status: 'Error'},
      },
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
      dataIndex: 'autoRegisters',
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
        true: {text: '??????', status: 'Success'},
        false: {text: '??????', status: 'Error'},
      },
    },
    {
      title: '????????????',
      dataIndex: 'createTime',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      hideInTable: true,
      renderFormItem: (item, {defaultRender, ...rest}, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return <Input {...rest} placeholder="????????????????????????"/>;
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
      renderFormItem: (item, {defaultRender, ...rest}, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return <Input {...rest} placeholder="????????????????????????"/>;
        }
        return defaultRender(item);
      },
    },
    {
      title: '??????',
      dataIndex: 'option',
      tooltip: 'FLinkWebUI?????? ??????????????????`??????`???! ?????? KUBERNETES ???????????????',
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
        ((record.status && (record.type === RUN_MODE.YARN_SESSION
                              || record.type === RUN_MODE.STANDALONE
                              || record.type === RUN_MODE.YARN_APPLICATION
                              || record.type === RUN_MODE.YARN_PER_JOB
                          )) ?
          <>
            <Button type="link" title={`http://${record.jobManagerHost}/#/overview`}
                    href={`http://${record.jobManagerHost}/#/overview`}
                    target="_blank"
            >
              FlinkWebUI
            </Button>
          </>
          : undefined
        ),
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<ClusterTableListItem>
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
        <Button type="primary" onClick={() => checkHeartBeats()}>
          <HeartOutlined/> ??????
        </Button>,
        <Button type="primary" onClick={() => clearCluster()}>
          <ClearOutlined /> ??????
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
                ????????????????????? {selectedRowsState.length - selectedRowsState.reduce((pre, item) => pre + (item.enabled ? 1 : 0), 0)} ???
              </span>
              </div>
            }
          >
            <Button type="primary" danger
                    onClick={() => {
                      Modal.confirm({
                        title: '????????????',
                        content: '?????????????????????????????????',
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
                        title: '????????????',
                        content: '?????????????????????????????????',
                        okText: '??????',
                        cancelText: '??????',
                        onOk: async () => {
                          await updateEnabled(url+'/enable', selectedRowsState, true);
                          setSelectedRows([]);
                          actionRef.current?.reloadAndRest?.();
                        }
                      });
                    }}
            >????????????</Button>
            <Button danger
                    onClick={() => {
                      Modal.confirm({
                        title: '????????????',
                        content: '?????????????????????????????????',
                        okText: '??????',
                        cancelText: '??????',
                        onOk: async () => {
                          await updateEnabled(url+'/enable', selectedRowsState, false);
                          setSelectedRows([]);
                          actionRef.current?.reloadAndRest?.();
                        }
                      });
                    }}
            >????????????</Button>
          </FooterToolbar>
        )}
        <ClusterForm
          onSubmit={async (value) => {
            const success = await handleAddOrUpdate(url, value);
            if (success) {
              handleModalVisible(false);
              setFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
              showCluster(dispatch);
              showSessionCluster(dispatch);
            }
          }}
          onCancel={() => handleModalVisible(false)}
          modalVisible={modalVisible}
          values={{}}
        >
        </ClusterForm>
        {formValues && Object.keys(formValues).length ? (
          <ClusterForm
            onSubmit={async (value) => {
              const success = await handleAddOrUpdate(url, value);
              if (success) {
                handleUpdateModalVisible(false);
                setFormValues({});
                if (actionRef.current) {
                  actionRef.current.reload();
                }
                showCluster(dispatch);
                showSessionCluster(dispatch);
              }
            }}
            onCancel={() => {
              handleUpdateModalVisible(false);
              setFormValues({});
            }}
            modalVisible={updateModalVisible}
            values={formValues}
          />
        ) : undefined}

        <Drawer
          width={600}
          visible={!!row}
          onClose={() => {
            setRow(undefined);
          }}
          closable={false}
        >
          {row?.name && (
            <ProDescriptions<ClusterTableListItem>
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

export default ClusterTableList;
