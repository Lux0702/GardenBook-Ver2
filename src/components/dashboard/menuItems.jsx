import { 
  LineChartOutlined, 
  UserOutlined, 
  ShoppingCartOutlined, 
  BarChartOutlined, 
  FileTextOutlined, 
  BellOutlined,
  TagsOutlined,
  TeamOutlined,
  StopOutlined,
  PieChartOutlined,
  SolutionOutlined 
} from '@ant-design/icons';
import DashboardCard from './DashboardCard';
import UserInfo from './ManageUser';
import ProductList from './ManagerBook'; 
import Reports from './Report'; 
import SalesStats from './SalesStats';
import ProductStats from './ProductStats';
import ArticleStats from './ArticleStats';
import ArticleApproval from './ArticleApproval';
import AddProduct from './AddProduct';
import ManageCategories from './ManageCategories';
import CustomerList from './CustomerList';
import OrderList from './OrderList';
import BlackList from './BlackList';
import ManageUser from './ManageUser';
import OrderStatistics from './ProductStats'; // Verify this is the correct component
import StatisticsPage from './StatistitisPage';
import AddDiscount from './AddDiscount';
import NotificationManager from './AddNotification';
import DeleteBook from './DeleteBook';

export const items = [
  {
    key: '1',
    icon: <LineChartOutlined />,
    label: 'Dashboard',
    component: DashboardCard,
    path: 'dashboard'
  },
  {
    key: '2',
    icon: <UserOutlined />,
    label: 'Quản lí người dùng',
    children: [
      {
        key: '2-1',
        label: 'Danh sách khách hàng',
        component: CustomerList,
        path: 'customer-list',
        icon: <TeamOutlined />
      },
      {
        key: '2-2',
        label: 'Danh sách nhân viên',
        component: ManageUser,
        path: 'employee-list',
        icon: <SolutionOutlined />
      },
      {
        key: '2-3',
        label: 'Danh sách đen',
        component: BlackList,
        path: 'black-List',
        icon: <StopOutlined />
      },
    ]
  },
  {
    key: '2-4',
    icon: <ShoppingCartOutlined />,
    label: 'Quản lí đơn hàng',
    children: [
      {
        key: '5-1',
        label: 'Danh sách đơn hàng',
        component: OrderList,
        path: 'order-list',
        icon: <ShoppingCartOutlined />
      }
    ]
  },
  {
    key: '3',
    icon: <FileTextOutlined />,
    label: 'Quản lí bài viết',
    children: [
      {
        key: '3-1',
        label: 'Duyệt bài viết',
        component: ArticleApproval,
        path: 'article-approval',
        icon: <FileTextOutlined />
      }
    ]
  },
  {
    key: '4',
    icon: <ShoppingCartOutlined />,
    label: 'Quản lí sản phẩm',
    children: [
      {
        key: '4-1',
        label: 'Thêm sản phẩm',
        component: AddProduct,
        path: 'add-product',
        icon: <ShoppingCartOutlined />
      },
      {
        key: '4-2',
        label: 'Thể loại/ tác giả',
        component: ManageCategories,
        path: 'manage-categories',
        icon: <TagsOutlined />
      },
      {
        key: '4-3',
        label: 'Danh sách sản phẩm',
        component: ProductList,
        path: 'product-list',
        icon: <ShoppingCartOutlined />
      },
      {
        key: '4-4',
        label: 'Danh sách ngừng kinh doanh',
        component: DeleteBook,
        path: 'delete-book',
        icon: <StopOutlined />
      }
    ]
  },
  {
    key: '5',
    icon: <BarChartOutlined />,
    label: 'Thống kê',
    children: [
      {
        key: '5-1',
        label: 'Thống kê bán hàng',
        component: SalesStats,
        path: 'sales-stats',
        icon: <BarChartOutlined />
      },
      {
        key: '5-2',
        label: 'Thống kê đơn hàng',
        component: OrderStatistics, // Assuming this is the correct component
        path: 'order-stats',
        icon: <BarChartOutlined />
      },
      {
        key: '5-3',
        label: 'Thống kê sản phẩm',
        component: ProductStats,
        path: 'product-stats',
        icon: <PieChartOutlined />
      },
      {
        key: '5-4',
        label: 'Thống kê bài viết',
        component: ArticleStats,
        path: 'article-stats',
        icon: <FileTextOutlined />
      },
      {
        key: '5-5',
        label: 'Thống kê',
        component: StatisticsPage,
        path: 'statistic',
        icon: <PieChartOutlined />
      }
    ]
  },
  {
    key: '6',
    icon: <TagsOutlined />,
    label: 'Quản lí giảm giá',
    component: AddDiscount,
    path: 'add-discount'
  },
  {
    key: '7',
    icon: <BellOutlined />,
    label: 'Quản lí thông báo',
    component: NotificationManager,
    path: 'add-notification'
  },
];
