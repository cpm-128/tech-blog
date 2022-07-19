const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const bcrypt = require('bcrypt');

class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

User.init(
    {   // ================================
        // TABLE COLUMN DEFINITIONS GO HERE
        // ================================
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // email: {
        //     type: DataTypes.STRING,
        //     allowNull: false
        // },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // password length must be atleast 4 characters
                len: [4]
            }
        }
    },
    {   // ====================================
        // TABLE CONFIGURATIONS OPTIONS GO HERE
        //=====================================

        // functions to call before Sequelize, like pw hashing
        hooks: {
            // set up beforeCreate lifecycles 'hook' functionality to fire just before a new User is created
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // hook for when existing user updated pw
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        // pass in the imported sequelize connection (the direct connection to the db)
        sequelize,
        // do not automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // do not pluralize name of the database table
        freezeTableName: true,
        // use underscores instread of camel-casing
        underscored: true,
        // keep model name lowercase in the database
        modelName: 'user'

    }
);

module.exports = User;