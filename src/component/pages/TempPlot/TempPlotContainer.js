import React, { useState, useEffect } from "react";
import moment from "moment";
import Cookies from "js-cookie";
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
import ReactECharts from "echarts-for-react";
// import moment from 'moment-timezone';

const TempView = () => {
  const [apiKey, setApiKey] = useState("");
  const [sampleNo, setSampleNo] = useState("30"); // Default sampleNo to 30
  const [start, setStart] = useState(
    moment().subtract(5, "days").format("YYYY-MM-DDTHH:mm:ss")
  ); // Default start time
  const [end, setEnd] = useState(moment().format("YYYY-MM-DDTHH:mm:ss")); // Default end time
  const [data, setData] = useState(null);

  useEffect(() => {
    const storedApiKey = Cookies.get("apiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  useEffect(() => {
    if (apiKey) {
      Cookies.set("apiKey", apiKey, { expires: 365 * 10 });
    }
  }, [apiKey]);

  const handleApiKeyChange = (e) => setApiKey(e.target.value);
  const handleSampleNoChange = (e) => setSampleNo(e.target.value);
  const handleStartChange = (e) => setStart(e.target.value);
  const handleEndChange = (e) => setEnd(e.target.value);

  const fetchData = async () => {
    try {
      const formattedStart = moment(start).format("YYYY-MM-DD HH:mm:ss");
      const formattedEnd = moment(end).format("YYYY-MM-DD HH:mm:ss");

      const url = `https://api.ubibot.cn/channels/22188/feeds?average=${sampleNo}&end=${encodeURIComponent(
        formattedEnd
      )}&start=${encodeURIComponent(
        formattedStart
      )}&timezone=Asia%2FHong_Kong&token_id=${apiKey}`;

      // console.log(url)

      const response = await fetch(url);

      console.log(response);

      if (response.status === 429) {
        // Handle rate limiting error
        const errorData = await response.json(); // Assuming JSON response
        console.error(`Error: ${errorData.errorCode} - ${errorData.desp}`);
        alert(`Error: ${errorData.desp} (${errorData.errorCode})`);
      } else if (!response.ok) {
        throw new Error("Failed to fetch data");
      } else {
        // Handle successful response
        const result = await response.json();
        setData(result.feeds);
      }
    } catch (error) {
      console.error(error);
      alert("Error fetching data");
    }
  };

  const getChartOptions = () => ({
    title: {
      text: "Data Plot for Ext1 and Ext2",
      left: "center"
    },
    grid: {
      bottom: 80,
      top: 80
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        animation: false,
        label: {
          backgroundColor: '#505765'
        }
      }
    },
    legend: {
      data: ["Ext1", "Ext2"],
      top: 40,
    },
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 1,
        end: 100
      },
      {
        type: 'inside',
        realtime: true,
        start: 1,
        end: 100
      }
    ],
    xAxis: {
      type: "time",
      axisLine: { onZero: true },
      axisLabel: {
        formatter: "{yyyy}-{MM}-{dd}\n{hh}:{mm}",
      },
    },
    yAxis: [
      {
        type: "value",
        name: "Temperature (°C)",
        scale: true
      }
    ],
    dataZoom: [
      {
        type: "slider",
        start: 0,
        end: 100,
      },
      {
        type: "inside",
        start: 0,
        end: 100,
      },
    ],
    series: data
      ? [
          {
            name: "Ext1",
            type: "line",
            data: data.map((item) => {
              const utcTimestamp = new Date(item.created_at).getTime();
              const hongKongTimestamp = utcTimestamp + 8 * 60 * 60 * 1000;
              return [hongKongTimestamp, parseFloat(item.field7)];
            }),
            lineStyle: {
              width: 2,
            },
            symbol: "circle",
            symbolSize: 6,
          },
          {
            name: "Ext2",
            type: "line",
            data: data.map((item) => {
              const utcTimestamp = new Date(item.created_at).getTime();
              const hongKongTimestamp = utcTimestamp + 8 * 60 * 60 * 1000;
              return [hongKongTimestamp, parseFloat(item.field8)];
            }),
            lineStyle: {
              width: 2,
            },
            symbol: "circle",
            symbolSize: 6,
          },
        ]
      : [],
  });

  // const chartOptions = {
  //   chart:{
  //     type: 'line'
  //   },
  //   title: {
  //     text: 'Data Plot for Ext1 and Ext2'
  //   },
  //   xAxis: {
  //     type: 'datetime',
  //     title: {
  //       text: 'Date'
  //     }
  //   },
  //   yAxis: [
  //     {
  //       title: {
  //         text: 'Temperature (°C)'
  //       },
  //     },
  //     {
  //       title: {
  //         text: 'Humidity (%RH)'
  //       },
  //       opposite: true // Display the second y-axis on the right
  //     }
  //   ],
  //   rangeSelector: {
  //     enabled: true, // Enables the range selector
  //     selected: 1 // Default to the second option (e.g., 1 month)
  //   },
  //   series: data ? [
  //     {
  //       name: 'Ext1',
  //       data: data.map(item => {
  //         const utcTimestamp = new Date(item.created_at).getTime();
  //         const hongKongTimestamp = utcTimestamp + (8 * 60 * 60 * 1000);
  //         return [hongKongTimestamp, parseFloat(item.field7)];
  //       }),
  //       // data: data.map(item => [moment.tz(item.created_at, 'Asia/Hong_Kong').valueOf(), parseFloat(item.field7)]),
  //       color: 'blue',
  //       yAxis: 0 // Use the first y-axis
  //     },
  //     {
  //       name: 'Ext2',
  //       data: data.map(item => {
  //         const utcTimestamp = new Date(item.created_at).getTime();
  //         const hongKongTimestamp = utcTimestamp + (8 * 60 * 60 * 1000);
  //         return [hongKongTimestamp, parseFloat(item.field8)];
  //       }),
  //       // data: data.map(item => [moment.tz(item.created_at, 'Asia/Hong_Kong').valueOf(), parseFloat(item.field8)]),
  //       color: 'red',
  //       yAxis: 0 // Use the first y-axis
  //     },
  //     {
  //       name: 'Humidity',
  //       data: data.map(item => {
  //         const utcTimestamp = new Date(item.created_at).getTime();
  //         const hongKongTimestamp = utcTimestamp + (8 * 60 * 60 * 1000);
  //         return [hongKongTimestamp, parseFloat(item.field2)];
  //       }),
  //       // data: data.map(item => [moment.tz(item.created_at, 'Asia/Hong_Kong').valueOf(), parseFloat(item.field2)]),
  //       color: 'green',
  //       yAxis: 1, // Use the second y-axis
  //       visible: false
  //     }
  //   ] : []
  // };

  // console.log(chartOptions.series)

  return (
    <div className="p-6 max-w-7xl mx-auto shadow-md space-y-4">
      <h1 className="text-2xl font-bold">Temp View</h1>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="border rounded p-2 flex-grow"
            placeholder="Enter API key"
            value={apiKey}
            onChange={handleApiKeyChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="border rounded p-2 flex-grow"
            placeholder="Sample No (1 min per point)"
            value={sampleNo}
            onChange={handleSampleNoChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="datetime-local"
            className="border rounded p-2 flex-grow"
            value={start}
            onChange={handleStartChange}
          />
          <input
            type="datetime-local"
            className="border rounded p-2 flex-grow"
            value={end}
            onChange={handleEndChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700"
            onClick={fetchData}
          >
            Fetch
          </button>
        </div>
      </div>
      {data && (
        <ReactECharts
          option={getChartOptions()}
          style={{ height: "600px", width: "100%" }}
        />
      )}
    </div>
  );
};

export default TempView;
