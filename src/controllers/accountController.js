const { errorHandler } = require('../utils/errorHandler')

const updateAccount = async (req, res, next) => {
  try {
    const sellerId = req.auth.user
    const { city, state } = req.body

    if (!city && !state) {
      return next(
        errorHandler(400, 'City or state must be provided for update')
      )
    }

    const sellersCollection = req.app.locals.db.collection('sellers')

    const currentSeller = await sellersCollection.findOne({
      seller_id: sellerId
    })

    if (!currentSeller) {
      return next(errorHandler(404, 'Seller not found'))
    }

    const updatedFields = {}
    if (city) updatedFields.city = city
    if (state) updatedFields.state = state

    const updatedSeller = await sellersCollection.findOneAndUpdate(
      { seller_id: sellerId },
      { $set: updatedFields },
      { returnDocument: 'after' }
    )
    if (!updatedSeller) {
      return next(errorHandler(404, 'Seller not found'))
    }
    res.json({
      message: 'Seller information updated successfully',
      updatedSeller: {
        seller_id: updatedSeller.seller_id,
        city: updatedSeller.city,
        state: updatedSeller.state
      }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  updateAccount
}
