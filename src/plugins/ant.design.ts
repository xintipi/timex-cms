import 'ant-design-vue/dist/antd.less';
import {
  Button,
  Input,
  DatePicker,
  TimePicker,
  Checkbox,
  Pagination,
  Table,
  Tabs,
  Layout,
  Collapse,
  Modal,
  Select,
  Form,
  ConfigProvider,
  Breadcrumb,
  Popover,
  Menu,
  Tooltip,
  Col,
  Row,
  Popconfirm,
  Switch,
  Drawer,
  Spin,
} from 'ant-design-vue';
import { App } from '@vue/runtime-core';

const components = [
  Button,
  Input,
  DatePicker,
  TimePicker,
  Checkbox,
  Pagination,
  Table,
  Tabs,
  Layout,
  Collapse,
  Modal,
  Select,
  Form,
  ConfigProvider,
  Breadcrumb,
  Popover,
  Menu,
  Tooltip,
  Col,
  Row,
  Popconfirm,
  Switch,
  Drawer,
  Spin,
];

const registerAntDesign = {
  install(app: App<Element>) {
    components.forEach((component) => {
      app.use(component);
    });
  },
};

export default registerAntDesign;
