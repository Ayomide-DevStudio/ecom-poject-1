const categoryDetails = require("../schemas/categorySchema")

const createCategory = async (req, res) => {
    try {

        const {categoryName} = req.body

        const exist = await categoryDetails.findOne({categoryName})

        if (exist) {
            return res.status(400).json({
                message: "Category already exists"
            })
        }

        const category = new categoryDetails({categoryName})

        await category.save()

        res.status(200).json({
            message: "Category created successfully"
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
module.exports = {createCategory}