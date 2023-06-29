// import React, { useEffect, useState } from "react";
// import { Avatar, Rate, Space, Table, Typography } from "antd";
// import { getInventory } from "../API";

// // Fields to be plucked from firebase for our project, this is a sample dataset.
// const Inventory = () => {
//   const [loading, setLoading] = useState(false);
//   const [dataSource, setDataSource] = useState([]);

//   useEffect(() => {
//     setLoading(true);
//     getInventory().then((res) => {
//       setDataSource(res.products);
//       setLoading(false);
//     });
//   }, []);

//   return (
//     <Space size={20} direction="vertical">
//       <Typography.Title level={4}>Inventory</Typography.Title>
//       <Table
//         loading={loading}
//         columns={[
//           {
//             title: "Thumbnail",
//             dataIndex: "thumbnail",
//             render: (link) => {
//               return <Avatar src={link} />;
//             },
//           },
//           {
//             title: "Title",
//             dataIndex: "title",
//           },
//           {
//             title: "Price",
//             dataIndex: "price",
//             render: (value) => <span>${value}</span>,
//           },
//           {
//             title: "Discount Percentage",
//             dataIndex: "discountPercentage",
//           },
//           {
//             title: "Rating",
//             dataIndex: "rating",
//             render: (rating) => {
//               return <Rate value={rating} allowHalf disabled/>;
//             },
//           },
//           {
//             title: "Stock",
//             dataIndex: "stock",
//           },
//           {
//             title: "Brand",
//             dataIndex: "brand",
//           },
//           {
//             title: "Category",
//             dataIndex: "category",
//           },

//         ]}
//         dataSource={dataSource}
//         pagination={{pageSize:5,}}
//       />
//     </Space>
//   );
// }

// export default Inventory;

import React, { useEffect, useState } from "react";
import { Avatar, Space, Table, Typography } from "antd";
import firebase from "../firebase"; // Path to your firebase.js file

const Inventory = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setLoading(true);
    const promotionsRef = firebase.firestore().collection("bigPromotions");

    promotionsRef
      .get()
      .then((querySnapshot) => {
        const retrievedPromotions = [];
        querySnapshot.forEach((doc) => {
          const promotionData = doc.data();
          const logoRef = firebase.storage().ref(promotionData.pathToLogo);
          logoRef
            .getDownloadURL()
            .then((url) => {
              retrievedPromotions.push({
                id: doc.id,
                ...promotionData,
                logoURL: url,
              });
              if (retrievedPromotions.length === querySnapshot.size) {
                setDataSource(retrievedPromotions);
                setLoading(false);
              }
            })
            .catch((error) => {
              console.error("Error fetching logo URL:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error fetching promotions:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Promotions</Typography.Title>
      <Table
        loading={loading}
        columns={[
          {
            title: "Thumbnail",
            dataIndex: "logoURL",
            render: (url) => {
              return <Avatar src={url} />;
            },
          },
          {
            title: "Business",
            dataIndex: "store",
          },
          {
            title: "Number of Coupons",
            dataIndex: "numberOfCoupons",
          },
          {
            title: "Number of Coupons Claimed",
            dataIndex: "numberOfCouponsClaimed",
          },
          {
            title: "Start Time",
            dataIndex: "initTime",
          },
          {
            title: "End Time",
            dataIndex: "endTime",
          },
          // Add additional columns as needed
        ]}
        dataSource={dataSource}
        pagination={{ pageSize: 5 }}
      />
    </Space>
  );
};

export default Inventory;
