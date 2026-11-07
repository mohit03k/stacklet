import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    name: string;
    email: string;
    password: string;
    about?: string | null;
    tags: string[];
    joinDate: NativeDate;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    password: string;
    about?: string | null;
    tags: string[];
    joinDate: NativeDate;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    name: string;
    email: string;
    password: string;
    about?: string | null;
    tags: string[];
    joinDate: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    name: string;
    email: string;
    password: string;
    about?: string | null;
    tags: string[];
    joinDate: NativeDate;
}, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    password: string;
    about?: string | null;
    tags: string[];
    joinDate: NativeDate;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    name: string;
    email: string;
    password: string;
    about?: string | null;
    tags: string[];
    joinDate: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    name: string;
    email: string;
    password: string;
    about?: string | null;
    tags: string[];
    joinDate: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    email: string;
    password: string;
    about?: string | null;
    tags: string[];
    joinDate: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & Required<{
    _id: mongoose.Types.ObjectId;
}>>;
export default _default;
//# sourceMappingURL=auth.d.ts.map