import { Layout } from 'antd';
import {Routes, Route} from "react-router-dom";
import Nav from "../Nav/Nav";

import "./App.scss";
import CreateResumePage from "../../pages/CreateResumePage";
import ResumesPage from "../../pages/ResumesPage";

const { Content } = Layout;

const App = () => {
    return (
        <Layout className="layout">
            <Nav/>
            <Layout className="site-layout">
                <Content className="site-layout-background">
                    <Routes>
                        <Route path="*" element={<CreateResumePage />}/>
                        <Route path="/resumes" element={<ResumesPage />}/>
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;
