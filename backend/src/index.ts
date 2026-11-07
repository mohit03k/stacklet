import express from "express"
import cors from "cors"
import mongoose from "mongoose";
import userRoutes from "./routes/auth.js"
import questionRoutes from "./routes/question.js"
import answerRoutes from "./routes/answer.js"

if (!process.env.JWT_SECRET) {
  throw new Error("Set JWT_SECRET before starting the backend");
}

const app = express();
app.use(express.json({ limit: "30mb" }))
app.use(cors())


app.get("/", (req, res) => {
  res.send("Stackoverflow clone")
})

app.use("/user", userRoutes);
app.use("/question", questionRoutes);
app.use("/answer", answerRoutes);

const PORT = process.env.PORT || 5000
const databaseurl = process.env.MONGODB_URL || ""


mongoose.connect(databaseurl).then(() => app.listen(PORT, () => {
  console.log("server running on port 5000")
})).catch((e) => console.log(e.message))
