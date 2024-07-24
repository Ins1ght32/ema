import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import AppCurrentVisits from '../app-current-visits';
import AppWidgetSummary from '../app-widget-summary';
import TimelineChart from '../app-timeline';

// ----------------------------------------------------------------------

export default function AppView() {

  const [totalDevices, setTotalDevices] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [EOSDevices, setEOSDevices] = useState(null);
  const [zeroToThreeDevices, setZeroToThreeDevices] = useState(null);
  const [threeToSixDevices, setThreeToSixDevices] = useState(0);
  const [sixPlusDevices, setSixPlusDevices] = useState(null);
  const [noDatesDevices, setNoDatesDevices] = useState(null);
  const [noUrlProducts, setNoUrlProducts] = useState(null);
  const [cannotCrawlProducts, setCannotCrawlProducts] = useState(null);
  const [testingPieChart, setTestingPieChart] = useState([]);
  const [numProducts, setNumProducts] = useState(5);
  const test_post_msg = 'I want apple';

  const handleChangeNumProducts = (event) => {
    setNumProducts(event.target.value);
  };

  useEffect(() => {

    const fetchTimelineDataQuery = async () => {
      const categoryID = sessionStorage.getItem("categoryID");
      const vendorID = sessionStorage.getItem("vendorID"); 
      const response = await fetch(`${import.meta.env.VITE_WEBSITE_BACKEND_URL}/timeline-data-query?categoryID=${categoryID}&vendorID=${vendorID}&numProducts=${numProducts}`);
      const json = await response.json();
    
      if (response.ok) {
        // console.log(json);
        setTimelineData(json);
      }
    };
  
    const fetchPieDataQuery = async () => {
      const categoryID = sessionStorage.getItem("categoryID");
      const vendorID = sessionStorage.getItem("vendorID"); 
      const response = await fetch(`${import.meta.env.VITE_WEBSITE_BACKEND_URL}/pie-data-query?categoryID=${categoryID}&vendorID=${vendorID}`);
      const json = await response.json();
    
      if (response.ok) {
        console.log(json);
        setTotalDevices(json[0].value + json[1].value + json[2].value + json[3].value + json[4].value);
        setEOSDevices(json[0].value);
        setZeroToThreeDevices(json[1].value);
        setThreeToSixDevices(json[2].value);
        setSixPlusDevices(json[3].value);
        setNoDatesDevices(json[4].value);
        setNoUrlProducts(json[5].value);
        setCannotCrawlProducts(json[6].value);
    
        // Create a new array excluding the unwanted values
        const filteredJson = json.filter((item, index) => index !== 5 && index !== 6);
    
        setTestingPieChart(filteredJson);
      }
    };
    fetchTimelineDataQuery();
    fetchPieDataQuery();
  }, [numProducts]); // numProducts added to dependency array

  return (

    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={2} justifyContent="space-between">
        <Grid xs={6} sm={5} md={3} lg={3}>
          <AppWidgetSummary
            title="Total Products"
            total={totalDevices}
            color="success"
            icon={<img alt="icon" src="/assets/icons/custom/totalProducts.png" />}
          />
        </Grid>

        <Grid xs={12} sm={5} md={3} lg={3}>
          <AppWidgetSummary
            title="No URL Products"
            total={noUrlProducts}
            color="info"
            icon={<img alt="icon" src="/assets/icons/custom/no-url.png" />}
          />
        </Grid>

        <Grid xs={12} sm={5} md={3} lg={3}>
          <AppWidgetSummary
            title="Cannot Crawl"
            total={cannotCrawlProducts} // cannot crawl and noDates exactly the same
            color="warning"
            icon={<img alt="icon" src="/assets/icons/custom/cannot-crawl.png" />}
          />
        </Grid>

        <Grid xs={12} sm={5} md={3} lg={3}>
          <AppWidgetSummary
            title="No Dates"
            total={noDatesDevices}
            color="error"
            icon={<img alt="icon" src="/assets/icons/custom/null.png" />}
          />
        </Grid>

        <Grid xs={12} sm={5} md={3} lg={3}>
          <AppWidgetSummary
            title="EOS Products"
            total={EOSDevices}
            color="error"
            icon={<img alt="icon" src="/assets/icons/custom/eos.png" />}
          />
        </Grid>

        <Grid xs={12} sm={5} md={3} lg={3}>
          <AppWidgetSummary
            title="0-3 Months"
            total={zeroToThreeDevices}
            color="info"
            icon={<img alt="icon" src="/assets/icons/custom/0-3.png" />}
          />
        </Grid>

        <Grid xs={12} sm={5} md={3} lg={3}>
          <AppWidgetSummary
            title="3-6 Months"
            total={threeToSixDevices}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/custom/3-6.png" />}
          />
        </Grid>

        <Grid xs={12} sm={5} md={3} lg={3}>
          <AppWidgetSummary
            title="6 Months +"
            total={sixPlusDevices}
            color="error"
            icon={<img alt="icon" src="/assets/icons/custom/6.png" />}
          />
        </Grid>

        <Grid xs={12}>
          <AppCurrentVisits data={testingPieChart}
            title="EOS Pie Chart"
          />
        </Grid>
        <Grid xs={12}>
          <div>
            <label htmlFor="numProducts">Select Number of Products:
              <select id="numProducts" value={numProducts} onChange={handleChangeNumProducts}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value="all">All</option>
              </select>
            </label>
          </div>
        </Grid>
        <Grid xs={12}>
          <TimelineChart data={timelineData}
          title="EOS Timeline"
          />
        </Grid>
      </Grid>
    </Container>
  );
}
