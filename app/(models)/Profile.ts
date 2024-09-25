import mongoose, { Schema } from "mongoose";

export interface IProfile {
    mail: string;
    events: IEvent[];
    role?: string; // Cambia qui
}

export interface IEvent {
    id: string;
    title: string;
    image: string;
    color: string;
}

mongoose.connect(process.env.MONGODB_URI!);
mongoose.Promise = global.Promise;

const eventSchema = new Schema({
    id: { type: String },
    title: { type: String },
    image: { type: String },
    color: { type: String },
});

const profileSchema = new Schema({
    mail: { type: String, required: true },
    events: { type: [eventSchema], default: [] },
    role: { type: String }
});

const Profile = mongoose.models.Profile || mongoose.model<IProfile>("Profile", profileSchema);

export default Profile;