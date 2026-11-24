
const { Router } = require("express");
const authRouter = require("./auth");
const adminRouter = require("./admin");
const reservations = require("./reservations");
const appointments = require("./appointments");
const specialities = require("./specialties");
const servicios = require("./servicios");
const ordenesServicio = require("./ordenesServicio");
const bitacoras = require("./bitacoras");

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/specialties", specialities);
router.use("/reservations", reservations);
router.use("/users", appointments);
router.use("/servicios", servicios);
router.use("/ordenes-servicio", ordenesServicio);
router.use("/bitacoras", bitacoras);

module.exports = router;
