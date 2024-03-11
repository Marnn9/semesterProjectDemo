# API Documentation

## GET / 
> Returns current authenticated user object. If no authenticated user, returns 403 Not authorized.

**"/"**<br>
> <span style="color:blue"> METHOD: GET <br>
> Expects: JSON <br>
> Returns: JSON <br>
> Requires: Authentication <br>

Creates a user, required fields: *{name,password,email}*

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

Checks if the input email exists in the database, if it does it validates the password by checking if the paswordhash in the database for the user with the given email is the same as the paswordhash inputted in the client. 

Required fields *{email, password}*.
Response is {id, email, name, paswHash, avatar: {avatarId, hairColor, eyeColor, skinColor, eyeBrowType}}

## PUT /users/:id 
> Respondes with 404 not found, if the client is trying to edit a user that doesn't exist in database. also if the input email is used in the database already the database, it responds with 422 Unprosessable Content, and error "a user with this email already exists".

**"/users/:id"** <br>
METHOD: PUT <br>
Expects: JSON <br>
Returns: JSON <br>

**optional** fields *{name, email, password}*. id is also sendt with the request.
Checks if the user exists and if the password is to be reset or the same as the one in the database. 
response is {name, email, pswHash, id} with the updated data.

## POST /avatar 
>  Responds with 200 OK if the avatar is cerated or updated. if there is no user logged in the avatar wont be saved and server responds with 404 Not Found.

"/avatar" <br>
METHOD: POST <br>
Expects: JSON <br>
Returns: JSON <br>

finds the logged in user and the avatar Id connected to them, and saves the changes to the avatar table at the given avatarId. 
response Avatar : {aHairColor, anEyeColor, aSkinColor, aBrowType}

## DELETE  /users/:id 
> returns the data of the deleted user. responds with 404 not found if the user has no id.

"/users/:id" <br>
METHOD: DELETE <br>
Expects: JSON <br>
Returns: JSON <br>

Required firlds : *{id}*if there is a user logged in, the user with the same id is deleted in the database. 
responds with {msg}
