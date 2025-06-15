// helpers/commonQuery.js

const commonQuery = {
    /**
     * Find multiple documents
     */
    async find(Model, options = {}) {
        const {
            filter = {},
            projection = null,
            populate = '',
            sort = {},
            limit = 0,
            skip = 0
        } = options;

        return await Model.find(filter, projection)
            .populate(populate)
            .sort(sort)
            .limit(limit)
            .skip(skip);
    },

    /**
     * Find one document
     */
    async findOne(Model, filter = {}, options = {}) {
        const { projection = null, populate = '' } = options;
        return await Model.findOne(filter, projection).populate(populate);
    },

    /**
     * Find document by ID
     */
    async findById(Model, id, options = {}) {
        const { projection = null, populate = '' } = options;
        return await Model.findById(id, projection).populate(populate);
    },

    /**
     * Create a new document
     */
    async create(Model, data) {
        const doc = new Model(data);
        return await doc.save();
    },

    /**
     * Update document by ID
     */
    async updateById(Model, id, data, options = { new: true }) {
        return await Model.findByIdAndUpdate(id, data, options);
    },

    /**
     * Delete document by ID
     */
    async deleteById(Model, id) {
        return await Model.findByIdAndDelete(id);
    },

    /**
     * Perform aggregation
     */
    async aggregate(Model, pipeline = []) {
        return await Model.aggregate(pipeline);
    },

    /**
     * Count documents matching a filter
     */
    async countDocuments(Model, filter = {}) {
        return await Model.countDocuments(filter);
    },

    /**
     * Estimate total document count (ignores filter)
     */
    async estimatedDocumentCount(Model) {
        return await Model.estimatedDocumentCount();
    },

    /**
 * Replace a single document matching filter with new data
 * @param {Model} Model - Mongoose model
 * @param {Object} filter - filter criteria to find document
 * @param {Object} replacement - new document data (will replace existing)
 * @param {Object} options - optional Mongoose options (e.g. upsert)
 * @returns {Promise} - result of replaceOne operation
 */
    async replaceOne(Model, filter, replacement, options = {}) {
        return await Model.replaceOne(filter, replacement, options);
    }
};

module.exports = commonQuery;
