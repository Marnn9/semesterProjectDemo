/* create an object in javascript that contains the different statements */

-- Table: public.Users

-- DROP TABLE IF EXISTS public."Users";

CREATE TABLE IF NOT EXISTS public."Users"
(
    id SERIAL PRIMARY KEY,
    "uName" VARCHAR(250) NOT NULL,
    "uEmail" VARCHAR(250) NOT NULL,
    "password" VARCHAR(250) NOT NULL,
    "anAvatarId" INTEGER,
    role char
  
    CONSTRAINT fk_anavatar FOREIGN KEY ("anAvatarId")
        REFERENCES public."anAvatar" ("avatarId") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

--select
SELECT id, "uName", "uEmail", password, "anAvatarId"
	FROM public."Users";
--insert
INSERT INTO public."Users"(
	id, "uName", "uEmail", password, "anAvatarId")
	VALUES (?, ?, ?, ?, ?);
--update
UPDATE public."Users"
	SET id=?, "uName"=?, "uEmail"=?, password=?, "anAvatarId"=?
	WHERE <condition>;
--delete
DELETE FROM public."Users"
	WHERE <condition>;


-- Table: public.anAvatar

-- DROP TABLE IF EXISTS public."anAvatar";

CREATE TABLE IF NOT EXISTS public."anAvatar"
(
    "avatarId" SERIAL PRIMARY KEY,
    "hairColor" VARCHAR(10) NOT NULL,
    "eyeColor" VARCHAR(10) NOT NULL,
    "skinColor" VARCHAR NOT NULL,
    "eyeBrowType" VARCHAR,
    role char
);

--select
SELECT "avatarId", "hairColor", "eyeColor", "skinColor", "eyeBrowType"
    FROM public."anAvatar";
--insert
INSERT INTO public."anAvatar"(
	"avatarId", "hairColor", "eyeColor", "skinColor", "eyeBrowType")
	VALUES (?, ?, ?, ?, ?);
--update
UPDATE public."anAvatar"
	SET "avatarId"=?, "hairColor"=?, "eyeColor"=?, "skinColor"=?, "eyeBrowType"=?
	WHERE <condition>;
--delete
DELETE FROM public."anAvatar"
	WHERE <condition>;

    --to bachelor add the avatar as a jason so it doesn have to may columns, save the json as text in database.