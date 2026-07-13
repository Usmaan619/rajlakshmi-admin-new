// import React from 'react';
// import ApexCharts from 'react-apexcharts';
// import "./Graph.css"
// const BarChart = ({BarChartData}) => {
//   console.log('BarChartData: ', BarChartData);

//   const chartData = [
//     { month: '2025-01', monthly_total_sales: 150, monthly_total_revenue: 120 },
//     { month: '2025-02', monthly_total_sales: 195, monthly_total_revenue: 155 },
//     { month: '2025-03', monthly_total_sales: 155, monthly_total_revenue: 125 },
//     { month: '2025-04', monthly_total_sales: 180, monthly_total_revenue: 140 },
//     { month: '2025-05', monthly_total_sales: 125, monthly_total_revenue: 100 },
//     { month: '2025-06', monthly_total_sales: 155, monthly_total_revenue: 125 },
//     { month: '2025-07', monthly_total_sales: 95, monthly_total_revenue: 80 },
//     { month: '2025-08', monthly_total_sales: 155, monthly_total_revenue: 120 },
//     { month: '2025-09', monthly_total_sales: 155, monthly_total_revenue: 120 },
//     { month: '2025-10', monthly_total_sales: 155, monthly_total_revenue: 120 },
//     { month: '2025-11', monthly_total_sales: 165, monthly_total_revenue: 130 },
//     { month: '2025-12', monthly_total_sales: 195, monthly_total_revenue: 155 },
//   ];

//   const labels = chartData.map(item => {
//     const [year, month] = item.month.split('-');
//     return new Date(year, month - 1).toLocaleString('default', { month: 'short' });
//   });

//   const options = {
//     chart: {
//       type: 'bar',
//       toolbar: { show: false },
//     },
//     legend: { show: false },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: '25%',
//         borderRadius: 8,
//         borderRadiusApplication: 'around',
//         endingShape: 'flat',
//       },
//     },
//     colors: ['#F8AE39', '#379EFF'],
//     dataLabels: { enabled: false },
//     stroke: {
//       show: true,
//       width: 2, // reduced for mobile
//       colors: ['transparent'],
//     },
//     xaxis: {
//       categories: labels,
//       labels: {
//         style: { fontSize: '13px', fontWeight: 500, color: '#555' },
//       },
//     },
//     yaxis: {
//       labels: {
//         style: { fontSize: '13px', fontWeight: 500, color: '#555' },
//       },
//     },
//     grid: {
//       padding: { left: 0, right: 0, bottom: 0, top: 10 },
//     },
//     fill: { opacity: 1 },
//     tooltip: {
//       y: { formatter: val => `₹${val}` },
//     },
//     responsive: [
//       {
//         breakpoint: 768,
//         options: {
//           chart: {
//             height: 400,
//           },
//           plotOptions: {
//             bar: {
//               columnWidth: '60%',
//               borderRadius: 4,
//             },
//           },
//           xaxis: {
//             labels: {
//               rotate: -45,
//               style: { fontSize: '11px' },
//             },
//           },
//         },
//       },
//     ],
//   };

//   const series = [
//     {
//       name: 'Net profit',
//       data: chartData.map(item => item.monthly_total_sales),
//     },
//     // {
//     //   name: 'Revenue',
//     //   data: chartData.map(item => item.monthly_total_revenue),
//     // },
//   ];

//   return (
//     <div className="my-4">
//       <div className="graph-container box-shadow">
//         {/* Header */}
//         <div style={{ background: '#C5EBAA' }} className="px-4 py-2 recent-tble-header">
//           <div className="d-flex justify-content-between align-items-center flex-wrap">
//             <div>
//               <div className="text-dark small">This Week Statistics</div>
//               <div className="h5 val fw-bold">₹0</div>
//             </div>
//             <div className="d-flex align-items-center gap-4">
//               <div className="d-flex align-items-center gap-2">
//                 <div
//                   className="rounded-circle"
//                   style={{ width: 10, height: 10, backgroundColor: '#F8AE39' }}
//                 ></div>
//                 <span className="small">Net Sale</span>
//               </div>
//               {/* <div className="d-flex align-items-center gap-2">
//                 <div
//                   className="rounded-circle"
//                   style={{ width: 10, height: 10, backgroundColor: '#379EFF' }}
//                 ></div>
//                 <span className="small">Revenue</span>
//               </div> */}
//             </div>
//           </div>
//         </div>

