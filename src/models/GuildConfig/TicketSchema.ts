import mongoose from "mongoose";

export interface ITicket extends mongoose.Document {
    MessageID: string;
    GuildID: string;
    TicketNumber: number;
    WhitelistedRole: string;
}

const TicketDataSchema = new mongoose.Schema({
    MessageID: String,
    GuildID: String,
    TicketNumber: Number,
    WhitelistedRole: String,
});

const guilds = mongoose.model<ITicket>(`TicketData`, TicketDataSchema);

export default guilds;
