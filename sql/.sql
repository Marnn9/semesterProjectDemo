/* create an object in javascript that contains the different statements */

'DELETE from "public"."Users"  WHERE id = $1;', [user.id]

'INSERT INTO "public"."Users"("uName", "uEmail", "password") VALUES($1::Text, $2::Text, $3::Text) RETURNING id;', [user.name, user.email, user.pswHash]

'UPDATE "public"."Users" SET "uName" = $1, "uEmail" = $2, "password" = $3 WHERE id = $4;', [user.name, user.email, user.pswHash, user.id]