//         {/* Chart */}
//         <div className="bg-white px-3 pt-3 pb-4 rounded-bottom chart-scroll-wrapper">
//           <div className=''>
//             <div className='chart-scroll-inner'>
//               <ApexCharts options={options} series={series} type="bar" height={350} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BarChart;

// import React from 'react';
// import ApexCharts from 'react-apexcharts';
// import './Graph.css';

// const BarChart = ({ BarChartData }) => {
//   console.log('BarChartData: ', BarChartData);
//   // Utility function to always generate last 7 days (YYYY-MM-DD) and map with actual sales
//   const generateLast7DaysChartData = (apiData = []) => {
//     const endDate = new Date(BarChartData?.end || new Date());
//     const days = [];

//     for (let i = 6; i >= 0; i--) {
//       const d = new Date(endDate);
//       d.setDate(d.getDate() - i);
//       const dateStr = d.toISOString().slice(0, 10); // Format: YYYY-MM-DD
//       days.push(dateStr);
//     }

//     // Create a map for fast lookup from API
//     const salesMap = {};
//     apiData.forEach(item => {
//       salesMap[item.day] = parseFloat(item.daily_total_sales || 0);
//     });

//     // Return formatted chart data
//     return days.map(day => ({
//       date: day,
//       daily_total_sales: salesMap[day] || 0,
//     }));
//   };

//   const chartData = generateLast7DaysChartData(BarChartData?.dailyBreakdown || []);

//   const labels = chartData.map(item =>
//     new Date(item.date).toLocaleDateString('default', {
//       day: 'numeric',
//       month: 'short',
//     })
//   );

//   const options = {
//     chart: {
//       type: 'bar',
//       toolbar: { show: false },
//     },
//     legend: { show: false },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: '25%',
//         borderRadius: 8,
//         borderRadiusApplication: 'around',
//         endingShape: 'flat',
//       },
//     },
//     colors: ['#F8AE39'],
//     dataLabels: { enabled: false },
//     stroke: {
//       show: true,
//       width: 2,
//       colors: ['transparent'],
//     },
//     xaxis: {
//       categories: labels,
//       labels: {
//         style: { fontSize: '13px', fontWeight: 500, color: '#555' },
//       },
//     },
//     yaxis: {
//       labels: {
//         style: { fontSize: '13px', fontWeight: 500, color: '#555' },
//       },
//     },
//     grid: {
//       padding: { left: 0, right: 0, bottom: 0, top: 10 },
//     },
//     fill: { opacity: 1 },
//     tooltip: {
//       y: { formatter: val => `₹${val}` },
//     },
//     responsive: [
//       {
//         breakpoint: 768,
//         options: {
//           chart: {
//             height: 400,
//           },
//           plotOptions: {
//             bar: {
//               columnWidth: '60%',
//               borderRadius: 4,
//             },
//           },
//           xaxis: {
//             labels: {
//               rotate: -45,
//               style: { fontSize: '11px' },
//             },
//           },
//         },
//       },
//     ],
//   };

//   const series = [
//     {
//       name: 'Net Sale',
//       data: chartData.map(item => item.daily_total_sales),
//     },
//   ];

//   const totalAmount = BarChartData?.summary?.total_sales || 0;

//   return (
//     <div className="my-4">
//       <div className="graph-container box-shadow">
//         {/* Header */}
//         <div style={{ background: '#C5EBAA' }} className="px-4 py-2 recent-tble-header">
//           <div className="d-flex justify-content-between align-items-center flex-wrap">
//             <div>
//               <div className="text-dark small">This Week Statistics</div>
//               <div className="h5 val fw-bold">₹{totalAmount}</div>
//             </div>
//             <div className="d-flex align-items-center gap-4">
//               <div className="d-flex align-items-center gap-2">
//                 <div
//                   className="rounded-circle"
//                   style={{ width: 10, height: 10, backgroundColor: '#F8AE39' }}
//                 ></div>
//                 <span className="small">Net Sale</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Chart */}
//         <div className="bg-white px-3 pt-3 pb-4 rounded-bottom chart-scroll-wrapper">
//           <div className="chart-scroll-inner">
//             <ApexCharts options={options} series={series} type="bar" height={350} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BarChart;

