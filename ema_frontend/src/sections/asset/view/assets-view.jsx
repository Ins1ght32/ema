/*
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/system';

import Iconify from 'src/components/iconify';
import Alert from '@mui/material/Alert';

import AddBulkHostnamesForm from '../products-bulk-add-hostnames-form'
import DeleteBulkHostnamesForm from '../products-bulk-delete-hostnames-form'
// ----------------------------------------------------------------------

export default function AssetView() {

  const [openAddBulkHostnamesForm, setOpenAddBulkHostnamesForm] = useState(false);
  const [openDeleteBulkHostnamesForm, setOpenDeleteBulkHostnamesForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [dataState, setDataState] = useState([]);
  const [loading, setLoading] = useState(false);

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
  }, []);

  useEffect(() => {
    console.log("Inside useEffect:", selectedRowData);
}, [selectedRowData]);

  useEffect(() => {
      setDataState(allProducts);

  }, [allProducts]);

  const columns = [
    { field: 'products_id', headerName: 'ID', width: 150 },
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

  ];

  const customLocaleText = {
    // Override sorting labels
    columnMenuSortAsc: 'Sort by A-Z',
    columnMenuSortDesc: 'Sort by Z-A',
  };

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .MuiDataGrid-columnHeader': {
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      lineHeight: '1.5',
      overflow: 'visible',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      overflow: 'visible',
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      lineHeight: '1.5',
    },
  }));

  return (
    <Container>
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

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      />

      <Grid container spacing={1} justifyContent="flex-end">
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
      </Grid>

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
      />
      </Box>
    </Container>
  );
}
  */


import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/system';

import Iconify from 'src/components/iconify';
import Alert from '@mui/material/Alert';

import AddBulkHostnamesForm from '../products-bulk-add-hostnames-form'
import DeleteBulkHostnamesForm from '../products-bulk-delete-hostnames-form'
// ----------------------------------------------------------------------

export default function AssetView() {

  const [openAddBulkHostnamesForm, setOpenAddBulkHostnamesForm] = useState(false);
  const [openDeleteBulkHostnamesForm, setOpenDeleteBulkHostnamesForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [dataState, setDataState] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleAddBulkHostnamesSubmit = async (formData) => {
    setLoading(true);
    const formDataToSend = {
      hostnames: formData.hostnames,
      selectedRowData: Array.from(formData.selectedRowData)
  };

  const response = await fetch(`${import.meta.env.VITE_WEBSITE_BACKEND_URL}/bulk-add-hostnames`, {
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

  const response = await fetch(`${import.meta.env.VITE_WEBSITE_BACKEND_URL}/bulk-delete-hostnames`, {
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

  const fetchDataWithQuery = async () => {
    setLoading(true);
    const categoryID = sessionStorage.getItem("categoryID");
    const vendorID = sessionStorage.getItem("vendorID"); 
    const response = await fetch(`${import.meta.env.VITE_WEBSITE_BACKEND_URL}/all-products-query?categoryID=${categoryID}&vendorID=${vendorID}`);

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
  }, []);

  useEffect(() => {
    console.log("Inside useEffect:", selectedRowData);
}, [selectedRowData]);

  useEffect(() => {
      setDataState(allProducts);

  }, [allProducts]);

  const columns = [
    { field: 'product_name', headerName: 'Product Name', width: 230,
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
    { field: 'all_hostnames', headerName: 'Affected Hostnames', width: 230,
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
    { field: 'category_name', headerName: 'Category', width: 230},
    { field: 'vendor_name', headerName: 'Vendor Managing', width: 230},
    { field: 'version_number', headerName: 'Current Version', width: 230},
    { field: 'target_version', headerName: 'Latest Release', width: 230},

  ];

  const customLocaleText = {
    // Override sorting labels
    columnMenuSortAsc: 'Sort by A-Z',
    columnMenuSortDesc: 'Sort by Z-A',
  };

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .MuiDataGrid-columnHeader': {
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      lineHeight: '1.5',
      overflow: 'visible',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      overflow: 'visible',
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      lineHeight: '1.5',
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
        Assets
      </Typography>

      <br />
      <br />

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      />

      <Grid container spacing={1} justifyContent="flex-end">
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
      </Grid>

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
      />
      </Box>
    </Container>
  );
}
