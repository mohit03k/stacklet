import mongoose from "mongoose";
import question from "../models/question.js";
import user from "../models/auth.js";
export const AskAnswer = async (req, res) => {
    const userId = req.userid;
    if (!userId)
        return res.status(401).json({ message: "Please log in to answer" });
    const { id } = req.params;
    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid question ID" });
    }
    const { answerbody } = req.body ?? {};
    if (typeof answerbody !== "string" || !answerbody.trim()) {
        return res.status(400).json({ message: "Please write an answer" });
    }
    try {
        const author = await user.findById(userId).select("name");
        if (!author)
            return res.status(401).json({ message: "Please log in again" });
        const updated = await question.findByIdAndUpdate(id, {
            $push: { answer: { answerbody: answerbody.trim(), useranswer: author.name, userId } },
            $inc: { numberOfAnswer: 1 },
        }, { new: true });
        if (!updated)
            return res.status(404).json({ message: "Question not found" });
        res.status(200).json({ data: updated });
    }
    catch {
        res.status(500).json({ message: "Could not post answer" });
    }
};
export const deleteanswer = async (req, res) => {
    const userId = req.userid;
    if (!userId)
        return res.status(401).json({ message: "Please log in to delete your answer" });
    const { id } = req.params; // Question ID
    const { answerid } = req.body ?? {};
    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id) || typeof answerid !== "string" || !mongoose.Types.ObjectId.isValid(answerid)) {
        return res.status(400).json({ message: "Invalid question or answer ID" });
    }
    try {
        const updated = await question.findOneAndUpdate({ _id: id, answer: { $elemMatch: { _id: answerid, userId } } }, { $pull: { answer: { _id: answerid, userId } }, $inc: { numberOfAnswer: -1 } }, { new: true });
        if (!updated)
            return res.status(403).json({ message: "Answer not found or you cannot delete it" });
        res.status(200).json({ data: updated });
    }
    catch {
        res.status(500).json({ message: "Could not delete answer" });
    }
};
//# sourceMappingURL=answers.js.map