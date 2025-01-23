"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Snackbar,
  Alert,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
} from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Printer } from "@/app/types/printer";
import { useRouter } from "next/navigation";
import { t } from "i18next";
export default function CreateMaterialForm(props: { id: number }) {
  const [formData, setFormData] = useState({
    name: "",
    diameter: "",
    cost: 0,
    color: "",
    purchasePrice: "",
    purchaseQuantity: "",
    printers: [],
  });

  const { data: session, status } = useSession({
    required: true,
  });

  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      // If you want to do something specific when status is "loading", you can put your code here.
      // If not, you can remove this conditional block.
    }

    // Return a cleanup function if needed.
    return () => {
      // This code will run when the component unmounts or when the dependency array changes.
      // You can clean up any resources or subscriptions here.
    };
  }, [status]); // Include any dependencies in the dependency array
  const [openSuccessMsg, setOpenSuccessMsg] = React.useState(false);
  const [openErrorMsg, setOpenErrorMsg] = React.useState(false);
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
  }, []);

  const handleSubmit = () => {
    // Send formData to your API for creating a Material entity
    // Example: You can use fetch or an API library to make a POST request to your server.
    const material = {
      name: formData.name,
      diameter: formData.diameter,
      cost: Number(formData.purchasePrice) / Number(formData.purchaseQuantity),
      color: formData.color,
      purchasePrice: formData.purchasePrice,
      purchaseQuantity: formData.purchaseQuantity,
      printers: formData.printers,
    };
    material.cost.toFixed(2);
    axios
      .post("/api/material", material)
      .then((response) => {
        setFormData({
          name: "",
          diameter: "",
          cost: 0,
          color: "",
          purchasePrice: "",
          purchaseQuantity: "",
          printers: [],
        });
        setOpenSuccessMsg(true);
      })
      .catch(() => {
        setOpenErrorMsg(true);
      });
  };

  const handleOnClick = () => {
    router.push("/admin/material");
  };

  return (
    <form>
      <Button
        variant="contained"
        component="label"
        style={{ marginTop: "20px", marginLeft: "100px" }}
        onClick={() => {
          router.push("/admin/material");
        }}
      >
        {t("viewMaterials")}
      </Button>
      <div className="text-center text-xl">
        <label>{t("materialInformation")}</label>
      </div>

      <div
        className="grid grid-cols-2 gap-4"
        style={{ marginLeft: 100, marginTop: 25 }}
      >
        <div className="row-start-1 col-start-1">
          <TextField
            name="name"
            label={t("name")}
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
            label={t("diameter")}
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
            name="purchasePrice"
            label={t("purchasePriceEuros")}
            variant="outlined"
            fullWidth
            type="number"
            required
            value={formData.purchasePrice}
            onChange={handleChange}
          />
        </div>
        <div className="row-start-2 col-start-2">
          <TextField
            name="purchaseQuantity"
            label={t("purchaseQuantityGramme")}
            variant="outlined"
            fullWidth
            type="number"
            required
            value={formData.purchaseQuantity}
            onChange={handleChange}
          />
        </div>
        <div className="row-start-3 col-start-1">
          <TextField
            name="color"
            label={t("color")}
            variant="outlined"
            fullWidth
            required
            value={formData.color}
            onChange={handleChange}
          />
        </div>
        <div className="row-start-3 col-start-2">
          <FormControl fullWidth>
            <InputLabel id="demo-multiple-chip-label">
              {" "}
              {t("printerS")}
            </InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              fullWidth
              multiple
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
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
            formData.color &&
            formData.purchasePrice &&
            formData.purchaseQuantity
          )
        }
        className="row-start-6 col-start-4 col-end-4"
        component="label"
        color="success"
        variant="contained"
        onClick={handleSubmit}
        style={{ marginTop: 20, marginLeft: 100 }}
      >
        {t("createMaterial")}
      </Button>
      <Snackbar open={openSuccessMsg} autoHideDuration={1000}>
        <Alert severity="success" sx={{ width: "100%" }}>
          {t("materialSuccessfullyCreated")}
        </Alert>
      </Snackbar>
      <Snackbar open={openErrorMsg} autoHideDuration={1000}>
        <Alert severity="error" sx={{ width: "100%" }}>
          {t("errorWhileCreating")}
        </Alert>
      </Snackbar>
    </form>
  );
}
