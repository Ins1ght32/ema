import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';


import Iconify from 'src/components/iconify';

import AppCurrentVisits from '../app-current-visits';
import AppWidgetSummary from '../app-widget-summary';
import TimelineChart from '../app-timeline';

// ----------------------------------------------------------------------

function DownloadToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport
        csvOptions={{
          fileName: 'ema_export',
        }}
      />
    </GridToolbarContainer>
  );
}

export default function AppView() {

  const [totalDevices, setTotalDevices] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [EOSDevices, setEOSDevices] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [zeroToThreeDevices, setZeroToThreeDevices] = useState(null);
  const [threeToSixDevices, setThreeToSixDevices] = useState(0);
  const [sixPlusDevices, setSixPlusDevices] = useState(null);
  const [noDatesDevices, setNoDatesDevices] = useState(null);
  const [noUrlProducts, setNoUrlProducts] = useState(null);
  const [cannotCrawlProducts, setCannotCrawlProducts] = useState(null);
  const [testingPieChart, setTestingPieChart] = useState([]);
  const [numProducts, setNumProducts] = useState(5);
  const [allProducts, setAllProducts] = useState([]);
  const [dataState, setDataState] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Define a click handler for the scatterplot points
const handleScatterplotClick = (dataPoint) => {
  setSelectedProduct(dataPoint);
};

  const handleChangeNumProducts = (event) => {
    setNumProducts(event.target.value);
  };

  const fetchDataWithQuery = async () => {
    const categoryID = sessionStorage.getItem("categoryID");
    const vendorID = sessionStorage.getItem("vendorID"); 
    const response = await fetch(`https://localhost:6969/all-products-query?categoryID=${categoryID}&vendorID=${vendorID}`);

    const json = await response.json();

    if (response.ok) {
      // console.log(json);
      setAllProducts(json);
    } else {
      ;
    }    
  };

  useEffect(() => {
    if (allProducts.length > 0) {
      const currentDate = new Date();
      const still_supported_date = new Date("9999-12-31");
      const no_date = new Date("9998-12-31 00:00:00");
      const eos_but_no_date = new Date("1000-01-01");
      const null_date = new Date("1969-12-31T16:30:00.000Z");
      const sixMonth = 1.577e+10;
      const threeMonth = 7.884e+9;
      const updatedArray = allProducts.map(obj => {
        const eolDate = new Date(obj.eos_date);
        if (eolDate >= currentDate || eolDate.getTime() === still_supported_date.getTime()) {
          if (eolDate - currentDate <= threeMonth) {
            // console.log(eolDate);
            // 0 -3 months, orange
            obj.color = '#FF5F1F';
          }
          else if (eolDate - currentDate <= sixMonth) {
            // 3 - 6 months, yellow
            obj.color = '#FFFF00';
          }
          else if (eolDate.getTime() === still_supported_date.getTime()) {
            // still supported but no eos date
            obj.color = '#008000';
          }
          else if (eolDate.getTime() === no_date.getTime()) {
            obj.color = '#69757a';
          }
          else {
            // more than 6 months, green
            obj.color = '#008000';
          }
        }
        else if(eolDate.getTime() === eos_but_no_date.getTime()) {
          // EOS, red, but no date, just not supported
          obj.color = '#FF0000';
        }
        else if (eolDate.getTime() === null_date.getTime()) {
          // test, null date
          obj.color = '#69757a';
        }
        else {
          // EOS, red
          obj.color = '#FF0000';
        }
        // obj.eos_date = eolDate.toISOString().substring(0, 10);
        return obj;
      });

      // console.log(updatedArray);
      const processedArray = updatedArray.map(row => ({
        ...row,
        eos_date: !row.url && new Date(row.eos_date).getTime() === new Date('1969-12-31T16:30:00.000Z').getTime() ? 'No URL Provided' : row.eos_date,
        // eos_date: ((row.url != null || row.eos_date.getTime() !== new Date('1970-01-01 00:00:00').getTime())) ? row.eos_date : 'No URL Provided',
        // eos_date: row.url != null || row.url != '' ? row.eos_date : '1999-13-31',
        remarks: row.remarks != null && row.remarks !== '' ? row.remarks : 'NIL',
        contains_primary_source: row.do_not_crawl === 'yes' ? `${row.contains_primary_source}_nocrawl` : row.contains_primary_source
      }));
      setDataState(processedArray);
      // console.log(dataState);
    }
  }, [allProducts]);

  useEffect(() => {
    fetchDataWithQuery();
    console.log(dataState);
  })

  const customLocaleText = {
    // Override sorting labels
    columnMenuSortAsc: 'Sort by A-Z',
    columnMenuSortDesc: 'Sort by Z-A',
  };

  const columns = [
    { field: 'product_name', headerName: 'Product Name', width: 150,
      renderCell: (params) => (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          height: '100%', 
          paddingLeft: 8,
          whiteSpace: 'normal', wordWrap: 'break-word', lineHeight: '1.5'
      }}>
          {params.value}
      </div>
      )
     },
    { field: 'all_hostnames', headerName: 'Affected Hostnames', width: 150,
      renderCell: (params) => (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          height: '100%', 
          paddingLeft: 8,
          whiteSpace: 'normal', wordWrap: 'break-word', lineHeight: '1.5'
      }}>
          {params.value}
      </div>
      )
     },
    { field: 'category_name', headerName: 'Category', width: 150},
    { field: 'vendor_name', headerName: 'Vendor Managing', width: 150},
    { field: 'version_number', headerName: 'Current Version', width: 150},
    { field: 'target_version', headerName: 'Latest Release', width: 150},
    { 
      field: 'eos_date' ,
      headerName: 'End of Support Date\n(YYYY-MM-DD)', 
      width: 150,
      valueGetter: (params) => {
        // NULL, cannot crawl
        // console.log(typeof(params));
        // console.log(params);
        // console.log(dataState[params.rowIndex]);
        if (params == null || params === "1969-12-31T16:30:00.000Z" || params === "1969-12-31T07:30:00Z") {
          return "Cannot Crawl"
        }
        if (new Date(params).getTime() === new Date("9998-12-31 00:00:00").getTime()) {
          return "No Dates"
        }
        if (new Date(params).getTime() === new Date("9999-12-31 00:00:00").getTime()) {
          return "Supported"
        }
        return params
      },
      valueFormatter: (params) => {
        const dateValue = params;
        // console.log(dateValue);
        // Check if the dateValue is a valid date
        if (dateValue === "Cannot Crawl" || dateValue === "Supported" || dateValue === "No URL Provided" || dateValue === "No Dates") {
          return dateValue
        }
        const date = new Date(dateValue);
        if (!Number.isNaN(date.getTime())) {
          // offset gmt+8
          date.setHours(date.getHours() + 8);
          return date.toISOString().split('T')[0];
        }
        return '';
      }},
    // { field: 'contains_primary_source', headerName: 'Crawled from URL?', width: 150 },
    {
      field: 'color',
      headerName: 'Status',
      description: 'To sort, sort by End of Support Date',
      sortable: false,
      width: 80,
      disableExport: true,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%', height: '100%' }}>
        <Box sx={{ width:60, height: 30, bgcolor: params.value, borderRadius: 8, justifyContent: "center", display: 'flex', alignItems: 'center' }}/>
        </div>
      ),
    },
    { field: 'contains_primary_source', headerName: 'Additional Info', width: 100, disableExport: true,
      renderCell: (params) => {
        const value = params.value;
        let tooltipContent;

        const nocrawlIcon = (
            <span>Disabled Auto Crawling: 
            <Iconify icon="mdi:tick" style={{color: '#2ad21e'}} /><br />
            </span>
        );

        const crawlIcon = (
            <span>Disabled Auto Crawling: 
            <Iconify icon="akar-icons:cross" style={{color: '#d73c3c'}} /><br />
            </span>
        );

        if (value === "1_yes" || value === "1_yes_nocrawl") {
          // case 1 and dates correlate
          tooltipContent = ( 
          <>
          <span>Date Crawled from user provided URL: 
          <Iconify icon="mdi:tick"  style={{color: '#2ad21e'}} /> <Iconify icon="mdi:tick"  style={{color: '#2ad21e'}} /><br />
          </span>
          <span>Date Crawled from endoflife.date: 
          <Iconify icon="mdi:tick"  style={{color: '#2ad21e'}}/><br />
          </span>
          <span>Dates Correlate: 
          <Iconify icon="mdi:tick"  style={{color: '#2ad21e'}}/><br />
          </span>
          <span>Date Edited By User: 
          <Iconify icon="akar-icons:cross"  style={{color: '#d73c3c'}} /><br />
          </span>
          {value.includes("nocrawl") ? nocrawlIcon : crawlIcon}
          </>
          );
        }
        else if (value === "1_no" || value === "1_no_nocrawl") {
          // case 1 and dates do not correlate
          tooltipContent = ( 
            <>
            <span>Date Crawled from user provided URL: 
            <Iconify icon="mdi:tick"  style={{color: '#2ad21e'}} /> <Iconify icon="mdi:tick"  style={{color: '#2ad21e'}} /><br />
            </span>            
            <span>Date Crawled from endoflife.date: 
            <Iconify icon="mdi:tick"  style={{color: '#2ad21e'}}/><br />
            </span>
            <span>Dates Correlate: 
            <Iconify icon="akar-icons:cross"  style={{color: '#d73c3c'}} /><br />
            </span>
            <span>Date Edited By User: 
            <Iconify icon="akar-icons:cross"  style={{color: '#d73c3c'}} /><br />
            </span>
            {value.includes("nocrawl") ? nocrawlIcon : crawlIcon}
            </>
            );
        }
        else if (value === "2" || value === "2_nocrawl") {
          // case 2
          tooltipContent = ( 
            <>
            <span>Date Crawled from user provided URL: 
            <Iconify icon="akar-icons:cross"  style={{color: '#d73c3c'}} /><br />
            </span>
            <span>Date Crawled from endoflife.date: 
            <Iconify icon="mdi:tick"  style={{color: '#2ad21e'}}/><br />
            </span>
            <span>Date Edited By User: 
            <Iconify icon="akar-icons:cross"  style={{color: '#d73c3c'}} /><br />
            </span>
            {value.includes("nocrawl") ? nocrawlIcon : crawlIcon}
            </>
            );
        }
        else if (value === "3" || value === "3_nocrawl") {
          // case 3
          tooltipContent = ( 
            <>
            <span>Date Crawled from user provided URL: 
            <Iconify icon="mdi:tick"  style={{color: '#2ad21e'}} /><br />
            </span>
            <span>Date Crawled from endoflife.date: 
            <Iconify icon="akar-icons:cross"  style={{color: '#d73c3c'}} /><br />
            </span>
            <span>Date Edited By User: 
            <Iconify icon="akar-icons:cross"  style={{color: '#d73c3c'}} /><br />
            </span>
            {value.includes("nocrawl") ? nocrawlIcon : crawlIcon}
            </>
            );
        }
        else if (value === "4" || value === "4_nocrawl") {
          // case 4
          tooltipContent = ( 
            <>
            <span>Date Crawled from user provided URL: 
            <Iconify icon="akar-icons:cross"  style={{color: '#d73c3c'}} /><br />
            </span>
            <span>Date Crawled from endoflife.date: 
            <Iconify icon="akar-icons:cross"  style={{color: '#d73c3c'}} /><br />
            </span>
            <span>Date Edited By User: 
            <Iconify icon="akar-icons:cross"  style={{color: '#d73c3c'}} /><br />
            </span>
            {value.includes("nocrawl") ? nocrawlIcon : crawlIcon}
            </>
            );
        }
        else if (value === "5" || value === "5_nocrawl") {
          // end of life date edited by user
          tooltipContent = ( 
            <>
            <span>Date Edited By User: 
            <Iconify icon="mdi:tick"  style={{color: '#2ad21e'}}/><br />
            </span>
            {value.includes("nocrawl") ? nocrawlIcon : crawlIcon}
            </>
            );
        }

        return (
          <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%', height: '100%' }}>
          <Tooltip title={tooltipContent}>
            <Box 
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 80,
                height: 30,
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: 1,
                cursor: 'pointer'
              }}
            >
              Hover me
            </Box>
          </Tooltip>
          </div>
        );
      }
     },
    { field: 'remarks', headerName: 'Remarks', width: 80,
      renderCell: (params) => (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          height: '100%', 
          paddingLeft: 8,
          whiteSpace: 'normal', wordWrap: 'break-word', lineHeight: '1.5'
      }}>
          {params.value}
      </div>
      )
     },
  ];

  useEffect(() => {

    const fetchTimelineDataQuery = async () => {
      const categoryID = sessionStorage.getItem("categoryID");
      const vendorID = sessionStorage.getItem("vendorID"); 
      const response = await fetch(`https://localhost:6969/timeline-data-query?categoryID=${categoryID}&vendorID=${vendorID}&numProducts=${numProducts}`);
      const json = await response.json();
    
      if (response.ok) {
        // console.log(json);
        setTimelineData(json);
      }
    };
  
    const fetchPieDataQuery = async () => {
      const categoryID = sessionStorage.getItem("categoryID");
      const vendorID = sessionStorage.getItem("vendorID"); 
      const response = await fetch(`https://localhost:6969/pie-data-query?categoryID=${categoryID}&vendorID=${vendorID}`);
      const json = await response.json();
    
      if (response.ok) {
        // console.log(json);
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
      <Card sx={{marginTop: 5}}>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
          sx={{
            "& .MuiDataGrid-columnHeaderTitle": {
              whiteSpace: "normal",
              lineHeight: "normal"
            },
            "& .MuiDataGrid-columnHeader": {
              // Forced to use important since overriding inline styles
              height: "unset !important"
            },
            "& .MuiDataGrid-columnHeaders": {
              // Forced to use important since overriding inline styles
              maxHeight: "168px !important"
            }
          }}
          getRowId={(dataState) => dataState.products_id}
          // getRowId={(row) => row.products_id}
          rows={dataState}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            setSelectedRowData(selectedIDs);
          }}
          localeText={customLocaleText}
          // getRowHeight={() => "auto"}
          rowHeight={100}
          slots={{ toolbar: DownloadToolbar }}
        />
        </Box>
      </Card>
    </Container>
    
  );
}