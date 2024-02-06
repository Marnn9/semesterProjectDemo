//add import from postgres

//all the sql instances should be placed here

const dbConnectionString = "url to the database in postgres including the port" //don't have this here if you want to keep your stuff

/*in etc. render /enciroment ... add a key with the name like this

if (process.env.CHOSENNAMEFORKEY == undefined){
    throw("you forgot dbString")
}
¨
*/

 class DBManager {
    #credentials = {};

    constructor(connectionstring) {
        //this.#credentials = process.env.DB_Connectionstring; //this is bad should not reference to the operating system
        this.credentials = {
            connectionstring,
            ssl: {
                rejectAuth: process.env.LIVE || false
            }
        }
    }

    async createUser(user) {
        const client = new Client(this.#credentials); //Client() is from postgress
        try {
            await client.connect();
            client.query("database command... ", user.name, user.email,user.pswHash); //`use VALUES {$1::Text, $2::Text,$3::Text } instead of ${user.name} ` because of security
        } catch (error) {

        }
        return user;
    }
    
}


//export default new DBManager(prosces.env.dbConnectionString);
/*might look something like this */

