import pg from "pg"


/// TODO: is the structure / design of the DBManager as good as it could be?

class DBManager {

    #credentials = {};
    #dbTableNames = {
        user: { name: 'uName', email: 'uEmail', password: 'password', id: 'id', avatarId: 'anAvatarId' },
        avatar: { id: 'avatarId', hairColor: 'hairColor', eyeColor: 'eyeColor', skinColor: 'skinColor', eyebrowType: 'eyeBrowType' },
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

    async getUserByIdentifyer(anIdetifyer) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            let user = null;

            // Check if anIdetifyer is a valid integer
            if (/^\d+$/.test(anIdetifyer)) {
                const outputId = await client.query(`SELECT * FROM public."Users" WHERE "${this.#dbTableNames.user.id}" = $1`, [anIdetifyer]);

                if (outputId.rows.length === 1) {
                    user = outputId.rows[0];
                }
            } else {
                const outputEmail = await client.query(`SELECT * FROM public."Users" WHERE "${this.#dbTableNames.user.email}" = $1`, [anIdetifyer]);

                if (outputEmail.rows.length === 1) {
                    user = outputEmail.rows[0];
                }
            }

            return user;
        } catch (error) {
            console.error(`Error getting user by identifyer ${anIdetifyer}:`, error);
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

    async addAvatar(avatar, userId) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();

            // Insert avatar details and get the avatarId
            const avatarInsertResult = await client.query(`
                INSERT INTO "public"."anAvatar"("${this.#dbTableNames.avatar.hairColor}", "${this.#dbTableNames.avatar.eyeColor}", "${this.#dbTableNames.avatar.skinColor}", "${this.#dbTableNames.avatar.eyebrowType}")
                VALUES($1::Text, $2::Text, $3::Text, $4::Text) RETURNING "avatarId";`, [avatar.aHairColor, avatar.anEyeColor, avatar.aSkinColor, avatar.aBrowType]);

            // Ensure that avatarId is retrieved correctly
            const avatarId = avatarInsertResult.rows[0].avatarId;
            console.log('Inserted Avatar ID:', avatarId);

            // Update the Users table with the obtained avatarId
            const userUpdateResult = await client.query(`
                UPDATE "public"."Users" 
                SET "${this.#dbTableNames.user.avatarId}" = $1::integer 
                WHERE id = $2::integer;
            `, [avatarId, userId]);

            // Log the number of affected rows in the Users table
            console.log('User id: ' + userId + ' Number of rows affected in Users table:', userUpdateResult.rowCount);

            // Handle userUpdateResult if needed
            if (userUpdateResult.rowCount > 0) {
                console.log('User updated successfully');
            } else {
                console.log('User update failed');
                // Handle the case where the update did not affect any rows
            }

            // Update the avatarId property in the avatar object
            avatar.avatarId = avatarId;

        } catch (error) {
            console.error('Error in addAvatar:', error);
            // TODO: Handle errors appropriately
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return avatar;
    }

    async updateAvatar(avatar, avatarId) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const updateQuery = await client.query(`
        UPDATE "public"."anAvatar" 
        SET "${this.#dbTableNames.avatar.hairColor}" = $1::text, "${this.#dbTableNames.avatar.eyeColor}" = $2::text, "${this.#dbTableNames.avatar.skinColor}" = $3::text, "${this.#dbTableNames.avatar.eyebrowType}" = $4::text WHERE "avatarId" = $5::integer;`
                , [avatar.aHairColor, avatar.anEyeColor, avatar.aSkinColor, avatar.aBrowType, avatarId]);
        } catch (error) {
            console.error('Error in addAvatar:', error);
        } finally {
            client.end();
        }
    }

    async getAvatar(anId) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            let avatar = null;

            const outputId = await client.query(`SELECT * FROM public."anAvatar" WHERE "${this.#dbTableNames.avatar.id}" = $1`, [anId]);

            if (outputId.rows.length === 1) {
                avatar = outputId.rows[0];
            }

            return avatar;
        } catch (error) {
            console.error('Error in getAvatar:', error);
            // TODO: Handle errors appropriately
        } finally {
            client.end(); // Always disconnect from the database.
        }

    }
}

// We are using an enviorment variable to get the db credentials 
let connectionString = process.env.ENVIORMENT == "local" ? process.env.DB_CONNECTIONSTRING_LOCAL : process.env.DB_CONNECTIONSTRING_PROD;

// We are using an enviorment variable to get the db credentials 
if (connectionString == undefined) {
    throw ("You forgot the db connection string");
}

export default new DBManager(connectionString);

//