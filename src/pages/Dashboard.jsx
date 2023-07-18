// import { React, useEffect, useState } from "react";
// import { Card, Space, Statistic, Table, Typography } from "antd";
// import {
//   DollarCircleOutlined,
//   ShoppingCartOutlined,
//   ShoppingOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// import { Bar } from "react-chartjs-2";
// import { getCustomers, getInventory, getOrders, getRevenue } from "../API";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const Dashboard = () => {
//   const [orders, setOrders] = useState(0);
//   const [inventory, setInventory] = useState(0);
//   const [customers, setCustomers] = useState(0);
//   const [revenue, setRevenue] = useState(0);

//   useEffect(() => {
//     getOrders().then((res) => {
//       setOrders(res.total);
//       setRevenue(res.discountedTotal);
//     });
//     getInventory().then((res) => {
//       setInventory(res.total);
//     });
//     getCustomers().then((res) => {
//       setCustomers(res.total);
//     });
//   }, []);

//   const DashboardCard = ({ title, value, icon }) => {
//     return (
//       <Card>
//         <Space direction="horizontal">
//           {icon}
//           <Statistic title={title} value={value} />
//         </Space>
//       </Card>
//     );
//   };
//   const DashboardChart = () => {
//     const [revenueData, setRevenueData] = useState({
//       labels: [],
//       datasets: [],
//     });

//     useEffect(() => {
//       getRevenue().then((res) => {
//         const labels = res.carts.map((cart) => {
//           return `User-${cart.userId}`;
//         });
//         const data = res.carts.map((cart) => {
//           return cart.discountedTotal;
//         });

//         const dataSource = {
//           labels,
//           datasets: [
//             {
//               label: "Revenue",
//               data: data,
//               backgroundColor: "rgba(255, 0, 0, 1)",
//             },
//           ],
//         };

//         setRevenueData(dataSource);
//       });
//     }, []);

//     const options = {
//       responsive: true,
//       plugins: {
//         legend: {
//           position: "bottom",
//         },
//         title: {
//           display: true,
//           text: "Order Revenue",
//         },
//       },
//     };

//     return (
//       <Card style={{ width: 500, height: 250 }}>
//         <Bar options={options} data={revenueData} />
//       </Card>
//     );
//   };

//   // RecentOrders section should be replaced
//   // Pluck data from firebase, for our project.
//   const RecentOrders = () => {
//     const [dataSource, setDataSource] = useState([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//       setLoading(true);
//       getOrders().then((res) => {
//         setDataSource(res.products.splice(0, 3));
//         setLoading(false);
//       });
//     }, []);

//     return (
//       <>
//         <Typography.Text>Recent Orders</Typography.Text>
//         <Table
//           columns={[
//             {
//               title: "Title",
//               dataIndex: "title",
//             },
//             {
//               title: "Quantity",
//               dataIndex: "quantity",
//             },
//             {
//               title: "Price",
//               dataIndex: "discountedPrice",
//             },
//           ]}
//           loading={loading}
//           dataSource={dataSource}
//           pagination={false}
//         ></Table>
//       </>
//     );
//   };

//   return (
//     <div>
//       <Space size={20} direction="vertical">
//         <Typography.Title level={4}>Dashboard</Typography.Title>
//         <Space direction="horizontal">
//           <DashboardCard
//             title={"Orders"}
//             value={orders}
//             icon={
//               <ShoppingCartOutlined
//                 style={{
//                   color: "green",
//                   backgroundColor: "rgba(0,255,0,0.25)",
//                   borderRadius: 20,
//                   fontSize: 24,
//                   padding: 8,
//                 }}
//               />
//             }
//           />
//           <DashboardCard
//             title={"Inventory"}
//             value={inventory}
//             icon={
//               <ShoppingOutlined
//                 style={{
//                   color: "blue",
//                   backgroundColor: "rgba(0,0,255,0.25)",
//                   borderRadius: 20,
//                   fontSize: 24,
//                   padding: 8,
//                 }}
//               />
//             }
//           />
//           <DashboardCard
//             title={"Customers"}
//             value={customers}
//             icon={
//               <UserOutlined
//                 style={{
//                   color: "purple",
//                   backgroundColor: "rgba(0,255,255,0.25)",
//                   borderRadius: 20,
//                   fontSize: 24,
//                   padding: 8,
//                 }}
//               />
//             }
//           />
//           <DashboardCard
//             title={"Revenue"}
//             value={revenue}
//             icon={
//               <DollarCircleOutlined
//                 style={{
//                   color: "red",
//                   backgroundColor: "rgba(255,0,0,0.25)",
//                   borderRadius: 20,
//                   fontSize: 24,
//                   padding: 8,
//                 }}
//               />
//             }
//           />
//         </Space>
//         <Space>
//           <RecentOrders />
//           <DashboardChart />
//         </Space>
//       </Space>
//     </div>
//   );
// };

