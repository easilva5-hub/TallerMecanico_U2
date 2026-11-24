
const { Router } = require("express");
const { createOrdenServicio, listOrdenesServicio, getOrdenServicio, updateEstadoOrdenServicio, deleteOrdenServicio } = require("../controllers/ordenServicioController");
const authenticateToken = require("../middlewares/auth");
const router = Router();

router.post("/", authenticateToken, createOrdenServicio);
router.get("/", authenticateToken, listOrdenesServicio);
router.get("/:id", authenticateToken, getOrdenServicio);
router.patch("/:id/estado", authenticateToken, updateEstadoOrdenServicio);
router.delete("/:id", authenticateToken, deleteOrdenServicio);

module.exports = router;
