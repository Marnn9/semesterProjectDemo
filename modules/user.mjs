import DBManager from "./storageManager.mjs";

class User {

    constructor() {
        ///TODO: Are these the correct fields for your project?
        this.email;
        this.pswHash;
        this.name;
        this.id;
    }

    //maybe add the statement for publishing user to database
    async save() {
        if (this.id == null) {
            return await DBManager.createUser(this);
        } else {
            return await DBManager.updateUser(this);
        }
    }

    async delete(anId) {
        const deletedUser = await DBManager.deleteUser(anId);
        return deletedUser;
    }

    async displayAll() {
        try {
            const users = await DBManager.retrieveAllUsers();
            return users;  // Make sure the retrieved users are returned
        } catch (error) {
            console.error('Error displaying all users:', error);
            throw error;  // Rethrow the error for better debugging
        }
    }

    async findByIdentifyer(anIdentifyer) {
        try {
            const user = await DBManager.getUserByIdentifyer(anIdentifyer);
            if (user){
                return user;
            }else {
                return null;
            }
            
        } catch (error) {
            console.error(`Error finding user by identifyer ${anIdentifyer}:`, error);
            throw error;
        }
    }

}

class Avatar {
    /*     
        add the code here for the avatar, it must also be linked to the user 
        create the table in pgAdmin, make some foreign keys to the users table 
        save the avatar each user cerate 
    */

}

export default User;