const isValidDate = require('../helpers/dateHelper')
const productDetails =  require('../schemas/productsSchema')
const categoryDetails = require('../schemas/categorySchema')

//create CRUD
const createProduct = async (req, res) => {
    try {
        
        const {LaptopBrand, LaptopModel, LaptopProcessor, LaptopRam,  LaptopHardDrive, LaptopMemoryType, LaptopPrice,  LaptopSkin, DOE, category_id} = req.body
        //console.log(req.body)
            //validate
            if (!LaptopBrand || !LaptopModel || !LaptopProcessor || !LaptopRam || !LaptopHardDrive || !LaptopMemoryType || !LaptopPrice || !LaptopSkin || !DOE) return res.status(400).json({message: "All fields are required!"})
            if (isNaN(LaptopPrice)) return res.status(400).json({message: "Can only be a number"})
            if (!isValidDate(DOE)) return res.status(400).json({message: "Invalid date"})
                    // check if category exists
                        const category = await categoryDetails.findById(category_id)
                        if (!category)
                            return res.status(404).json({ message: "Category not found" })
                        //proceed to save
                        const user = req.user
                        if (!user) return res.status(401).json({message: "Unauthorized"})
                        const product =  new productDetails({...req.body, user_id: user._id})
                        await product.save()
                        res.status(200).json({message: `${LaptopBrand} was saved successfully✅`})

                              
    } catch (error) {
        res.status(500).json({
            message:  error.message
        })
    }
}


//edit product
const editProduct = async (req, res) => {
    try {
        const {id} = req.params
        const {LaptopBrand, LaptopModel, LaptopProcessor, LaptopRam,  LaptopHardDrive, LaptopMemoryType, LaptopPrice, LaptopSkin} = req.body
            //validate
            if (!LaptopBrand || !LaptopModel || !LaptopProcessor || !LaptopRam || !LaptopHardDrive || !LaptopMemoryType || !LaptopPrice || !LaptopSkin) return res.status(400).json({message: "All fields required!"})
            if (LaptopBrand.length < 3) return res.status(400).json({message: "Invalid characters"})
            if (LaptopModel.length < 3) return res.status(400).json({message: "Invalid characters"})
            if (isNaN(LaptopPrice)) return res.status(400).json({message: "Can only be a number"})

                const user = req.user
                    if (!user) return res.status(401).json({message: "Unauthorized"})
                    //update

                    let product
                    if (user.role === 'admin'){
                        product = await productDetails.findByIdAndUpdate(id, 
                            {LaptopBrand, LaptopModel, LaptopProcessor, LaptopRam,  LaptopHardDrive, LaptopMemoryType, LaptopPrice,  LaptopSkin},
                            {new: true}

                        )
                    }else{
                        product = await productDetails.findOneAndUpdate(
                            { _id: id, user_id: user._id},
                            {LaptopBrand, LaptopModel, LaptopProcessor, LaptopRam,  LaptopHardDrive, LaptopMemoryType, LaptopPrice,  LaptopSkin},
                            {new: true}
                        )
                    }
                    //console.log(product)
               
                        if (!product) return res.status(400).json({message: "Not authorized to update this product"})
                            res.status(200).json({ product, message:"Product updated successfully ✅"})

        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


//getProductById
const getProductById =  async (req, res) => {
    try {
        const {id} = req.params
        const product = await productDetails.findById(id).select("-createdAt, -updatedAt").populate("category_id", "categoryName")
            if (!product) return res.status(400).json({message: "Product does not exist 😒"})
                res.status(200).json({product, message: "Product found ✅"})

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//getAllProduct

const getAllProducts = async (req, res) => {
    try {
        const product =  await productDetails.find().select("-createdAt, -updatedAt")
            if (!product) return res.status(400).json({message: "No product found😒"})
                 res.status(200).json({product, message: "Products found ✅"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

//deleteProductById

const deleteProductById = async (req, res) => {
    try {
        const user = req.user
        if (!user) return res.status(401).json({ message: "Unauthorized" })

        const { id } = req.params

        // Find the product first
        const product = await productDetails.findById(id)

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        // Check ownership or admin
        if (user.role !== "admin" && product.user_id.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "You cannot delete this product" })
        }

        await productDetails.findByIdAndDelete(id)

        res.status(200).json({
            message: `Product (${product.LaptopBrand}) has been deleted ✅`
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteAllProduct = async (req, res) => {
    try {
        const user = req.user
        //console.log(user)
        if (!user) return res.status(401).json({message: "Unauthorized"})
             if (user.role === 'admin'){
              const product = await productDetails.deleteMany({})
                if (!product) return res.status(400).json({message: "Unable to delete all"})
                    return res.status(200).json({message: "All product has been deleted✅"})
        }
        
    } catch (error) {
         res.status(500).json({message: error.message})
    }
}


const getProductsByCategory = async (req, res) => {
    try {

        const {category_id} = req.params

        const products = await productDetails
            .find({category_id})
            .populate("category_id", "categoryName")
        if (!products.length) {
            return res.status(404).json({
                message: "No products found in this category"
            })
        }


        res.status(200).json({
            products,
            message: "Category products found"
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}




module.exports = {
    createProduct,
    editProduct,
    getProductById,
    getAllProducts,
    deleteProductById,
    deleteAllProduct, 
    getProductsByCategory
}