import React from "react";
import ApexCharts from "react-apexcharts";
import "./Graph.css";
import moment from "moment/moment";

const BarChart = ({ BarChartData }) => {
  const {
    filterType,
    summary,
    dailyBreakdown = [],
    start,
    end,
  } = BarChartData || {};
  const totalAmount = summary?.total_sales || 0;

  const filterMonth = moment(start).format("MMMM");
  console.log("filterMonth: ", filterMonth);

  const generateChartData = () => {
    const salesMap = {};
    dailyBreakdown.forEach((item) => {
      salesMap[item.day] = parseFloat(item.daily_total_sales || 0);
    });

    if (filterType === "yearly") {
      const monthData = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2025, i).toLocaleString("default", { month: "short" }),
        value: 0,
      }));

      dailyBreakdown.forEach((item) => {
        const date = new Date(item.day);
        const monthIndex = date.getMonth();
        const sales = parseFloat(item.daily_total_sales || 0);
        monthData[monthIndex].value += sales;
      });

      return {
        labels: monthData.map((m) => m.month),
        values: monthData.map((m) => m.value),
      };
    }

    if (filterType === "monthly") {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const days = [];

      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toISOString().slice(0, 10);
        days.push(dateStr);
      }

      const chartData = days.map((day) => ({
        date: day,
        value: salesMap[day] || 0,
      }));

      return {
        labels: chartData.map((item) =>
          new Date(item.date).toLocaleDateString("default", {
            day: "numeric",
            // month: 'short',
          }),
        ),
        values: chartData.map((item) => item.value),
      };
    }

    // Default: Weekly (last 7 days)
    const endDate = new Date(end || new Date());
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(endDate);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      days.push(dateStr);
    }

    const chartData = days.map((day) => ({
      date: day,
      value: salesMap[day] || 0,
    }));

    return {
      labels: chartData.map((item) =>
        new Date(item.date).toLocaleDateString("default", {
          day: "numeric",
          month: "short",
        }),
      ),
      values: chartData.map((item) => item.value),
    };
  };

  const { labels, values } = generateChartData();

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    },
    legend: { show: false },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 8,
        borderRadiusApplication: "around",
        endingShape: "rounded",
      },
    },
    colors: ["#e07a5f"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        gradientToColors: ["#f5a58e"],
        stops: [0, 100],
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    xaxis: {
      categories: labels,
      labels: {
        style: { fontSize: "12px", fontWeight: 600, colors: "#94a3b8" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", fontWeight: 600, colors: "#94a3b8" },
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      padding: { left: 0, right: 0, bottom: 0, top: 0 },
    },
    tooltip: {
      theme: "light",
      y: { formatter: (val) => `₹${val}` },
      style: { fontSize: "13px" },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { height: 300 },
          plotOptions: { bar: { columnWidth: "65%", borderRadius: 6 } },
          xaxis: { labels: { rotate: -45, style: { fontSize: "10px" } } },
        },
      },
    ],
  };

  const series = [
    {
      name: "Net Sale",
      data: values,
    },
  ];

  return (
    <div className="my-0">
      <div className="graph-container">
        {/* Header */}
        <div
          className="recent-tble-header"
          style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}
        >
          <div
            className="d-flex justify-content-between align-items-center flex-wrap"
            style={{ gap: "8px" }}
          >
            <div>
              <h6
                style={{
                  fontWeight: 700,
                  fontSize: "15px",
                  color: "#0f172a",
                  marginBottom: "2px",
                }}
              >
                {filterType === "yearly"
                  ? "Yearly Statistics"
                  : filterType === "monthly"
                    ? `${filterMonth} Statistics`
                    : "This Week Statistics"}
              </h6>
              <p
                style={{ fontSize: "12px", color: "#94a3b8", marginBottom: 0 }}
              >
                Sales performance overview
              </p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #F8AE39, #f59e0b)",
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#475569",
                  }}
                >
                  Net Sale
                </span>
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#0f172a",
                  marginLeft: "8px",
                }}
              >
                ₹{totalAmount}
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="chart-scroll-wrapper">
          <div className="chart-scroll-inner">
            <ApexCharts
              options={options}
              series={series}
              type="bar"
              height={320}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
