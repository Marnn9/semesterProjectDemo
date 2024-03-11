# API Documentation
> [!note]
> All the authorizations is sent as base 64 encoding

## GET / avatar /:id
> Returns the values of the avatar. If no authenticated user, returns 401 unauthorized.

**"/avatar/:id"**<br>
METHOD: GET <br>
Expects: JSON <br>
Returns: JSON <br>
Requires: Authentication {token} <br>

Shows the avatar the loggedIn user has based on their token. If no avatar the default avatar is shown. 

## POST /users 
> Adds a new user to the user/users endpoint. if a user with the given email exists it returns 422 Unprocessable Content. Also if one of the data fields is missing it returns 400

**"/users"** <br>
METHOD: POST <br>
Expects: JSON <br>
Returns: JSON <br>

Creates a user, required fields: *{name, email, password}*, password is encrypted when recieved. 
Response : msg: " new user created" if successful.

## POST /login 
> returns 401 Unautorised if the email or password does not exist in the database

**"/login"** <br>
METHOD: POST <br>
Expects: JSON <br>
Returns: JSON <br>

Checks if the input email exists in the database, if it does it validates the password by checking if the paswordhash in the database for the user with the given email is the same as the paswordhash inputted in the client. The token is updated and returned here.

Required fields *{email, password}*.
Response is {user: {id, email, name, paswHash}, avatar: {avatarId, hairColor, eyeColor, skinColor, eyeBrowType}, token}

## PUT /users/:id 
> Respondes with 404 not found, if the client is trying to edit a user that doesn't exist in database. also if the input email is used in the database already the database, it responds with 422 Unprosessable Content, and error "a user with this email already exists".

**"/users/:id"** <br>
METHOD: PUT <br>
Expects: JSON <br>
Returns: JSON <br>
Requires: Authentication {token} <br>

**optional** fields *{name, email, password}*. id is also sendt with the request.
Checks if the user exists and if the password is to be reset or the same as the one in the database. 
response is {name, email, pswHash, id} with the updated data.

## POST /avatar 
>  Responds with 200 OK if the avatar is cerated or updated. if there is no user logged in the avatar wont be saved and server responds with 404 Not Found.

"/avatar" <br>
METHOD: POST <br>
Expects: JSON <br>
Returns: JSON <br>
Requires: Authentication {token} <br>

finds the logged in user and the avatar Id connected to them, and saves the changes to the avatar table at the given avatarId. 
response Avatar : {aHairColor, anEyeColor, aSkinColor, aBrowType}.

## DELETE  /users/:id 
> [!caution]
> The user will be permanently deleted and can therefore never be restored


"/users/:id" <br>
METHOD: DELETE <br>
Expects: JSON <br>
Returns: JSON <br>
Requires: Authentication {token} <br>

Required fields : *{id}* if there is a user logged in, the user with the same id is deleted in the database. 
responds with {msg}.

## GET / users
> Returns all the users, returns 403 Forbidden if you are not an admin.

**"/users"**<br>
 METHOD: GET <br>
 Expects: JSON <br>
 Returns: JSON <br>
 Requires: Authentication {id, email} <br>

Shows all the users in the database. 
> [!Important]
> Only available for the administrator