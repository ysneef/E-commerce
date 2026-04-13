import {
  FileTextOutlined,
  ShoppingOutlined,
  UserOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

interface SiderMenuProps {
  collapsed: boolean;
}

const SiderMenu = ({ collapsed }: SiderMenuProps) => {
  const location = useLocation();

  return (
    <>
      <div className='sticky top-0 justify-center px-4 pb-10 pt-14 !h-[4rem] flex flex-none items-center'>
        <div className={`flex items-center ${!collapsed ? 'gap-2' : ''}`}>
          <a href="#" className={`${!collapsed ? 'logo mr-1 invisible w-0 absolute' : 'visible w-auto'}`} >
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-black" viewBox="0 0 419.355 376">
                <g id="Group_3009" data-name="Group 3009" transform="translate(-3252.296 10102)">
                  <path id="Subtraction_85" data-name="Subtraction 85"
                    d="M225,493a211.59,211.59,0,0,1-42.322-4.266,208.834,208.834,0,0,1-75.091-31.6A210.61,210.61,0,0,1,31.5,364.741a208.944,208.944,0,0,1-12.236-39.419,211.325,211.325,0,0,1-3.97-31.115,10.3,10.3,0,0,1,2.6-5.92A11.717,11.717,0,0,1,21.287,286H67.01a11.731,11.731,0,0,1,5.521,2.088,9.919,9.919,0,0,1,2.762,4.328,150.808,150.808,0,0,0,2.755,20.815,149.164,149.164,0,0,0,22.57,53.636,150.441,150.441,0,0,0,66,54.346,149.275,149.275,0,0,0,28.156,8.74,151.466,151.466,0,0,0,60.46,0,149.164,149.164,0,0,0,53.636-22.57,150.421,150.421,0,0,0,54.346-66,149,149,0,0,0,11.144-44.416,19.021,19.021,0,0,1,4.464-6.95A26.371,26.371,0,0,1,384.578,286h41.33a10.532,10.532,0,0,1,8.744,9.173,211.179,211.179,0,0,1-3.918,30.149,208.854,208.854,0,0,1-31.6,75.091A210.625,210.625,0,0,1,306.742,476.5a208.977,208.977,0,0,1-39.419,12.236A211.591,211.591,0,0,1,225,493Z"
                    transform="translate(3237 -10219)" fill="currentColor" />
                  <circle id="Ellipse_188" data-name="Ellipse 188" cx="48" cy="48" r="48"
                    transform="translate(3317 -10102)" fill="currentColor" />
                  <rect id="Rectangle_1021" data-name="Rectangle 1021" width="136" height="61" rx="15"
                    transform="translate(3493 -10089)" fill="currentColor" />
                </g>
              </svg>
            </span>
          </a>
          <div
            className={`flex flex-col justify-end text-primary truncate transition-all duration-200 ${collapsed ? 'invisible w-0' : 'visible w-auto'}`}
          >
            <span className="text-[1.75rem] font-bold tracking-widest uppercase text-black select-none">
              SHOES STORE
            </span>
          </div>
        </div>
      </div>


      {/* Menu */}
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]}
      >
        <Menu.Item key="/" icon={<UserOutlined />}>
          <Link to="/">Dashboard</Link>
        </Menu.Item>

        <Menu.Item key="/products/list" icon={<ShoppingOutlined />}>
          <Link to="/products/list">Product List</Link>
        </Menu.Item>

        <Menu.Item key="/flash-sale" icon={<ClockCircleOutlined />}>
          <Link to="/flash-sale">Flash Sale</Link>
        </Menu.Item>

        <Menu.Item key="/orders/list" icon={<FileTextOutlined />}>
          <Link to="/orders/list">Orders</Link>
        </Menu.Item>

        <Menu.Item key="/customers/list" icon={<UserOutlined />}>
          <Link to="/customers/list">Customers</Link>
        </Menu.Item>
      </Menu>
    </>
  );
};

export default SiderMenu;
