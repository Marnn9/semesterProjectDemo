# API Documentation
> [!note]
> All the authorizations is sent as base 64 encoding

## GET / avatar
> Returns the values of the avatar. If no authenticated user, returns 401 unauthorized.

**"/avatar/:id"**<br>
METHOD: GET <br>
Expects: JSON <br>
Returns: JSON <br>
Requires: Authentication {token} <br>

Returns the avatar if any exist, if not a msg: is sent as response.

## POST /users 
> Adds a new user to the user/users endpoint. No user is added if a user with the given email exists already.

**"/users"** <br>
METHOD: POST <br>
Expects: JSON <br>
Returns: JSON <br>

Creates a user, required fields: *{name, email, password}*, password is encrypted when recieved. 
Response : msg: " new user created" if successful.

## POST /login 
> Returns a token when user info is confirmed. Also sends the "avatardata" if any. 

**"/login"** <br>
METHOD: POST <br>
Expects: JSON <br>
Returns: JSON <br>
Requires: Authentication {token} <br>

Checks if the input email exists in the database, if it does it validates the password by checking if the paswordhash in the database for the user with the given email is the same as the paswordhash inputted in the client. The token is updated and returned here.

Required fields *{email, password}*.
Response is {user: {id, role}, avatar: {avatarId, hairColor, eyeColor, skinColor, eyeBrowType}, token}

## PUT /users/update
>  User can change their own data. New token with updated credentials returned.

**"/users/update"** <br>
METHOD: PUT <br>
Expects: JSON <br>
Returns: JSON <br>
Requires: Authentication {token} <br>

**optional** fields *{name, email, password}*. 
Checks if the user exists and if the password is to be reset or the same as the one in the database. creates a new updated token.
response is {{user: id, email}, token} with the updated data.

## POST /avatar 
>  creates an avatar if there is none connected to the user, and updates the avatar if it exists

"/avatar" <br>
METHOD: POST <br>
Expects: JSON <br>
Returns: JSON <br>
Requires: Authentication {token} <br>

finds the logged in user and the avatar Id connected to them, and saves the changes to the avatar table at the given avatarId. 
response : {aHairColor, anEyeColor, aSkinColor, aBrowType}.

## DELETE  /users/:id 
> [!caution]
> The user will be permanently deleted and can therefore never be restored

"/users/:id" <br>
METHOD: DELETE <br>
Expects: JSON <br>
Returns: JSON <br>
Requires: Authentication {token} <br>

Required paramater : *{id}* if there exists a user with the id in database, user with the same id is deleted. 
responds with {msg}. <br> A user with role "admin" cannot be deleted.

## GET / users
> Returns all the users.

**"/users"**<br>
 METHOD: GET <br>
 Expects: JSON <br>
 Returns: JSON <br>
 Requires: Authentication {token} <br>

Shows all the users in the database. 
Responds with {users}.
> [!Important]
> Only available for the administrator