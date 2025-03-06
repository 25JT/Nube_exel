require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const SHEET_ID = process.env.SHEET_ID;
const API_KEY = process.env.API_KEY;

app.get("/inventario", async (req, res) => {
    try {
        const sheetName = "Hoja%201"; // Nombre de la hoja en Google Sheets
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}`;
        
        const response = await axios.get(url);
        if (!response.data.values) {
            return res.status(404).json({ error: "No se encontraron datos." });
        }

        const values = response.data.values;
        const headers = values[0].map(h => h.trim());

        const productos = values.slice(1).map(row => ({
            title: row[headers.indexOf("Producto")] || "Sin nombre",
            colores: row[headers.indexOf("colores")] || "N/A",
            paquetes: row[headers.indexOf("Paquetes")] || "N/A",
            price: `$${row[headers.indexOf("Precio")] || "N/A"}`,
            imgSrc: row[headers.indexOf("Url")] || "",
        }));

        res.json(productos);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error al obtener datos" });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
