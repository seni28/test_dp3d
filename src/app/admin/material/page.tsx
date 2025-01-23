"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Material } from "@/app/types/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
} from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslation } from 'react-i18next';

export default function viewMaterial() {
  const [isLoading, setIsLoading] = useState(true); 
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [choosenItem, setChoosenItem] = useState<GridRowId>(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);

  const { t } = useTranslation();
  const { data: session, status } = useSession({ required: true});
  const router = useRouter();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: t("name"),
      width: 130,
      sortable: true,
    },
    {
      field: "diameter",
      headerName: t("diameter"),
      width: 130, // Adjust the width as needed
      sortable: true,
    },
    {
      field: "cost",
      headerName: t("cost"),
      width: 130,
      sortable: true,
    },
    {
      field: "density",
      headerName: t("density"),
      width: 130,
      sortable: true,
    },
    {
      field: "color",
      headerName: t("color"),
      width: 130,
      sortable: true,
    },
    {
      field: "purchasePrice",
      headerName: t("purchasePrice"),
      width: 130,
      sortable: true,
    },
    {
      field: "purchaseQuantity",
      headerName: t("purchaseQuantity"),
      width: 130,
      sortable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handleClose = () => {
    setShowDeleteDialog(false);
  };

  const handleDelete = () => {
    axios
      .delete("/api/material/" + choosenItem)
      .then((response) => {
        if (response.status == 201) {
          setShowDeleteDialog(false);
          setShowDeleteSuccess(true);
          setMaterials(
            materials.filter((material: any) => material.id !== choosenItem),
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setChoosenItem(id);
    setShowDeleteDialog(true);
  };
  
  useEffect(() => {
    // Fetch data function
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/material");
        setMaterials(response.data.materials);
        setIsLoading(false); 
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); 
      }
    };

    fetchData(); 

  }, []);
  
  return (
    <div>
      <Button
        variant="contained"
        component="label"
        style={{ marginTop: "20px", marginLeft: "100px", marginBottom: "25px" }}
        onClick={() => {
          router.push("/admin/material/create");
        }}
      >
        {t("createMaterial")}
      </Button>
      <div
        style={{
          marginLeft: "15%",
          marginRight: "15% !important",
          height: 400,
          width: "70%",
        }}
      >
        {isLoading ? ( // Display loader while isLoading is true
          <CircularProgress style={{ margin: 'auto', marginLeft: '50%'}} />
        ) : (
          <DataGrid
            rows={materials}
            loading={isLoading}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        )}
        <Dialog open={showDeleteDialog}>
          <DialogTitle>
            Are you sure you want to delete this material ?
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
            Material successfully deleted
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
