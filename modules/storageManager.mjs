import pg from "pg"
import SuperLogger from "./SuperLogger.mjs";

// We are using an enviorment variable to get the db credentials 
if (process.env.DB_CONNECTIONSTRING == undefined) {
    throw ("You forgot the db connection string");
}

/// TODO: is the structure / design of the DBManager as good as it could be?

class DBManager {

    #credentials = {};
    #dbTableNames = {
        user: { name: 'uName', email: 'uEmail', password: 'password', id: 'id' },
        avatar: {id: 'avatarId', hairColor: 'hairColor', eyeColor: 'eyeColor', skinColor: 'skinColor', eyebrowType: 'eyeBrowType'},
        //add other tables here like avatar
    }

    constructor(connectionString) {
        this.#credentials = {
            connectionString,
            ssl: (process.env.DB_SSL === "true") ? process.env.DB_SSL : false
        };

    }

    async test() {
        const client = new pg.Client(this.#credentials);
        await client.connect();
        await client.end()
    }

    async updateUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query(`Update "public"."Users" set "${this.#dbTableNames.user.name}" = $1, "${this.#dbTableNames.user.email}" = $2, "${this.#dbTableNames.user.password}" = $3 where id = $4;`, [user.name, user.email, user.pswHash, user.id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO Did we update the user?

            if (output.rows.length == 1) {
                // We stored the user in the DB.
                user.id = output.rows[0].id;
            }
        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;

    }

    async getUserByEmail(anEmail) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query(`SELECT * FROM public."Users" WHERE "${this.#dbTableNames.user.email}" = $1`, [anEmail]);

            if (output.rows.length === 1) {
                const user = output.rows[0];
                return user;
            } else {
                return null; // No user found with the given username
            }
        } catch (error) {
            console.error(`Error getting user by email ${anEmail}:`, error);
            throw error;
        } finally {
            client.end();
        }
    }

    async deleteUser(anId) {
    const client = new pg.Client(this.#credentials);

    try {
        await client.connect();
        const output = await client.query('DELETE FROM "public"."Users" WHERE id = $1;', [anId]);

        // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
        // Of special interest is the rows and rowCount properties of this object.

        // Check if the user got deleted
        if (output.rowCount === 1) {
            console.log(`User with ID ${anId} deleted.`);
        } else {
            console.log(`User with ID ${anId} not found.`);
        }

    } catch (error) {
        console.error(error);
        // TODO: Error handling?? Remember that this is a module separate from your server 
    } finally {
        client.end(); // Always disconnect from the database.
    }
}
    async createUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query(`INSERT INTO "public"."Users"("${this.#dbTableNames.user.name}", "${this.#dbTableNames.user.email}", "${this.#dbTableNames.user.password}") VALUES($1::Text, $2::Text, $3::Text) RETURNING id;`, [user.name, user.email, user.pswHash]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            if (output.rows.length == 1) {
                // We stored the user in the DB.
                user.id = output.rows[0].id;
            }

        } catch (error) {
            console.error(error);
            //TODO : Error handling?? Remember that this is a module septate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }
 
        return user;

    }

    async retrieveAllUsers() {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query(`SELECT * FROM public."Users"`);
            const users = output.rows;

            return users;

        } catch (error) {
            console.error(error);
            throw error;
            //TODO : Error handling?? Remember that this is a module septate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }


    }

    async addAvatar (avatar){
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query(`INSERT INTO "public"."anAvatar"("${this.#dbTableNames.avatar.hairColor}", "${this.#dbTableNames.avatar.eyeColor}", "${this.#dbTableNames.avatar.skinColor}") VALUES($1::Text, $2::Text, $3::Text);`, [avatar.aHairColor, avatar.anEyeColor, avatar.aSkinColor]);

            if (output.rows.length == 1) {
                // We stored the user in the DB.
                avatar.avatarId = output.rows[0].avatarId;
            }

        } catch (error) {
            console.error(error);
            //TODO : Error handling?? Remember that this is a module septate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }
 
        return avatar;
    }

}








export default new DBManager(process.env.DB_CONNECTIONSTRING);

//