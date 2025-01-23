"use client";
import React, { useState, useEffect } from "react";

import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";
import {
  DataGrid,
  GridColDef,
  GridRowId,
} from "@mui/x-data-grid";

import {
  Button,
  Dialog,
  Tooltip,
  DialogActions,
  DialogTitle,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Printer } from "@/app/types/printer";
import { useTranslation } from 'react-i18next';
export default function ViewPrinter() {
  const {t}= useTranslation()
  const { data: session, status } = useSession({
    required: true,
  });

  const [humanCost, setHumanCost] = useState(0);
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
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: t("name"),
      width: 250,
      sortable: true,
    },
    {
      field: "hourlyRate",
      headerName: t("hourlyRate"),
      width: 250,
      sortable: true,
    },
    {
      field: "energyCost",
      headerName: t("energyCost"),
      width: 250,
      sortable: true,
    },
    {
      field: "cleaningTotal",
      headerName: t("cleaningCost"),
      width: 250,
      sortable: false,
      renderCell: (params) => (
        <Tooltip
          title={`${t("energyCostCleaning")} ${
            params.row.energyCostCleaning || 0
          }, ${t("waterCostCleaning")} ${
            params.row.waterCostCleaning || 0
          }, ${t("energyCostSodaBath")} ${params.row.energyCostSodaBath || 0}`}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {(
              params.row.energyCostCleaning +
              params.row.energyCostSodaBath +
              params.row.waterCostCleaning
            ).toFixed(2)}
            <InfoIcon style={{ marginLeft: 5, cursor: "pointer" }} />
          </div>
        </Tooltip>
      ),
    },
  ];

  const handleEdit = (id: GridRowId) => () => {
    printers.map((printer: Printer) => {
      if (printer.id === id) {
        router.push(`/admin/printer/create/${id}`);
        return;
      }
    });
  };

  const router = useRouter();
  const handleClose = () => {
    setShowDeleteDialog(false);
  };

  const handleDelete = () => {
    axios
      .delete("/api/printer/" + chosenItem)
      .then((response) => {
        if (response.status === 201) {
          setShowDeleteDialog(false);
          setShowDeleteSuccess(true);
          setPrinters(
            printers.filter((printer: Printer) => printer.id !== chosenItem),
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setChosenItem(id);
    setShowDeleteDialog(true);
  };

  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [chosenItem, setChosenItem] = useState<GridRowId>(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [printers, setPrinters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/printer")
      .then((response) => {
        setPrinters(response.data.printers);
        for (const printer of response.data.printers) {
          if (
            printer.humanCostCleaning != null &&
            printer.humanCostCleaning != 0
          ) {
            setHumanCost(printer.humanCostCleaning);
            break;
          }
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <div
        style={{
          marginTop: "5% ",
          marginLeft: "15%",
          marginRight: "15% ",
          marginBottom: "5% ",
          height: "50%",
          width: "70%",
        }}
      >
        <DataGrid
          rows={printers}
          loading={isLoading}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
        <Dialog open={showDeleteDialog}>
          <DialogTitle>
            Are you sure you want to delete this printer?
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button color="success" onClick={handleDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={showDeleteSuccess} autoHideDuration={3000}>
          <Alert severity="success" sx={{ width: "100%" }}>
            Printer successfully deleted
          </Alert>
        </Snackbar>

        {<TextField
          style={{ marginTop: "5% ", marginLeft: "40% " }}
          label="Human Cost (€/H)"
          value={humanCost}
          InputProps={{
            readOnly: true,
          }}
        />}
      </div>
    </div>
  );
}
