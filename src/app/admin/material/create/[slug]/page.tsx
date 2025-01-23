"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Snackbar,
  Alert,
  TextField,
  Link,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { Printer } from "@/app/types/printer";

export default function EditMaterialForm(props: any) {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    diameter: "",
    cost: "",
    color: "",
    purchasePrice: "",
    purchaseQuantity: "",
    volumePrice: "",
    printers: [],
  });

  const [openSuccessMsg, setOpenSuccessMsg] = useState(false);
  const [openErrorMsg, setOpenErrorMsg] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (event: any) => {
    const { name, value, type } = event.target;

    if (type === "number") {
      // If the input field has a number type, parse the value as a number
      setFormData({
        ...formData,
        [name]: Number(value),
      });
    } else if (name === "printers") {
      // Handle the printers selection separately
      const selectedPrinters = Array.isArray(value) ? value : [value];
      setFormData({
        ...formData,
        [name]: selectedPrinters,
      });
    } else {
      // For other fields, set the value directly
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const [printers, setPrinters] = useState<Printer[]>([]);
  useEffect(() => {
    axios.get("/api/printer").then((res) => {
      setPrinters(res.data.printers);
    });

    if (props.params != null) {
      axios
        .get("/api/material/" + props.params.slug)
        .then((response) => {
          const material = response.data.data.material;
          material.printers = material.printers.map(
            (printer: Printer) => printer.id,
          );
          setFormData(material);
          setIsLoading(false);
          // map printers with their ids
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    }
  }, []); // The empty dependency array [] ensures this runs only once on component mount

  const handleSubmit = () => {
    // Send formData to your API for creating a Material entity
    // Example: You can use fetch or an API library to make a POST request to your server.
    const material = {
      id: formData.id,
      name: formData.name,
      diameter: formData.diameter,
      cost: formData.cost,
      color: formData.color,
      purchasePrice: formData.purchasePrice,
      purchaseQuantity: formData.purchaseQuantity,
      volumePrice: formData.volumePrice,
      printers: formData.printers,
    };
    axios
      .put("admin/material/" + material.id, material)
      .then(() => {
        setOpenSuccessMsg(true);
      })
      .catch(() => {
        setOpenErrorMsg(true);
      });
  };

  return (
    <form>
      {isLoading ? ( // Render a loader while loading is true
        <div className="text-center" style={{ marginTop: 30 }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Button>
            <Link href="/admin/material"> View Materials </Link>
          </Button>
          <div className="text-center text-xl" style={{ marginTop: 30 }}>
            <label> Editing {formData.name}</label>
          </div>
          <div
            className="grid grid-cols-2 gap-4"
            style={{ marginLeft: 100, marginTop: 25 }}
          >
            <div className="row-start-1 col-start-1">
              <TextField
                name="name"
                label="Name"
                variant="outlined"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="row-start-1 col-start-2">
              <TextField
                name="diameter"
                label="Diameter"
                variant="outlined"
                fullWidth
                type="number"
                required
                value={formData.diameter}
                onChange={handleChange}
              />
            </div>
            <div className="row-start-2 col-start-1">
              <TextField
                name="cost"
                label="Cost (€)"
                variant="outlined"
                fullWidth
                type="number"
                required
                value={formData.cost}
                onChange={handleChange}
              />
            </div>
            <div className="row-start-2 col-start-2">
              <TextField
                name="color"
                label="Color"
                variant="outlined"
                fullWidth
                required
                value={formData.color}
                onChange={handleChange}
              />
            </div>
            <div className="row-start-3 col-start-1">
              <TextField
                name="purchasePrice"
                label="Purchase Price (€)"
                variant="outlined"
                fullWidth
                type="number"
                required
                value={formData.purchasePrice}
                onChange={handleChange}
              />
            </div>
            <div className="row-start-3 col-start-2">
              <TextField
                name="purchaseQuantity"
                label="Purchase Quantity"
                variant="outlined"
                fullWidth
                type="number"
                required
                value={formData.purchaseQuantity}
                onChange={handleChange}
              />
            </div>
            <div className="row-start-4 col-start-1">
              <TextField
                name="volumePrice"
                label="Volume Price (€)"
                variant="outlined"
                fullWidth
                type="number"
                required
                value={formData.volumePrice}
                onChange={handleChange}
              />
            </div>
            <div className="row-start-4 col-start-2">
              <FormControl fullWidth>
                <InputLabel id="demo-multiple-chip-label">
                  {" "}
                  Printer(s)
                </InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  fullWidth
                  multiple
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Chip" />
                  }
                  name="printers"
                  value={formData.printers || []}
                  onChange={handleChange}
                >
                  {printers?.map((printer: Printer) => {
                    return (
                      <MenuItem key={printer.id} value={printer.id}>
                        {printer.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          </div>
          <Button
            disabled={
              !(
                formData.name &&
                formData.diameter &&
                formData.cost &&
                formData.color &&
                formData.purchasePrice &&
                formData.purchaseQuantity &&
                formData.volumePrice
              )
            }
            className="row-start-6 col-start-4 col-end-4"
            component="label"
            color="success"
            variant="contained"
            onClick={handleSubmit}
            style={{ marginTop: 20, marginLeft: 100 }}
          >
            Update Material
          </Button>
          <Snackbar open={openSuccessMsg} autoHideDuration={1000}>
            <Alert severity="success" sx={{ width: "100%" }}>
              Material successfully updated
            </Alert>
          </Snackbar>
          <Snackbar open={openErrorMsg} autoHideDuration={1000}>
            <Alert severity="error" sx={{ width: "100%" }}>
              Error while updating
            </Alert>
          </Snackbar>
        </>
      )}
    </form>
  );
}
