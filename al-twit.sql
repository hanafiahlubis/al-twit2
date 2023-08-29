create database al_twit;

create table akun(
	id serial primary key,
	username text,
	full_name text,
	email text,
	password text,
	join_date timestamp
);

create table post_al(
	id serial primary key,
	id_user int ,
	content text ,
	media text,
	time_now timestamp,
	id_retweet int, 
	isi text
);
	
alter table post_al  add id_user_retweet int;
ALTER TABLE post_al ADD CONSTRAINT abc FOREIGN KEY (id_user_retweet) REFERENCES  akun(id);


create table suka(
	id serial primary key,
	id_user int ,
	id_post int,
	chek bool,
		CONSTRAINT fk_id_user4 FOREIGN KEY(id_user) REFERENCES akun(id) ON DELETE cascade,
		CONSTRAINT fk_post_al FOREIGN KEY(id_post) REFERENCES post_al(id) ON DELETE cascade
);


ALTER TABLE post_al ADD CONSTRAINT fk_user FOREIGN KEY (id_user) REFERENCES akun (id);
ALTER TABLE post_al ADD CONSTRAINT fk_bagi FOREIGN KEY (id_retweet) REFERENCES  post_al(id);

select * from akun
create table commentar(
	id serial primary key,
	id_pos int ,
	id_user int ,
	content text,
	time_now timestamp,
		CONSTRAINT fk_post FOREIGN KEY (id_pos) REFERENCES post_al (id),
		CONSTRAINT a_user FOREIGN KEY (id_user) REFERENCES akun(id)
);


create table follower(
	id serial primary key, 
	id_user int,
	id_user_to int ,
	time_now timestamp,
		CONSTRAINT fkk_user FOREIGN KEY (id_user) REFERENCES akun (id),
		CONSTRAINT fkkk_user FOREIGN KEY (id_user_to) REFERENCES akun (id)
);