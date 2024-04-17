import mongoose, { Schema } from "mongoose";

import config from "@config/app.json";
import { string } from "zod";

const ReleaseSchema = new Schema( 
    {
    releaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReleaseId",
    },
    releaseSubLink: {
        type: String,
        ref: "ReleaseSubLink",
      },
      title: {
        type: String,
        ref: "ReleaseSubLink",
      },
      upc: {
        type: String,
        ref: "ReleaseSubLink",
      },
      isrc: {
        type: String,
        ref: "ReleaseSubLink",
      },
      artWorkUrl: {
        type: String,
        ref: "ReleaseSubLink",
      },
      preview: {
        type: String,
        ref: "ReleaseSubLink",
      },
      platforms: {
        default: [],
        type: [{ type: Schema.Types.ObjectId, ref: "Link" }],
      },
    },
    { timestamps: true },);
module.exports =
  mongoose.models?.Release || mongoose.model("Release", ReleaseSchema);