import React, { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Modal,
  Stack,
  Button,
  MenuItem,
  Container,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import Iconify from 'src/components/iconify';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openUpdateUser, setOpenUpdateUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', password: '', category_id: '', vendor_id: '' });
  const navigate = useNavigate();

  const vendorMapping = useMemo(
    () => ({
      1: 'NCS',
      2: 'NEC',
      3: 'PCCW',
      4: 'All',
    }),
    []
  );

  const categoryMapping = useMemo(
    () => ({
      1: 'Network',
      2: 'Server',
      3: 'Applications',
      4: 'All',
    }),
    []
  );

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_WEBSITE_BACKEND_URL}/users`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (response.status === 403) {
          navigate('/login');
        }
        return response.json();
      })
      .then((data) => {
        const mappedData = data.map((user) => ({
          ...user,
          category_id: categoryMapping[user.category_id],
          vendor_id: vendorMapping[user.vendor_id],
        }));
        setUsers(mappedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, [navigate, categoryMapping, vendorMapping]);

  const handleAddUserOpen = () => setOpenAddUser(true);
  const handleAddUserClose = () => setOpenAddUser(false);

  const handleAddUserSubmit = () => {
    fetch(`${import.meta.env.VITE_WEBSITE_BACKEND_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setUsers([...users, { ...newUser, id: data.id }]);
        handleAddUserClose();
      })
      .catch((error) => console.error('Error adding user:', error));
  };

  const handleUpdateUserOpen = (user) => {
    setSelectedUser({
      ...user,
      category_id: getCategoryKey(user.category_id),
      vendor_id: getVendorKey(user.vendor_id),
    });
    setOpenUpdateUser(true);
  };

  const handleUpdateUserClose = () => {
    setSelectedUser(null);
    setOpenUpdateUser(false);
  };

  const handleUpdateUserSubmit = () => {
    fetch(`${import.meta.env.VITE_WEBSITE_BACKEND_URL}/users/${selectedUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedUser),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setUsers(users.map((user) => (user.id === selectedUser.id ? selectedUser : user)));
        handleUpdateUserClose();
      })
      .catch((error) => console.error('Error updating user:', error));
  };

  const handleDeleteUser = (id) => {
    fetch(`${import.meta.env.VITE_WEBSITE_BACKEND_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((error) => console.error('Error deleting user:', error));
  };

  const getCategoryKey = (value) => Object.keys(categoryMapping).find((key) => categoryMapping[key] === value);

  const getVendorKey = (value) => Object.keys(vendorMapping).find((key) => vendorMapping[key] === value);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'category_id', headerName: 'Category', width: 150 },
    { field: 'vendor_id', headerName: 'Vendor', width: 150 },
    { field: 'role', headerName: 'Role', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleUpdateUserOpen(params.row)}>
            <Iconify icon="eva:edit-outline" />
          </IconButton>
          <IconButton onClick={() => handleDeleteUser(params.row.id)}>
            <Iconify icon="eva:trash-2-outline" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Management - EMA EOS Dashboard</title>
      </Helmet>
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
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Admin Management
        </Typography>
        <Stack direction="row" alignItems="center" flexWrap="wrap-reverse" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Grid container spacing={1} justifyContent="flex-end">
            <Grid item>
              <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleAddUserOpen}>
                Add User
              </Button>
            </Grid>
          </Grid>
        </Stack>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid rows={users} columns={columns} pageSize={5} checkboxSelection />
        </Box>
      </Container>
      <Modal open={openAddUser} onClose={handleAddUserClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2">
            Add User
          </Typography>
          <TextField label="Username" fullWidth margin="normal" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
          <TextField
            select
            label="Category"
            fullWidth
            margin="normal"
            value={newUser.category_id}
            onChange={(e) => setNewUser({ ...newUser, category_id: e.target.value })}
          >
            <MenuItem value={1}>Network</MenuItem>
            <MenuItem value={2}>Server</MenuItem>
            <MenuItem value={3}>Applications</MenuItem>
            <MenuItem value={4}>All</MenuItem>
          </TextField>
          <TextField
            select
            label="Vendor"
            fullWidth
            margin="normal"
            value={newUser.vendor_id}
            onChange={(e) => setNewUser({ ...newUser, vendor_id: e.target.value })}
          >
            <MenuItem value={1}>NCS</MenuItem>
            <MenuItem value={2}>NEC</MenuItem>
            <MenuItem value={3}>PCCW</MenuItem>
            <MenuItem value={4}>All</MenuItem>
          </TextField>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="contained" onClick={handleAddUserSubmit} sx={{ mx: 1 }}>
              Add
            </Button>
            <Button variant="outlined" onClick={handleAddUserClose} sx={{ mx: 1 }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={openUpdateUser} onClose={handleUpdateUserClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2">
            Update User
          </Typography>
          <TextField label="Username" fullWidth margin="normal" value={selectedUser?.username || ''} onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={selectedUser?.password || ''} onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })} />
          <TextField
            select
            label="Category"
            fullWidth
            margin="normal"
            value={selectedUser?.category_id || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, category_id: e.target.value })}
          >
            <MenuItem value={1}>Network</MenuItem>
            <MenuItem value={2}>Server</MenuItem>
            <MenuItem value={3}>Applications</MenuItem>
            <MenuItem value={4}>All</MenuItem>
          </TextField>
          <TextField
            select
            label="Vendor"
            fullWidth
            margin="normal"
            value={selectedUser?.vendor_id || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, vendor_id: e.target.value })}
          >
            <MenuItem value={1}>NCS</MenuItem>
            <MenuItem value={2}>NEC</MenuItem>
            <MenuItem value={3}>PCCW</MenuItem>
            <MenuItem value={4}>All</MenuItem>
          </TextField>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="contained" onClick={handleUpdateUserSubmit} sx={{ mx: 1 }}>
              Update
            </Button>
            <Button variant="outlined" onClick={handleUpdateUserClose} sx={{ mx: 1 }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
