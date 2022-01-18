import { Layout } from 'antd';
import {Routes, Route} from "react-router-dom";
import Nav from "../Nav/Nav";

import "./App.scss";
import CreateResumePage from "../../pages/CreateResumePage";

const { Content } = Layout;

const App = () => {
    return (
        <Layout className="layout">
            <Nav/>
            <Layout className="site-layout">
                <Content className="site-layout-background">
                    <Routes>
                        <Route path="*" element={<CreateResumePage />}/>
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;
