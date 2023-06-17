import React, { useEffect, useState } from "react";
import { Avatar, Rate, Space, Table, Typography } from "antd";
import { getInventory } from "../API";

// Fields to be plucked from firebase for our project, this is a sample dataset.
const Inventory = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setLoading(true);
    getInventory().then((res) => {
      setDataSource(res.products);
      setLoading(false);
    });
  }, []);

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Inventory</Typography.Title>
      <Table
        loading={loading}
        columns={[
          {
            title: "Thumbnail",
            dataIndex: "thumbnail",
            render: (link) => {
              return <Avatar src={link} />;
            },
          },
          {
            title: "Title",
            dataIndex: "title",
          },
          {
            title: "Price",
            dataIndex: "price",
            render: (value) => <span>${value}</span>,
          },
          {
            title: "Discount Percentage",
            dataIndex: "discountPercentage",
          },
          {
            title: "Rating",
            dataIndex: "rating",
            render: (rating) => {
              return <Rate value={rating} allowHalf disabled/>;
            },
          },
          {
            title: "Stock",
            dataIndex: "stock",
          },
          {
            title: "Brand",
            dataIndex: "brand",
          },
          {
            title: "Category",
            dataIndex: "category",
          },

        ]}
        dataSource={dataSource}
        pagination={{pageSize:5,}}
      />
    </Space>
  );
}

export default Inventory;
