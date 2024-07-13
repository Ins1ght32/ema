import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import { Dialog, TextField, DialogTitle, DialogContent, DialogActions } from '@mui/material';

export default function AddBulkHostnamesForm({ open, onClose, onSubmit, selectedRows }) {
    const [formData, setFormData] = useState({ hostnames: [], selectedRowData: selectedRows });

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            selectedRowData: selectedRows,
        }));
    }, [selectedRows]);

    console.log(formData.selectedRowData);
    console.log(formData.hostnames);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // Pass the form data to the onSubmit prop
        setFormData({ hostnames: [], selectedRowData: selectedRows }); // Reset form data after submission
        onClose(); // Close the dialog after submission
      };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Enter Hostnames to Add</DialogTitle>
            <DialogContent>
                Hostnames
                <TextField
                margin="dense"
                name="hostnames"
                label="Add Hostnames"
                type="text"
                fullWidth
                value={formData.product_name}
                onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Close</Button>
                <Button onClick={handleSubmit} color="primary">Add</Button>
            </DialogActions>
        </Dialog>
    )
}

AddBulkHostnamesForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    selectedRows: PropTypes.object.isRequired,
};