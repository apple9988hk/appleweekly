import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Cookies from 'js-cookie';
import moment from 'moment';

const TempView = () => {
  const [apiKey, setApiKey] = useState('');
  const [sampleNo, setSampleNo] = useState('30'); // Default sampleNo to 30
  const [start, setStart] = useState(moment().subtract(5, 'days').format('YYYY-MM-DDTHH:mm:ss')); // Default start time
  const [end, setEnd] = useState(moment().format('YYYY-MM-DDTHH:mm:ss')); // Default end time
  const [data, setData] = useState(null);

  useEffect(() => {
    const storedApiKey = Cookies.get('apiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  useEffect(() => {
    if (apiKey) {
      Cookies.set('apiKey', apiKey, {  expires: 365 * 10  });
    }
  }, [apiKey]);

  const handleApiKeyChange = (e) => setApiKey(e.target.value);
  const handleSampleNoChange = (e) => setSampleNo(e.target.value);
  const handleStartChange = (e) => setStart(e.target.value);
  const handleEndChange = (e) => setEnd(e.target.value);

  const fetchData = async () => {
    try {
      const formattedStart = moment(start).format('YYYY-MM-DD HH:mm:ss');
      const formattedEnd = moment(end).format('YYYY-MM-DD HH:mm:ss');

      const url = `https://api.ubibot.cn/channels/22188/feeds?average=${sampleNo}&end=${encodeURIComponent(
        formattedEnd
      )}&start=${encodeURIComponent(
        formattedStart
      )}&timezone=Asia%2FHong_Kong&token_id=${apiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      setData(result.feeds);
    } catch (error) {
      console.error(error);
      alert('Error fetching data');
    }
  };

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
        <Plot
          data={[
            {
              x: data.map((item) => item.created_at),
              y: data.map((item) => item.field7),
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: 'blue' },
              name: 'Ext1',
            },
            {
              x: data.map((item) => item.created_at),
              y: data.map((item) => item.field8),
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: 'red' },
              name: 'Ext2',
            },
          ]}
          layout={{
            autosize: true,
            height: 600,
            title: 'Data Plot for Ext1 and Ext2',
            margin: { t: 50, r: 150 },
            modebar: {
                orientation: "v"},
          }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
        />
      )}
    </div>
  );
};

export default TempView;
