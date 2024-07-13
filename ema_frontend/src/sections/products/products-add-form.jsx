import { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import { Dialog, TextField, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

import myProducts from './eol_products.json'
import vendorNames from './vendor_names.json'
import categoryNames from './category_names.json'


export default function AddForm({ open, onClose, onSubmit }) {
    const [formData, setFormData] = useState({ product_name: '', version_number: '', link: '', category: '', vendor: '', target_version: '', remarks: '', hostnames: [] });
    const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);

    const handleOpenWarningDialog = () => {
        setIsWarningDialogOpen(true);
    };
    
      const handleCloseWarningDialog = () => {
        setIsWarningDialogOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value;

        if (name === 'hostnames') {
            updatedValue = value.split(',').map(item => item.trim());
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: updatedValue,
        }));
    };

    const handleAutocompleteChange = (event, value) => {
        setFormData((prevData) => ({
          ...prevData,
          product_name: value, // value is the selected product name
        }));
      };
    
    const handleAutocompleteCategoryChange = (event, value) => {
        setFormData((prevData) => ({
            ...prevData,
            category: value
        }));
    };

    const handleAutocompleteVendorChange = (event, value) => {
        setFormData((prevData) => ({
            ...prevData,
            vendor: value
        }));
    };

    const handleInitialSubmit = (e) => {
        e.preventDefault();
        handleOpenWarningDialog();
    }


    const handleSubmit = () => {
        // e.preventDefault();
        onSubmit(formData); // Pass the form data to the onSubmit prop
        setFormData({ product_name: '', version_number: '', link: '', category: '', vendor: '', target_version: '', remarks: '', hostnames: [] }); // Reset form data after submission
        handleCloseWarningDialog();
        onClose(); // Close the dialog after submission
      };

    return (
        <div>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Enter your Product Information</DialogTitle>
                <DialogContent>
                    Product Name
                    <Autocomplete
                    freeSolo
                    options={myProducts.map((option) => option.name)}
                    renderInput={(params) => <TextField {...params} name="product_name" label="Product Name" value={formData.product_name} onChange={handleChange} />}
                    name="product_name"
                    label="Product Name"
                    onChange={handleAutocompleteChange}
                    />
                    Version Number
                    <TextField
                    margin="dense"
                    name="version_number"
                    label="Version Number"
                    type="text"
                    fullWidth
                    value={formData.version_number}
                    onChange={handleChange}
                    />
                    URL
                    <TextField
                    margin="dense"
                    name="link"
                    label="URL"
                    type="url"
                    fullWidth
                    value={formData.link}
                    onChange={handleChange}
                    />
                    Category
                    <Autocomplete
                    options={categoryNames.map((option) => option.category_name)}
                    renderOption={(props, option) => (
                        <li {...props} style={{ backgroundColor: '#D3D3D3', color: 'black'}}>
                            {option}
                        </li>
                    )}
                    renderInput={(params) => <TextField {...params} name="category" label="Category Name" value={formData.category} onChange={handleChange} />}
                    name="category"
                    label="Category Name"
                    onChange={handleAutocompleteCategoryChange}
                    />
                    Vendor
                    <Autocomplete
                    options={vendorNames.map((option) => option.vendor_name)}
                    renderOption={(props, option) => (
                        <li {...props} style={{ backgroundColor: '#D3D3D3', color: 'black'}}>
                            {option}
                        </li>
                    )}
                    renderInput={(params) => <TextField {...params} name="vendor" label="Vendor Name" value={formData.vendor} onChange={handleChange} />}
                    name="vendor"
                    label="Vendor Name"
                    onChange={handleAutocompleteVendorChange}
                    />
                    Target Version
                    <TextField
                    margin="dense"
                    name="target_version"
                    label="Target Version"
                    type="text"
                    fullWidth
                    value={formData.target_version}
                    onChange={handleChange}
                    />                    
                    Remarks
                    <TextField
                    margin="dense"
                    name="remarks"
                    label="Remarks"
                    type="text"
                    fullWidth
                    value={formData.remarks}
                    onChange={handleChange}
                    />
                    Affected Hostname
                    <TextField
                    margin="dense"
                    name="hostnames"
                    label="Affected Hostnames"
                    type="text"
                    fullWidth
                    value={formData.hostnames}
                    onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">Close</Button>
                    <Button onClick={handleInitialSubmit} color="primary">Add</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isWarningDialogOpen} onClose={handleCloseWarningDialog}>
                <DialogTitle>Confirm Submission</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Make sure that the version number follows the website accurately!
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseWarningDialog} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Confirm
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

AddForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};