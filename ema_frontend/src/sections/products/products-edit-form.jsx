import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import { Dialog, TextField, DialogTitle, DialogContent, DialogActions, Checkbox } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import dayjs, { Dayjs } from 'dayjs';

import myProducts from './eol_products.json'
import vendorNames from './vendor_names.json'
import categoryNames from './category_names.json'

export default function EditForm({ open, onClose, onSubmit, defaultData }) {

    const [formData, setFormData] = useState({ products_id: '', product_name: '', version_number: '', link: '', category: '', vendor: '', target_version: '', eos_date: '', contains_primary_source: '', do_not_crawl: 'no', remarks: '', hostnames: [] });
    // const [formData, setFormData] = useState({ products_id : defaultData.products_id, product_name: defaultData.product_name, version_number: defaultData.version_number, link: defaultData.url, category: defaultData.category_name, vendor: defaultData.vendor_name, target_version: defaultData.target_version, hostnames: defaultData.hostnames});

    // const [checkboxValue, setCheckboxValue] = useState(formData.do_not_crawl === "no");
    const [checkboxValue, setCheckboxValue] = useState();
    useEffect(() => {
        if (defaultData) {
            // console.log("hostname: ", defaultData.all_hostnames);

          setFormData({
            products_id: defaultData.products_id,
            product_name: defaultData.product_name,
            version_number: defaultData.version_number,
            link: defaultData.url,
            category: defaultData.category_name,
            vendor: defaultData.vendor_name,
            target_version: defaultData.target_version,
            hostnames: defaultData.all_hostnames,
            eos_date: defaultData.eos_date,
            contains_primary_source: defaultData.contains_primary_source,
            remarks: defaultData.remarks,
            do_not_crawl: defaultData.do_not_crawl
          });
        }

        if (defaultData.do_not_crawl === "no" || defaultData.do_not_crawl == null) {
            setCheckboxValue(false);
        }
        else {
            setCheckboxValue(true);
        }

        if (defaultData.eos_date === "No URL Provided" || new Date(defaultData.eos_date).getTime() === new Date("9998-12-31 00:00:00").getTime()) {
            setFormData({
                products_id: defaultData.products_id,
                product_name: defaultData.product_name,
                version_number: defaultData.version_number,
                link: defaultData.url,
                category: defaultData.category_name,
                vendor: defaultData.vendor_name,
                target_version: defaultData.target_version,
                hostnames: defaultData.all_hostnames,
                eos_date: new Date('1969-12-31T16:30:00.000Z'),
                contains_primary_source: defaultData.contains_primary_source,
                remarks: defaultData.remarks,
                do_not_crawl: defaultData.do_not_crawl
              });
        }

        console.log(defaultData);
      }, [defaultData]);
    
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

    const handleDateChange = (date) => {
        setFormData({ ...formData, eos_date: date, contains_primary_source: "5" });
    };

    const handleAutocompleteChange = (event, value) => {
        setFormData((prevData) => ({
          ...prevData,
          product_name: value, // Assuming value is the selected product name
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

    const handleCheckboxChange = (event) => {
        const newValue = event.target.checked ? "yes" : "no";
        console.log(`New value: ${newValue}`)
        setCheckboxValue(event.target.checked);
        setFormData((prevData) => ({
          ...prevData,
          do_not_crawl: newValue,
        }));

        console.log(formData);
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        const editedFormData = { ...formData, products_id: defaultData.products_id };
        console.log(editedFormData)
        onSubmit(editedFormData); // Pass the form data to the onSubmit prop
        setFormData({ products_id: defaultData.products_id, product_name: '', version_number: '', link: '', category: '', vendor: '', target_version: '', eos_date: '', contains_primary_source: '', do_not_crawl: 'no', remarks: '', hostnames: [] }); // Reset form data after submission
        onClose(); // Close the dialog after submission
      };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>EDIT {defaultData.product_name}</DialogTitle>
            <DialogContent>
                <p>{defaultData.products_id}</p>
                <p>{defaultData.product_name}</p>
                Product Name
                <Autocomplete
                freeSolo
                options={myProducts.map((option) => option.name)}
                defaultValue={defaultData.product_name}
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
                freeSolo
                options={categoryNames.map((option) => option.category_name)}
                defaultValue={defaultData.category_name}
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
                defaultValue={defaultData.vendor_name}
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
                End of Life Date
                <LocalizationProvider dateAdapter={AdapterDateFns}><br />
                <DatePicker
                    margin="dense"
                    name="eos_date"
                    label="End of Life Date"
                    value={formData.eos_date ? new Date(formData.eos_date) : null}
                    // value={formData.eos_date}
                    // defaultValue={new Date(formData.eos_date)}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                />
                </LocalizationProvider><br />
                Do not Crawl Automatically
                <Checkbox
                    checked={checkboxValue}
                    onChange={handleCheckboxChange}
                />
                <br />
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
                <br />
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
                <Button onClick={handleSubmit} color="primary">Edit</Button>
            </DialogActions>
        </Dialog>
    )
}

EditForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    defaultData: PropTypes.object.isRequired,
};