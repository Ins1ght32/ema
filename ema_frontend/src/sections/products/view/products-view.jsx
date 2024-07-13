import { useState, useEffect, useRef } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { DataGrid, GridToolbar, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/system';

import Iconify from 'src/components/iconify';
import Alert from '@mui/material/Alert';

import AddForm from '../products-add-form';
import EditForm from '../products-edit-form';
import AddBulkHostnamesForm from '../products-bulk-add-hostnames-form'
import DeleteBulkHostnamesForm from '../products-bulk-delete-hostnames-form'

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

export default function ProductsView() {

  const gridRef = useRef(null);

  const [openAddForm, setOpenAddForm] = useState(false);
  const [openAddBulkHostnamesForm, setOpenAddBulkHostnamesForm] = useState(false);
  const [openDeleteBulkHostnamesForm, setOpenDeleteBulkHostnamesForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [editData, setEditData] = useState({ product_name: '', version_number: '', link: '', target_version: '', eos_date: '', remarks: '' });
  const [allProducts, setAllProducts] = useState([]);
  const [dataState, setDataState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCrawlAllTime, setCurrentCrawlAllTime] = useState(null);
  
  const handleClickOpenAdd = () => {
    setOpenAddForm(true);
  }

  const handleClickCloseAdd = () => {
    setOpenAddForm(false);
  }

  const handleClickOpenEdit = (data) => {
    setEditData(data);
    setOpenEditForm(true);
  }

  const handleClickCloseEdit = () => {
    setEditData({ product_name: '', version_number: '', link: '', target_version: '', eos_date: '', remarks: '' });
    setOpenEditForm(false);
  }

  const handleClickOpenAddBulkHostnames = () => {
    setOpenAddBulkHostnamesForm(true);
  }

  const handleClickCloseAddBulkHostnames = () => {
    setOpenAddBulkHostnamesForm(false);
  }

  const handleClickOpenDeleteBulkHostnames = () => {
    setOpenDeleteBulkHostnamesForm(true);
  }

  const handleClickCloseDeleteBulkHostnames = () => {
    setOpenDeleteBulkHostnamesForm(false);
  }



  /*
  const handleDownload = async () => {
    try {
      const categoryID = sessionStorage.getItem("categoryID");
      const vendorID = sessionStorage.getItem("vendorID"); 

      const selectedColumns = ['products_id', 'product_name', 'category_name', 'vendor_name', 'version_number', 'target_version', 'eos_date'];

      const requestBody = {
        dataState: rows.map(row => {
          const selectedData = {};
          selectedColumns.forEach(col => {
            selectedData[col] = row[col];
          });
          return selectedData;
        }),
        categoryID,
        vendorID,
      };

      const response = await fetch('/download-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading the CSV file', error);
    }
  };
  */
  
  const handleAddSubmit = async (formData) => {
    setLoading(true);
    const response = await fetch("http://localhost:6969/add-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const result = await response.json();

    if (response.ok) {
      fetchDataWithQuery();
      setLoading(false);
      // fetchData();
      // fetchDataWithQuery();
    }
    setLoading(false);
    console.log(result);
  };

  const handleCrawlNow = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:6969/crawlNow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: -1 })
    });

    const result = await response.json();

    if (response.ok) {
      fetchDataWithQuery();
      getCrawlTime();
      setLoading(false);

    }
    setLoading(false);
    console.log(result);
  }

  const handleEditSubmit = async (formData) => {
    setLoading(true);
    console.log("EDIT FORM");
    console.log(formData);

    if (formData.do_not_crawl === "no") {
      formData.crawlNow = "yes";
    }

    const response = await fetch("http://localhost:6969/edit-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      fetchDataWithQuery();
      // fetchData();
      setLoading(false);
      // fetchData();
      // fetchDataWithQuery();
    }
    setLoading(false);
    console.log(result);
  };

  const handleDeleteButton = async (rowData, arrayData) => {
    setLoading(true);
    const rowDataArray = [...rowData];

    const testID = rowDataArray.map(row => row.products_id).toString();

    const sendIDs = { "id": rowDataArray};
    console.log(sendIDs);
    
    const response = await fetch("http://localhost:6969/delete-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendIDs),
    });
    
    const result = await response.json();

    if (response.ok) {
      // fetchData();
      // fetchDataWithQuery();
      setLoading(false);
      // fetchData();
      fetchDataWithQuery();
    }
    setLoading(false);
    console.log(result);

    // maybe can delete this.
    setDataState(arrayData.filter(obj => obj.products_id !== testID));
    console.log(arrayData);

  };

  const handleAddBulkHostnamesSubmit = async (formData) => {
    setLoading(true);
    const formDataToSend = {
      hostnames: formData.hostnames,
      selectedRowData: Array.from(formData.selectedRowData)
  };

    const response = await fetch("http://localhost:6969/bulk-add-hostnames", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataToSend),
    });
    const result = await response.json();

    if (response.ok) {
      fetchDataWithQuery();
      // fetchData();
      setLoading(false);
      // fetchData();
      // fetchDataWithQuery();
    }
    setLoading(false);
    console.log(result);
  }

  const handleDeleteBulkHostnamesSubmit =  async (formData) => {
    setLoading(true);
    const formDataToSend = {
      hostnames: formData.hostnames,
      selectedRowData: Array.from(formData.selectedRowData)
  };

  console.log(formDataToSend);

    const response = await fetch("http://localhost:6969/bulk-delete-hostnames", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataToSend),
    });
    const result = await response.json();

    if (response.ok) {
      fetchDataWithQuery();
      // fetchData();
      setLoading(false);
      // fetchData();
      // fetchDataWithQuery();
    }
    setLoading(false);
    console.log(result);
  }

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:6969/all-products");

    const json = await response.json();

    if (response.ok) {
      console.log(json);
      setAllProducts(json);
      setLoading(false);
    } else {
      ;
    }
    setLoading(false);
  };

  const fetchDataWithQuery = async () => {
    setLoading(true);
    const categoryID = sessionStorage.getItem("categoryID");
    const vendorID = sessionStorage.getItem("vendorID"); 
    const response = await fetch(`http://localhost:6969/all-products-query?categoryID=${categoryID}&vendorID=${vendorID}`);

    const json = await response.json();

    if (response.ok) {
      console.log(json);
      setAllProducts(json);
      setLoading(false);
    } else {
      ;
    }
    setLoading(false);
    
  };

  useEffect(() => {
    // fetchData();
    fetchDataWithQuery();
    getCrawlTime();
  }, []);

  const getCrawlTime = async () => {
    const response = await fetch('http://localhost:6969/crawl-time');
    const json = await response.json();

    if (response.ok) {
      const isoDateString = json[0].crawl_time;
      const dateObject = new Date(isoDateString);

      // Format the date into a human-readable string
      const humanReadableDate = dateObject.toLocaleString('en-SG', {
        timeZone: 'Asia/Singapore',
        weekday: 'long', // e.g., "Wednesday"
        year: 'numeric', // e.g., "2024"
        month: 'long', // e.g., "July"
        day: 'numeric', // e.g., "10"
        hour: 'numeric', // e.g., "12"
        minute: 'numeric', // e.g., "15"
        second: 'numeric', // e.g., "06"
      });

      // Set the formatted date to state
      setCurrentCrawlAllTime(humanReadableDate);
    }
    
  }

  useEffect(() => {
    console.log("Inside useEffect:", selectedRowData);
}, [selectedRowData]);

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
            console.log(eolDate);
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
        console.log(params);
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
        /*
        return (
          <Tooltip title={tooltipContent}>
            <span>Hover me</span>
          </Tooltip>
        );
        */
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
    { field: 'action', headerName: 'Action', width: 80, disableExport: true,
      renderCell: (params) => (
        <Button
        variant="contained"
        color="primary"
        onClick={() => handleClickOpenEdit(params.row)}
      >
        Edit
      </Button>
      ),
    },
  ];

  const customLocaleText = {
    // Override sorting labels
    columnMenuSortAsc: 'Sort by A-Z',
    columnMenuSortDesc: 'Sort by Z-A',
  };

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .MuiDataGrid-root': {
      '& .MuiDataGrid-cell': {
        borderBottom: `1px solid ${theme.palette.divider}`, // Ensure cells have a bottom border
      },
      '& .MuiDataGrid-columnHeader': {
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        lineHeight: '1.5',
        overflow: 'visible',
        borderBottom: `2px solid ${theme.palette.divider}`, // Add a bottom border to headers for separation
      },
      '& .MuiDataGrid-columnHeaderTitle': {
        overflow: 'visible',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        lineHeight: '1.5',
      },
    },
  }));

  return (
    <Container maxWidth="xl">
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </div>
      )}
      <Typography variant="h4" sx={{ mb: 5 }}>
        Products
      </Typography>

      <Alert severity="warning">If dates do not correlate, the end of support date will be taken from the URL provided.</Alert>
      <br />
      <br />

      <Grid container spacing={2} justifyContent="flex-end">
        {currentCrawlAllTime ? (
              <Alert severity="success">Last crawled time: {currentCrawlAllTime}</Alert>
            ) : (
              <Alert severity="info" style={{ marginLeft: 'auto', padding: '8px'}}>Last crawled time: Never</Alert>
        )}
      </Grid>

      <br />
      
      <Grid container spacing={2} justifyContent="flex-end">
        <Grid item>
          <Button variant="contained" color="inherit" onClick={handleCrawlNow} style={{ marginLeft: 'auto'}}>
                Crawl All Now
          </Button>
        </Grid>
      </Grid>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      />

      <Grid container spacing={1} justifyContent="flex-end">
        <Grid item>
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpenAdd}>
            Add Product
        </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:minus-fill" />} onClick={() => handleDeleteButton(selectedRowData, dataState)}>
              Delete Product
          </Button>
        </Grid>
        {/*
        <Grid item>
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpenAddBulkHostnames}>
              Add Hostnames
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:minus-fill" />} onClick={handleClickOpenDeleteBulkHostnames}>
              Delete Hostnames
          </Button>
        </Grid>
        */}
      </Grid>

      <AddForm open={openAddForm} onClose={handleClickCloseAdd} onSubmit={handleAddSubmit} />
      <EditForm defaultData={editData} open={openEditForm} onClose={handleClickCloseEdit} onSubmit={handleEditSubmit} />
      <AddBulkHostnamesForm selectedRows={selectedRowData} open={openAddBulkHostnamesForm} onClose={handleClickCloseAddBulkHostnames} onSubmit={handleAddBulkHostnamesSubmit} />
      <DeleteBulkHostnamesForm selectedRows={selectedRowData} open={openDeleteBulkHostnamesForm} onClose={handleClickCloseDeleteBulkHostnames} onSubmit={handleDeleteBulkHostnamesSubmit} />

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
    </Container>
  );
}
