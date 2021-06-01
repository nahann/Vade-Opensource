import { Schema, Document, model} from "mongoose";

export interface Imodule extends Document {
    Guild: string;
    Modules: string[];
}

const Modules = new Schema({
    Guild: String,
    Modules: Array,
});

const guilds = model<Imodule>(`modules`, Modules);

export default guilds;
