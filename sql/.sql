/* create an object in javascript that contains the different statements */

-- Table: public.Users

-- DROP TABLE IF EXISTS public."Users";

CREATE TABLE IF NOT EXISTS public."Users"
(
    id integer NOT NULL DEFAULT nextval('"Users_id_seq"'::regclass),
    "uName" character varying(250) COLLATE pg_catalog."default" NOT NULL,
    "uEmail" character varying(250) COLLATE pg_catalog."default" NOT NULL,
    password character varying(250) COLLATE pg_catalog."default" NOT NULL,
    "anAvatarId" integer,
    CONSTRAINT "Users_pkey" PRIMARY KEY (id),
    CONSTRAINT fk_anavatar FOREIGN KEY ("anAvatarId")
        REFERENCES public."anAvatar" ("avatarId") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Users"
    OWNER to postgres;

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
    "avatarId" integer NOT NULL DEFAULT nextval('"anAvatar_avatarId_seq"'::regclass),
    "hairColor" character varying(10) COLLATE pg_catalog."default" NOT NULL,
    "eyeColor" character varying(10) COLLATE pg_catalog."default" NOT NULL,
    "skinColor" character varying COLLATE pg_catalog."default" NOT NULL,
    "eyeBrowType" character varying COLLATE pg_catalog."default",
    CONSTRAINT "anAvatar_pkey" PRIMARY KEY ("avatarId")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."anAvatar"
    OWNER to postgres;

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