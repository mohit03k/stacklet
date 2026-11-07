import mongoose from "mongoose";
const questionSchema = new mongoose.Schema({
    questionTitle: { type: String, required: true },
    questionBody: { type: String, required: true },
    questionTags: { type: [String], required: true },
    numberOfAnswer: { type: Number, default: 0 },
    upvote: { type: [String], default: [] },
    downvote: { type: [String], default: [] },
    userpoted: { type: String },
    userID: { type: String },
    askedon: { type: Date, default: Date.now() },
    answer: [
        {
            answerbody: String,
            useranswer: String, // id of user answered
            userId: String,
            answeredOn: { type: Date, default: Date.now() }
        }
    ],
}, { timestamps: true });
export default mongoose.model("question", questionSchema);
//# sourceMappingURL=question.js.map