// export default Dashboard;

import { React, useEffect, useState } from "react";
import { Card, Space, Statistic, Table, Typography } from "antd";
import firebase from "../firebase"; // Path to your firebase.js file
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { getCustomers, getInventory, getOrders, getRevenue } from "../API";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [orders, setOrders] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [businessData, setBusinessData] = useState([]);

  useEffect(() => {
    getOrders().then((res) => {
      setOrders(res.total);
      setRevenue(res.discountedTotal);
    });
    getInventory().then((res) => {
      setInventory(res.total);
    });
    getCustomers().then((res) => {
      setCustomers(res.total);
    });

    fetchBusinessData().then((data) => {
      setBusinessData(data);
    });
  }, []);

  const fetchBusinessData = () => {
    return firebase.firestore().collection("bigPromotions").get()
      .then((querySnapshot) => {
        const businessData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            store: data.store,
            numberOfCoupons: data.numberOfCoupons,
            numberOfCouponsClaimed: data.numberOfCouponsClaimed,
          };
        });
        return businessData;
      })
      .catch((error) => {
        console.error("Error fetching business data:", error);
        return [];
      });
  };
  const DashboardCard = ({ title, value, icon }) => {
    return (
      <Card>
        <Space direction="horizontal">
          {icon}
          <Statistic title={title} value={value} />
        </Space>
      </Card>
    );
  };

  const DashboardChart = () => {
    const labels = businessData.map((business) => business.store);
    const numberOfCoupons = businessData.map(
      (business) => business.numberOfCoupons
    );
    const numberOfCouponsClaimed = businessData.map(
      (business) => business.numberOfCouponsClaimed
    );

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Number of Coupons",
          data: numberOfCoupons,
          backgroundColor: "rgba(0, 123, 255, 0.7)",
        },
        {
          label: "Number of Coupons Claimed",
          data: numberOfCouponsClaimed,
          backgroundColor: "rgba(255, 99, 132, 0.7)",
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        title: {
          display: true,
          text: "Business Data",
        },
      },
    };

    return (
      <Card style={{ width: 500, height: 250 }}>
        <Bar data={chartData} options={options} />
      </Card>
    );
  };

  const RecentOrders = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setLoading(true);
      getOrders().then((res) => {
        setDataSource(res.products.splice(0, 3));
        setLoading(false);
      });
    }, []);

    return (
      <>
        <Typography.Text>Recent Orders</Typography.Text>
        <Table
          columns={[
            {
              title: "Title",
              dataIndex: "title",
            },
            {
              title: "Quantity",
              dataIndex: "quantity",
            },
            {
              title: "Price",
              dataIndex: "discountedPrice",
            },
          ]}
          loading={loading}
          dataSource={dataSource}
          pagination={false}
        ></Table>
      </>
    );
  };

  return (
    <div>
      <Space size={20} direction="vertical">
        <Typography.Title level={4}>Dashboard</Typography.Title>
        <Space direction="horizontal">
          <DashboardCard
            title={"Orders"}
            value={orders}
            icon={
              <ShoppingCartOutlined
                style={{
                  color: "green",
                  backgroundColor: "rgba(0,255,0,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
          />
          <DashboardCard
            title={"Inventory"}
            value={inventory}
            icon={
              <ShoppingOutlined
                style={{
                  color: "blue",
                  backgroundColor: "rgba(0,0,255,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
          />
          <DashboardCard
            title={"Customers"}
            value={customers}
            icon={
              <UserOutlined
                style={{
                  color: "purple",
                  backgroundColor: "rgba(0,255,255,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
          />
          <DashboardCard
            title={"Revenue"}
            value={revenue}
            icon={
              <DollarCircleOutlined
                style={{
                  color: "red",
                  backgroundColor: "rgba(255,0,0,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
          />
        </Space>
        <Space>
          <RecentOrders />
          <DashboardChart />
        </Space>
      </Space>
    </div>
  );
};

export default Dashboard;
