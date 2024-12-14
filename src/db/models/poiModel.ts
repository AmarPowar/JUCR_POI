import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface POI extends Document {
    _id: string;
    IsRecentlyVerified: boolean;
    DateLastVerified: string;
    ID: number;
    UUID: string;
    DataProviderID: number;
    OperatorID: number;
    UsageTypeID: number;
    AddressInfo: {
        ID: number;
        Title: string;
        AddressLine1: string;
        Town: string;
        StateOrProvince: string;
        Postcode: string;
        CountryID: number;
        Latitude: number;
        Longitude: number;
        DistanceUnit: number;
    };
    Connections: Array<{
        ID: number;
        ConnectionTypeID: number;
        StatusTypeID: number;
        LevelID: number;
        PowerKW: number;
        CurrentTypeID: number;
        Quantity: number;
    }>;
    NumberOfPoints: number;
    StatusTypeID: number;
    DateLastStatusUpdate: string;
    DataQualityLevel: number;
    DateCreated: string;
    SubmissionStatusTypeID: number;
}

// Define the schema
const POISchema: Schema = new Schema<POI>({
    _id: { type: String, default: uuidv4 },
    IsRecentlyVerified: { type: Boolean, required: true },
    DateLastVerified: { type: String },
    ID: { type: Number, required: true },
    UUID: { type: String },
    DataProviderID: { type: Number },
    OperatorID: { type: Number },
    UsageTypeID: { type: Number },
    AddressInfo: {
        ID: { type: Number },
        Title: { type: String },
        AddressLine1: { type: String },
        Town: { type: String },
        StateOrProvince: { type: String },
        Postcode: { type: String },
        CountryID: { type: Number },
        Latitude: { type: Number },
        Longitude: { type: Number },
        DistanceUnit: { type: Number },
    },
    Connections: [
        {
            ID: { type: Number },
            ConnectionTypeID: { type: Number },
            StatusTypeID: { type: Number },
            LevelID: { type: Number },
            PowerKW: { type: Number },
            CurrentTypeID: { type: Number },
            Quantity: { type: Number },
        },
    ],
    NumberOfPoints: { type: Number },
    StatusTypeID: { type: Number },
    DateLastStatusUpdate: { type: String },
    DataQualityLevel: { type: Number },
    DateCreated: { type: String },
    SubmissionStatusTypeID: { type: Number },
});

// Create a Mongoose model
const POIModel = mongoose.model<POI>('POI', POISchema);

export default POIModel;
