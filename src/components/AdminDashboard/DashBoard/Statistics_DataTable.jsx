import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip as ChartTooltip, Legend } from 'chart.js';
import styles from './Statistics_DataTable.module.css';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTooltip, Legend);

const Statistics_DataTable = () => {
  const [stats, setStats] = useState({});
  const [graphData, setGraphData] = useState({});
  const [pieData, setPieData] = useState([
    { name: 'Short', value: 0, color: '#3a57e8' },
    { name: 'Long', value: 0, color: '#85f4fa' }
  ]);
  const [techTotal, setTechTotal] = useState([]);
  const [pie, setPie] = useState([0, 0, 0, 0, 0, 0]);
  const [dayTotal, setDayTotal] = useState(0);
  const [daysForWeek, setDaysForWeek] = useState({});
  const [weeksForMonthS, setWeeksForMonthS] = useState({});
  const [timePie, setTimePie] = useState('Week');
  const [timeGraph, setTimeGraph] = useState('Week');

  const token = JSON.parse(sessionStorage.getItem('user'))?.token;

  let barData = {
    labels: graphData.days || [],
    datasets: [
      {
        label: 'Income',
        data: graphData.values || [],
        backgroundColor: '#3a57e8',
      }
    ]
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 1000,
        ticks: {
          stepSize: 200
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  const fetchRequests = async () => {
    try {
      const reqUrl = `/api/helpSession/getRequestsDashboard`;

      const reqResponse = await fetch(reqUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const reqJson = await reqResponse.json();
      

      const totalReq = reqJson.total;

      let totalCancelled = 0;
      let totalCompletedShort = 0;
      let totalCompletedLong = 0;
      let day = [];
      let week = [];
      let month = [];
      const dateToday = new Date(Date.now()).getDate();
      const days = {'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0};
      const weeksForMonth = {'week1': 0, 'week2': 0,'week3': 0, 'week4': 0};
      const daysIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      let techCalc = {};
      let techCount = {};
      let techTrack = {};
      let techComb = [];

      await reqJson.data.forEach((req) => {
        const st = req.status.toLowerCase();
        const typ = req.type.toLowerCase();
        const reqDay = req.createdAt.match(/\d{4}-\d{2}-(\d{2})/)[1];

        if (st === "canceled")
          totalCancelled += 1;
        else if (st === "completed") {
          if (typ === "short"){
            totalCompletedShort += 1;
            if(req.specialist){
              if (techCalc[req.specialist._id]){
                techCalc[req.specialist._id] += 100;
                techCount[req.specialist._id] += 1;}
                else {
                  techCalc[req.specialist._id] = 100;
                  techCount[req.specialist._id] = 1;
                }
            }
          }
          else if (typ === "long"){
            totalCompletedLong += 1;
            if(req.specialist){
              if (techCalc[req.specialist._id]){
                techCalc[req.specialist._id] += 175;
                techCount[req.specialist._id] += 1;}
                else {
                  techCalc[req.specialist._id] = 175;
                  techCount[req.specialist._id] = 1;
                }
            }
          }
          if ((dateToday - reqDay) === 0)
            day.push(req);
          if ((dateToday - reqDay) < 7)
            week.push(req);
          if ((dateToday - reqDay) < 30)
            month.push(req)
          if (req.specialist)
            techTrack[req.specialist._id] = req.specialist.specialist_name;
        }
      });

      let totalConv = 0;
      let shortCount = [0, 0, 0, 0, 0, 0];

      day.forEach((req) => {
        if (req.type === 'short') {
          totalConv += 200;
          shortCount[0] += 1;
        } else {
          totalConv += 350;
          shortCount[1] += 1;
        }
      });
      week.forEach((req) => {
        if (req.type.toLowerCase() === 'short'){
          days[daysIndex[req.dayOfTheWeek]] = (days[daysIndex[req.dayOfTheWeek]] + 200);
          shortCount[2] += 1;
        } else {
          shortCount[3] += 1;
          days[daysIndex[req.dayOfTheWeek]] = days[daysIndex[req.dayOfTheWeek]] + 350;
        } 
      });
      month.forEach((req) => {
        const dayDiff = (dateToday - req.createdAt.match(/\d{4}-\d{2}-(\d{2})/)[1]);

        if (req.type.toLowerCase() === 'short')
          shortCount[4] += 1;
        else
          shortCount[5] += 1;

        switch (true){
          case dayDiff < 8:
            weeksForMonth.week1 = req.type.toLowerCase() === 'short' ? (weeksForMonth.week1 + 200) : (weeksForMonth.week1 + 350);
            break;
          case dayDiff < 15:
            weeksForMonth.week2 = req.type.toLowerCase() === 'short' ? (weeksForMonth.week2 + 200) : (weeksForMonth.week2 + 350);
            break;
          case dayDiff < 23:
            weeksForMonth.week3 = req.type.toLowerCase() === 'short' ? (weeksForMonth.week3 + 200) : (weeksForMonth.week3 + 350);
            break;
          case dayDiff < 30:
            weeksForMonth.week4 = req.type.toLowerCase() === 'short' ? (weeksForMonth.week4 + 200) : (weeksForMonth.week4 + 350);
            break;
          default:
            break;
        }
      });
      Object.entries(techCalc).forEach(([key, value]) => {
        techComb.push({
          id: key,
          name: techTrack[key],
          reqHandled: techCount[key].toString(),
          rev: value.toString()
        })
      });

      const totalEarned = (totalCompletedShort * 200) + (totalCompletedLong * 350);

      setStats({
        repairs: totalReq.toString(), 
        cancels: totalCancelled.toString(), 
        totalEarned: totalEarned.toString(), 
        distributions: (totalEarned / 2).toString()
      })
      setDayTotal(totalConv);
      setDaysForWeek(days);
      setWeeksForMonthS(weeksForMonth);
      setPie(shortCount);

      setTimeGraph('day');
      setTimePie('day');
      setTechTotal(techComb);

    } catch (err) {
      console.error("Failed to fetch shops", err);
    }
  };

  const graphRender = async () => {
    switch (timeGraph){
      case 'day':
        setGraphData({
          days: ['Today'],
          values: [dayTotal]
        });
        break;
      case 'week':
        setGraphData({
          days: Object.keys(daysForWeek),
          values: Object.values(daysForWeek)
        });
        break;
        case 'month':
        setGraphData({
          days: Object.keys(weeksForMonthS),
          values: Object.values(weeksForMonthS)
        });
        break;

      default:
        setGraphData({
          days: ['Today'],
          values: [dayTotal]
        });
        break;
    }
    console.log('hellooo');
    console.log(graphData);
  }

  const pieRenderer = async () => {
    switch (timePie){
      case 'day':
        setPieData([
          { name: 'Short', value: pie[0], color: '#3a57e8' },
          { name: 'Long', value: pie[1], color: '#85f4fa' }
        ]);
        break;
      case 'week':
        setPieData([
          { name: 'Short', value: pie[2], color: '#3a57e8' },
          { name: 'Long', value: pie[3], color: '#85f4fa' }
        ]);
        break;
      case 'month':
          setPieData([
            { name: 'Short', value: pie[4], color: '#3a57e8' },
            { name: 'Long', value: pie[5], color: '#85f4fa' }
          ]);
        break;

      default:
        setPieData([
          { name: 'Short', value: pie[0], color: '#3a57e8' },
          { name: 'Long', value: pie[1], color: '#85f4fa' }
        ]);
        break;
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    if (name === 'bar')
      setTimeGraph(value);
    if (name === 'pie')
      setTimePie(value);
  }

  useEffect(() => { fetchRequests(); }, []);
  useEffect(() => { graphRender(); }, [timeGraph]);
  useEffect(() => { pieRenderer(); }, [timePie]);

  return (
    <div className={styles.container}>
      <div className={styles.statsContainer}>
        <div className={styles.statBox}>
          <div className={styles.statValue}>{stats.repairs}</div>
          <div className={styles.statLabel}>Repairs</div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.statBox}>
          <div className={styles.statValue}>{stats.cancels}</div>
          <div className={styles.statLabel}>Cancels</div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.statBox}>
          <div className={styles.statValue}>{stats.totalEarned}</div>
          <div className={styles.statLabel}>Total Earned</div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.statBox}>
          <div className={styles.statValue}>{stats.distributions}</div>
          <div className={styles.statLabel}>Tech Cut</div>
        </div>
      </div>

      <div className={styles.chartsContainer}>
        <div className={styles.servicesChart}>
          <div className={styles.chartHeader}>
            <h3>Services Done</h3>
            <select name ='pie' onChange={handleChange} className={styles.periodSelector}>
              <option value ='day'>This Day</option>
              <option value ='week'>This Week</option>
              <option value ='month'>This Month</option>
            </select>
          </div>
          <div className={styles.donutChart}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.metrics}>
              {pieData.map((entry, index) => (
                <div key={index} className={styles.metric}>
                  <div className={styles.dot} style={{ background: entry.color }}></div>
                  <div>
                    <div className={styles.metricValue}>{entry.value.toLocaleString()}</div>
                    <div className={styles.metricLabel}>{entry.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.conversionsChart}>
          <div className={styles.chartHeader}>
            <h3>Conversions</h3>
            <select name ='bar' onChange={handleChange} className={styles.periodSelector}>
              <option value ='day'>This Day</option>
              <option value ='week'>This Week</option>
              <option value ='month'>This Month</option>
            </select>
          </div>
          <div className={styles.barChart}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.headerCell}>Technician ID</div>
          <div className={styles.headerCell}>Technician name</div>
          <div className={styles.headerCell}>Requests handled</div>
          <div className={styles.headerCell}>Revenue for the month</div>
        </div>
        <div className={styles.tableBody}>
          {techTotal.map((tech, index) => (
            <div key={index} className={styles.tableRow}>
              <div className={styles.cell}>{tech.id}</div>
              <div className={styles.cell}>{tech.name}</div>
              <div className={styles.cell}>{tech.reqHandled}</div>
              <div className={styles.cell}>{tech.rev}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics_DataTable;