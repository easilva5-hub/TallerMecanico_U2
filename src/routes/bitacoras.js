
const { Router } = require("express");
const { createBitacora, listBitacoras, resumenBitacoras, deleteBitacora } = require("../controllers/bitacoraController");
const authenticateToken = require("../middlewares/auth");
const router = Router();

router.post("/", authenticateToken, createBitacora);
router.get("/", authenticateToken, listBitacoras);
router.get("/resumen", authenticateToken, resumenBitacoras);
router.delete("/:id", authenticateToken, deleteBitacora);

module.exports = router;
