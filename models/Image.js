const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
    {
        Image: { type: String, required: true },
        Product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    },
    {
        timestamps: true,
    },
    {
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
        toObject: { virtuals: true },
        versionKey: false,
    }
);

const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;