import React from 'react';
import {Layout, Menu} from "antd";
import {
    EditOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const Nav = () => {
    return (
        <Sider trigger={null}>
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" icon={<EditOutlined />}>
                    <Link to="/">Создать резюме</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default Nav;
