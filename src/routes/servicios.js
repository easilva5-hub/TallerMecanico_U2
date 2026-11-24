
const { Router } = require("express");
const { createServicio, listServicios, getServicio, updateServicio, deleteServicio } = require("../controllers/servicioController");
const authenticateToken = require("../middlewares/auth");
const router = Router();

router.post("/", authenticateToken, createServicio);
router.get("/", listServicios);
router.get("/:id", getServicio);
router.put("/:id", authenticateToken, updateServicio);
router.delete("/:id", authenticateToken, deleteServicio);

module.exports = router;
