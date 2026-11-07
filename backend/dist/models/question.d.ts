import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    questionTitle: string;
    questionBody: string;
    questionTags: string[];
    numberOfAnswer: number;
    upvote: string[];
    downvote: string[];
    userpoted?: string | null;
    userID?: string | null;
    askedon: NativeDate;
    answer: mongoose.Types.DocumentArray<{
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }, {}, {}> & {
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }>;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    questionTitle: string;
    questionBody: string;
    questionTags: string[];
    numberOfAnswer: number;
    upvote: string[];
    downvote: string[];
    userpoted?: string | null;
    userID?: string | null;
    askedon: NativeDate;
    answer: mongoose.Types.DocumentArray<{
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }, {}, {}> & {
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    questionTitle: string;
    questionBody: string;
    questionTags: string[];
    numberOfAnswer: number;
    upvote: string[];
    downvote: string[];
    userpoted?: string | null;
    userID?: string | null;
    askedon: NativeDate;
    answer: mongoose.Types.DocumentArray<{
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }, {}, {}> & {
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    questionTitle: string;
    questionBody: string;
    questionTags: string[];
    numberOfAnswer: number;
    upvote: string[];
    downvote: string[];
    userpoted?: string | null;
    userID?: string | null;
    askedon: NativeDate;
    answer: mongoose.Types.DocumentArray<{
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }, {}, {}> & {
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }>;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    questionTitle: string;
    questionBody: string;
    questionTags: string[];
    numberOfAnswer: number;
    upvote: string[];
    downvote: string[];
    userpoted?: string | null;
    userID?: string | null;
    askedon: NativeDate;
    answer: mongoose.Types.DocumentArray<{
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }, {}, {}> & {
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    questionTitle: string;
    questionBody: string;
    questionTags: string[];
    numberOfAnswer: number;
    upvote: string[];
    downvote: string[];
    userpoted?: string | null;
    userID?: string | null;
    askedon: NativeDate;
    answer: mongoose.Types.DocumentArray<{
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }, {}, {}> & {
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    questionTitle: string;
    questionBody: string;
    questionTags: string[];
    numberOfAnswer: number;
    upvote: string[];
    downvote: string[];
    userpoted?: string | null;
    userID?: string | null;
    askedon: NativeDate;
    answer: mongoose.Types.DocumentArray<{
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }, {}, {}> & {
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    questionTitle: string;
    questionBody: string;
    questionTags: string[];
    numberOfAnswer: number;
    upvote: string[];
    downvote: string[];
    userpoted?: string | null;
    userID?: string | null;
    askedon: NativeDate;
    answer: mongoose.Types.DocumentArray<{
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }, {}, {}> & {
        answerbody?: string | null;
        useranswer?: string | null;
        userId?: string | null;
        answeredOn: NativeDate;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & Required<{
    _id: mongoose.Types.ObjectId;
}>>;
export default _default;
//# sourceMappingURL=question.d.ts.map