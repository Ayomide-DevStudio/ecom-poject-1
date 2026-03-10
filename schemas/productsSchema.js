const mongoose =  require('mongoose')


const productSchema =  new mongoose.Schema({
    LaptopBrand : {
        type:  String,
        required: true
    },
    LaptopModel : {
        type:  String,
        required: true
    },
    LaptopProcessor : {
        type:  String,
        required: true
    },
    LaptopRam : {
        type:  String,
        required: true
    },
    LaptopHardDrive : {
        type:  String,
        required: true
    },
    LaptopMemoryType : {
        type:  String,
        required: true
    },
    LaptopPrice : {
        type: Number,
        required: true
    },
    LaptopSkin: {
        type: String,
        required: true
    },
    DOE: {
        type: Date,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        required: true
    }   


}, {
    timestamps: true
})

const productDetails = mongoose.model("product", productSchema)

module.exports = productDetails