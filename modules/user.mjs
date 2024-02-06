//import dbManager from "./dbManager.mjs";

class User {

    constructor() {
        ///TODO: Are these the correct fields for your project?
        this.email;
        this.pswHash;
        this.name;
        this.id;
    }

    //maybe add the statement for publishing user to database
    save(){
        dbManager.save(this); //this should not be here
    }
}

export default User;