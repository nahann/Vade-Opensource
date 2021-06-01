import { Schema, Document, model} from "mongoose";

export interface ITicket extends Document {
    Guild: string;
    Modules: string[];
}

const Modules = new Schema({
    Guild: String,
    Modules: Array,
});

const guilds = model<ITicket>(`TicketData`, Modules);

export default guilds;
