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
import { Material } from "@/app/types/material";

export default function EditPrinterForm(props: any) {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    hourlyRate: "",
    energyCost: "",
    energyCostCleaning: "",
    waterCostCleaning: "",
    energyCostSodaBath: "",
    materials: [],
  });

  const [openSuccessMsg, setOpenSuccessMsg] = useState(false);
  const [openErrorMsg, setOpenErrorMsg] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (event: any) => {
    const { name, value, type } = event.target;

    if (type === "number") {
      setFormData({
        ...formData,
        [name]: Number(value),
      });
    } else if (name === "materials") {
      const selectedMaterials = Array.isArray(value) ? value : [value];
      setFormData({
        ...formData,
        [name]: selectedMaterials,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const [materials, setMaterials] = useState<Material[]>([]);
  useEffect(() => {
    axios.get("/api/material").then((res) => {
      setMaterials(res.data.materials);
    });

    if (props.params !== null) {
      axios
        .get("/api/printer/" + props.params.slug)
        .then((response) => {
          const printer = response.data.data.printer;
          printer.materials = printer.materials.map(
            (material: Material) => material.id,
          );
          setFormData(printer);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    }
  }, []);

  const handleSubmit = () => {
    const printer = {
      id: formData.id,
      name: formData.name,
      hourlyRate: formData.hourlyRate,
      energyCost: formData.energyCost,
      energyCostCleaning: formData.energyCostCleaning,
      waterCostCleaning: formData.waterCostCleaning,
      energyCostSodaBath: formData.energyCostSodaBath,
      materials: formData.materials,
    };

    axios
      .put("admin/printer/" + printer.id, printer)
      .then(() => {
        setOpenSuccessMsg(true);
      })
      .catch(() => {
        setOpenErrorMsg(true);
      });
  };

  return (
    <form>
      {isLoading ? (
        <div className="text-center" style={{ marginTop: 30 }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Button>
            <Link href="/admin/printer"> View Printers </Link>
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
                name="hourlyRate"
                label="Hourly Rate"
                variant="outlined"
                fullWidth
                type="number"
                required
                value={formData.hourlyRate}
                onChange={handleChange}
              />
            </div>
            <div className="row-start-2 col-start-1">
              <TextField
                name="energyCost"
                label="Energy Cost"
                variant="outlined"
                fullWidth
                type="number"
                required
                value={formData.energyCost}
                onChange={handleChange}
              />
            </div>
            <div className="row-start-2 col-start-2">
              <TextField
                name="energyCostCleaning"
                label="Energy Cost for Cleaning"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.energyCostCleaning}
                onChange={handleChange}
              />
            </div>
            <div className="row-start-3 col-start-1">
              <TextField
                name="waterCostCleaning"
                label="Water Cost for Cleaning"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.waterCostCleaning}
                onChange={handleChange}
              />
            </div>
            <div className="row-start-3 col-start-2">
              <TextField
                name="energyCostSodaBath"
                label="Energy Cost for Soda Bath"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.energyCostSodaBath}
                onChange={handleChange}
              />
            </div>
            <div className="row-start-4 col-start-1">
              <FormControl fullWidth>
                <InputLabel id="material-select-label">Materials</InputLabel>
                <Select
                  labelId="material-select-label"
                  id="material-select"
                  fullWidth
                  multiple
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Chip" />
                  }
                  name="materials"
                  value={formData.materials || []}
                  onChange={handleChange}
                >
                  {materials.map((material: Material) => (
                    <MenuItem key={material.id} value={material.id}>
                      {material.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <Button
            disabled={
              !(formData.name && formData.hourlyRate && formData.energyCost)
            }
            className="row-start-6 col-start-4 col-end-4"
            component="label"
            color="success"
            variant="contained"
            onClick={handleSubmit}
            style={{ marginTop: 20, marginLeft: 100 }}
          >
            Update Printer
          </Button>
          <Snackbar open={openSuccessMsg} autoHideDuration={1000}>
            <Alert severity="success" sx={{ width: "100%" }}>
              Printer successfully updated
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
