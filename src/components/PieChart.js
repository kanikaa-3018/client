import React from "react";
import { Progress } from "antd";

const PieChart = ({ typeData, categoryData }) => {
  return (
    <div className="flex gap-12 justify-between px-16 pb-12"> 
      {/* Type Breakdown Section */}
      <div className="flex flex-col gap-4 items-center w-full sm:w-1/2">
        <h3 className="text-2xl font-bold mb-4">Type Breakdown</h3>
        {Array.isArray(typeData) && typeData.length === 0 ? (
          <div>No data available</div>
        ) : (
          Array.isArray(typeData) &&
          typeData.map((item) => (
            <div key={item.type} className="flex flex-col items-center">
              <Progress
                type="circle"
                percent={Number(item.percentage)}  // Ensure percentage is a number
                format={(percent) => `${percent}%`}
                width={80}
              />
              <div className="mt-2">{item.type}</div>
            </div>
          ))
        )}
      </div>

      {/* Category Breakdown Section */}
      <div className="flex flex-col gap-4 items-center w-full sm:w-1/2">
        <h3 className="text-2xl font-bold mb-4">Category Breakdown</h3>
        {Array.isArray(categoryData) && categoryData.length === 0 ? (
          <div>No data available</div>
        ) : (
          Array.isArray(categoryData) &&
          categoryData.map((item) => (
            <div key={item.category} className="w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{item.category}</span>
                <span className="font-semibold">{Number(item.percentage).toFixed(2)}%</span>
              </div>
              <Progress
                percent={Number(item.percentage)}  // Ensure percentage is a number
                status="active"
                strokeColor={
                  item.category === "food"
                    ? "#87d068"
                    : item.category === "entertainment"
                    ? "#ff4d4f"
                    : item.category === "transport"
                    ? "#108ee9"
                    : "#faad14"
                }
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PieChart;
