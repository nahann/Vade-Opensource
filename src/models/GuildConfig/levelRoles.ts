import { Schema, Document, model} from "mongoose";

export interface ILevelRole extends Document {
    Guild: string;
    Role: string;
    Level: string;
}
const reqString = {
    type: String,
    required: true,
};



const roleSchema = new Schema({
    Guild: reqString,
    Role: reqString,
    Level: reqString,
});

const guilds = model<ILevelRole>(`level-roles`, roleSchema);

export default guilds;
