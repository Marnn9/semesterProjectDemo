import DBManager from "./storageManager.mjs";

class User {

    constructor() {
        this.email;
        this.pswHash;
        this.name;
        this.id;
        this.avatarId;
        this.role;
    }
   
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
            return users;  
        } catch (error) {
            console.error('Error displaying all users:', error);
            throw error;  
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

export default User;