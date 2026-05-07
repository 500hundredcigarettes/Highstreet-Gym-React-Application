import express from "express";
import path from "path";
import cors from "cors";
import { AuthenticationController } from "./controllers/AuthenticateController.mjs";
import { SessionController } from "./controllers/SessionController.mjs";
import { PostController } from "./controllers/PostController.mjs";
import { BookingController } from "./controllers/BookingController.mjs";
import { AdminController } from "./controllers/AdminController.mjs";
import { APIController } from "./controllers/api/APIController.mjs";
import { ProfileController } from "./controllers/ProfileController.mjs";

const app = express();
const port = 3000;

app.use(cors({
origin: true
}));

app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(AuthenticationController.middleware);


app.use("/admin", AdminController.routes)
app.use("/bookings", BookingController.routes)
app.use("/authenticate", AuthenticationController.routes)
app.use("/profile", ProfileController.routes)
app.use("/sessions", SessionController.routes)
app.use("/posts", PostController.routes)
app.use("/api", APIController.routes)


app.get("/", (req, res) => {
  res.status(301).redirect("/authenticate");
});

app.use(express.static(path.join(import.meta.dirname, "public")));

app.listen(port, () => {
  console.log("Backend started on http://localhost:" + port);
});