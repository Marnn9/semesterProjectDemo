import pg from "pg"


/// TODO: is the structure / design of the DBManager as good as it could be?

class DBManager {

    #credentials = {};
    #dbTableNames = {
        user: { name: 'uName', email: 'uEmail', password: 'password', id: 'id', avatarId: 'anAvatarId' },
        avatar: { id: 'avatarId', hairColor: 'hairColor', eyeColor: 'eyeColor', skinColor: 'skinColor', eyebrowType: 'eyeBrowType' },
    }

    constructor(connectionString) {
        this.#credentials = {
            connectionString,
            ssl: (process.env.DB_SSL === "true") ? process.env.DB_SSL : false
        };
    }

    async updateUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query(`Update "public"."Users" set "${this.#dbTableNames.user.name}" = $1, "${this.#dbTableNames.user.email}" = $2, "${this.#dbTableNames.user.password}" = $3 where id = $4;`, [user.name, user.email, user.pswHash, user.id]);

            if (output.rows.length === 1) {
                user.id = output.rows[0].id;
            }
            return user;

        } catch (error) {
            console.error(`Error updating user ${user}:`, error);
            throw error;
        } finally {
            await client.end();
        }

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

                if (outputEmail.rows.length >= 1) {
                    user = outputEmail.rows[0];
                }
            }

            return user;
        } catch (error) {
            console.error(`Error getting user by identifyer ${anIdetifyer}:`, error);
            throw error;
        } finally {
            await client.end();
        }
    }

    async deleteUser(anId) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('DELETE FROM "public"."Users" WHERE id = $1;', [anId]);

            if (output.rowCount === 1) {
                console.log(`User with ID ${anId} deleted.`);
            } else {
                console.log(`User with ID ${anId} not found.`);
            }

        } catch (error) {
            console.error(`Error deleting user with id: ${anId}:`, error);
            throw error;
        } finally {
            await client.end(); 
        }
    }
    async createUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query(`INSERT INTO "public"."Users"("${this.#dbTableNames.user.name}", "${this.#dbTableNames.user.email}", "${this.#dbTableNames.user.password}") VALUES($1::Text, $2::Text, $3::Text) RETURNING id;`, [user.name, user.email, user.pswHash]);

            if (output.rows.length == 1) {
                user.id = output.rows[0].id;
            }

        } catch (error) {
            console.error(`Error creating user:  ${user}:`, error);
            throw error;
        } finally {
            await client.end(); 
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
            console.error("error, could not find users in database" ,error);
            throw error;
        } finally {
            await client.end();
        }
    }

    async addAvatar(avatar, userId) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();

            // Insert avatar details and get the avatarId
            const avatarInsertResult = await client.query(`
                INSERT INTO "public"."anAvatar"("${this.#dbTableNames.avatar.hairColor}", "${this.#dbTableNames.avatar.eyeColor}", "${this.#dbTableNames.avatar.skinColor}", "${this.#dbTableNames.avatar.eyebrowType}")
                VALUES($1::Text, $2::Text, $3::Text, $4::Text) RETURNING "avatarId";`, [avatar.hairColor, avatar.eyeColor, avatar.skinColor, avatar.browType]);

            const avatarId = avatarInsertResult.rows[0].avatarId;
            console.log('Inserted Avatar ID:', avatarId);

            const userUpdateResult = await client.query(`
                UPDATE "public"."Users" 
                SET "${this.#dbTableNames.user.avatarId}" = $1::integer 
                WHERE id = $2::integer;
            `, [avatarId, userId]);

            console.log('User id: ' + userId + ' Number of rows affected in Users table:', userUpdateResult.rowCount);


            if (userUpdateResult.rowCount > 0) {
                console.log('User updated successfully');
            } else {
                console.log('User update failed');
            }

            avatar.avatarId = avatarId;

        } catch (error) {
            console.error('Error adding avatar:', error);
            throw error;
        } finally {
            await client.end();
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
                , [avatar.hairColor, avatar.eyeColor, avatar.skinColor, avatar.browType, avatarId]);
        } catch (error) {
            console.error("Error updating the avatar:", error);
            throw error;
        } finally {
           await  client.end();
        }
        return avatar
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
            console.error("Error finding the avatar:", error);

        } finally {
            await client.end();
        }

    }
}

// We are using an enviorment variable to get the db credentials 
let connectionString = process.env.ENVIORMENT == "local" ? process.env.DB_CONNECTIONSTRING_LOCAL : process.env.DB_CONNECTIONSTRING_PROD;

// We are using an enviorment variable to get the db credentials 
/* if (connectionString == undefined) {
    throw ("You forgot the db connection string");
} */

export default new DBManager(connectionString);

//