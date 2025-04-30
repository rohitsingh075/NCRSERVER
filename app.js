import express from 'express'
import path from 'path'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import userRouter from "./routes/user.router.js"
import eventRoutes from "./routes/event.route.js"
import noticeRoutes from "./routes/notice.route.js"
import studentRoutes from "./routes/student.route.js"
import galleryRoutes from "./routes/gallery.route.js"
import { fileURLToPath } from 'url'
import verifyUser from "./routes/verify.route.js"

const app = express();
dotenv.config();

const clientUrl= process.env.CLIENT_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
    origin: clientUrl,
    credentials:true
}))
app.use(express.json({}))
app.use(express.urlencoded({extended:true,}))
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// app.get("/",(req,res)=>{
//     res.send("hello the server started");
// });
// app.use(uploadRoutes);

app.use("/",userRouter);
app.use("/user",verifyUser);
app.use("/events",eventRoutes);
app.use("/notices",noticeRoutes);
app.use("/students",studentRoutes);
app.use("/gallery",galleryRoutes);


// This will make /uploads accessible
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



export default app