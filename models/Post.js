const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

class Post extends Model {}

Post.init(
    {   // ================================
        // TABLE COLUMN DEFINITIONS GO HERE
        // defining the Post schema
        // ================================
        id: {
            type: DataTypes.INTEGER,
            allnowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            // minimum characters
            validate: {
                len: [4]
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            // FOREIGN KEY LINK
            references: {
                model: 'user',
                key: 'id'
            }
        },
        created_at: {
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: false
        }
    },
    {   // ====================================
        // TABLE CONFIGURATIONS OPTIONS GO HERE
        // configure the metadata
        //=====================================
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;