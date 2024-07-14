import { LineChartOutlined, UserOutlined, ShoppingCartOutlined, BarChartOutlined, FileTextOutlined , CarTwoTone} from '@ant-design/icons';
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
import OrderStatistics from './ProductStats';
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
        path: 'customer-list'
      },
      {
        key: '2-2',
        label: 'Danh sách nhân viên',
        component: ManageUser,
        path: 'employee-list'
      },
      {
        key: '2-3',
        label: 'Danh sách đen',
        component: BlackList,
        path: 'black-List'
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
        path: 'order-list'
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
        path: 'article-approval'
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
        path: 'add-product'
      },
      {
        key: '4-2',
        label: 'Thể loại/ tác giả',
        component: ManageCategories,
        path: 'manage-categories'
      },
      {
        key: '4-3',
        label: 'Danh sách sản phẩm',
        component: ProductList,
        path: 'product-list'
      },
      {
        key: '4-4',
        label: 'Danh sách ngừng kinh doanh',
        component: DeleteBook,
        path: 'delete-book'
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
        path: 'sales-stats'
      },
      {
        key: '5-2',
        label: 'Thống kê đơn hàng',
        component: OrderStatistics, // Assuming this is the correct component
        path: 'order-stats'
      },
      {
        key: '5-3',
        label: 'Thống kê sản phẩm',
        component: ProductStats,
        path: 'product-stats'
      },
      {
        key: '5-4',
        label: 'Thống kê bài viết',
        component: ArticleStats,
        path: 'article-stats'
      },
      {
        key: '5-5',
        label: 'Thống kê ',
        component: StatisticsPage,
        path: 'statistic'
      }
    ]
  },
  {
    key: '6',
    label: 'Quản lí giảm giá',
    component: AddDiscount,
    path: 'add-discount'
  },
  {
    key: '7',
    label: 'Quản lí thông báo',
    component: NotificationManager,
    path: 'add-notification'
  },
];
