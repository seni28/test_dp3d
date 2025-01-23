"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Snackbar,
  Alert,
  TextField,
  Link,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Material } from "@/app/types/material";

export default function CreatePrinterForm() {
  const [formData, setFormData] = useState({
    name: "",
    hourlyRate: "",
    energyCost: "",
    energyCostCleaning: null,
    waterCostCleaning: null,
    energyCostSodaBath: null,
    materials: [],
  });

  const [openSuccessMsg, setOpenSuccessMsg] = React.useState(false);
  const [openErrorMsg, setOpenErrorMsg] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [materials, setMaterials] = useState<Material[]>([]);
  const { data: session, status } = useSession({
    required: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/material");
        setMaterials(response.data.materials);
        setIsLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching material data:", error);
        setIsLoading(false); // Set loading to false on error as well
      }
    };

    fetchData(); // Call the fetchData function
  }, []);

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

  const handleSubmit = () => {
    const printer = {
      name: formData.name,
      hourlyRate: formData.hourlyRate,
      energyCost: formData.energyCost,
      energyCostCleaning: formData.energyCostCleaning,
      waterCostCleaning: formData.waterCostCleaning,
      energyCostSodaBath: formData.energyCostSodaBath,
      materials: formData.materials,
    };
    axios
      .post("admin/printer", printer)
      .then((response) => {
        setFormData({
          name: "",
          hourlyRate: "",
          energyCost: "",
          energyCostCleaning: null,
          waterCostCleaning: null,
          energyCostSodaBath: null,
          materials: [],
        });

        setOpenSuccessMsg(true);
      })
      .catch(() => {
        setOpenErrorMsg(true);
      });
  };

  return (
    <form>
      {isLoading ? ( // Display loader while isLoading is true
        <CircularProgress style={{ margin: "auto" }} />
      ) : (
        <React.Fragment>
          <Button>
            <Link href="/admin/printer"> View Printers </Link>
          </Button>
          <div className="text-center text-xl" style={{ marginTop: 30 }}>
            <label>Printer Information</label>
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
                  {materials?.map((material: Material) => {
                    return (
                      <MenuItem key={material.id} value={material.id}>
                        {material.name}
                      </MenuItem>
                    );
                  })}
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
            Create Printer
          </Button>
          <Snackbar open={openSuccessMsg} autoHideDuration={1000}>
            <Alert severity="success" sx={{ width: "100%" }}>
              Printer successfully created
            </Alert>
          </Snackbar>
          <Snackbar open={openErrorMsg} autoHideDuration={1000}>
            <Alert severity="error" sx={{ width: "100%" }}>
              Error while creating
            </Alert>
          </Snackbar>
        </React.Fragment>
      )}
    </form>
  );
}
