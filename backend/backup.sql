--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: check_group_not_deleted(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_group_not_deleted() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF (SELECT is_deleted FROM groups WHERE group_id = NEW.group_id) THEN
        RAISE EXCEPTION 'Cannot insert or update records for a deleted group';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.check_group_not_deleted() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: debts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.debts (
    debt_id uuid DEFAULT gen_random_uuid() NOT NULL,
    transaction_id uuid NOT NULL,
    group_id bigint NOT NULL,
    lender_id integer NOT NULL,
    borrower_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'unresolved'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    sponsored boolean DEFAULT false,
    CONSTRAINT debts_amount_check CHECK ((amount >= (0)::numeric)),
    CONSTRAINT debts_status_check CHECK (((status)::text = ANY ((ARRAY['resolved'::character varying, 'unresolved'::character varying, 'in process'::character varying])::text[])))
);


ALTER TABLE public.debts OWNER TO postgres;

--
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    group_id bigint NOT NULL,
    name character varying(100) NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- Name: groups_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.groups ALTER COLUMN group_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.groups_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    transaction_id uuid DEFAULT gen_random_uuid() NOT NULL,
    group_id bigint NOT NULL,
    user_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    reason text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tag text,
    CONSTRAINT transactions_amount_check CHECK ((amount > (0)::numeric)),
    CONSTRAINT transactions_tag_check CHECK ((tag = ANY (ARRAY['accommodation'::text, 'dining'::text, 'transportation'::text, 'shopping'::text, 'entertainment'::text, 'miscellaneous'::text])))
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: user_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_groups (
    user_id integer NOT NULL,
    group_id bigint NOT NULL,
    total_spent numeric(10,2) DEFAULT 0.00,
    total_loaned numeric(10,2) DEFAULT 0.00,
    total_owed numeric(10,2) DEFAULT 0.00,
    joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    budget numeric(10,2) DEFAULT 0.00
);


ALTER TABLE public.user_groups OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN user_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: debts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.debts (debt_id, transaction_id, group_id, lender_id, borrower_id, amount, status, created_at, sponsored) FROM stdin;
a044add0-2959-4c29-96ec-3725c1a7db0c	e6263e32-a689-4bb8-ae32-01b43b706a12	2	2	1	2171.50	resolved	2025-03-22 22:58:03.750936	f
5f4411fb-ed29-4e27-acd3-281aabc2cac0	bc37a745-4c44-4a44-83a7-400ec60243f4	2	2	1	5.00	resolved	2025-03-22 13:01:15.737754	f
4ff22353-60ef-4c4d-b045-fc043dc222a0	c04ca22c-3087-4d03-8852-806946970b52	2	2	1	50.00	resolved	2025-03-22 22:57:21.897262	f
b4e15d9a-28dc-4a44-b5f8-f32b7ade924f	9897ce3d-f962-40cc-be6d-a5cb8018352b	2	2	1	1.00	resolved	2025-03-22 23:29:10.613321	f
1f0c91ed-8f40-4ea9-9efe-327b6cc53ef2	b715ed1b-1b3a-4e49-8536-5dd96338d5d8	2	2	1	25.00	resolved	2025-03-22 23:04:38.695589	f
4d2047f7-b4eb-4514-af6f-2a5c7bf65997	2ee810d1-8395-4738-be10-fa7687a90cce	2	2	1	10.00	resolved	2025-03-22 22:51:09.840241	f
3f938d50-54cf-48ca-98c5-8e9f150b01f5	31deb2c5-1594-4343-b135-54e70d5b13f6	2	2	1	0.00	unresolved	2025-03-24 18:55:44.782644	t
c68c2115-8859-4b71-aa1e-712ff6e4b7c4	a380d3f8-dfa8-446a-9f01-e838792be70a	2	2	1	0.00	unresolved	2025-03-25 20:41:18.375739	t
22dc688f-70f0-4b3e-a834-2638215044d3	26c2c186-f6dc-448b-941d-13fb3a4e6944	2	2	1	60.00	resolved	2025-03-25 20:40:24.492392	f
30660c8f-dffd-49d3-ad55-cd6212983a7b	a790dc84-ae59-40a0-80bf-07854ed3a883	2	2	1	50.00	resolved	2025-03-24 18:42:31.055328	f
91b8daca-2368-4f6e-8eca-e8fd419bd7f2	4fe627a6-f4ba-43d4-b3f2-c3fe98025fbc	2	2	1	5.00	in process	2025-03-28 11:49:43.669902	f
104dc0c4-bc98-47d8-9927-22fc5f57e2f7	9717a9b5-8dde-4a47-b34d-8ca0ff079e44	2	2	1	50.00	in process	2025-03-28 11:45:55.331892	f
0fe93016-ff8f-4c2f-9c85-bda012ab9211	b588bf2f-7631-468a-ae0b-f87386d66bc2	2	2	1	5.00	in process	2025-03-23 19:36:47.681133	f
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groups (group_id, name, created_by, created_at, is_deleted) FROM stdin;
2	Test1	2	2025-03-21 19:38:02.334961	f
3	Test 2	2	2025-03-21 23:52:44.140896	f
5	4	1	2025-03-23 19:41:04.029141	f
4	test 3	2	2025-03-23 19:40:37.406056	t
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (sid, sess, expire) FROM stdin;
eeAWBIWjU2v1bYTp0X7Zpi7qx7eaic3N	{"cookie":{"originalMaxAge":86400000,"expires":"2025-04-05T14:43:27.895Z","secure":false,"httpOnly":true,"path":"/"},"passport":{"user":2}}	2025-04-05 20:17:25
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (transaction_id, group_id, user_id, amount, reason, created_at, tag) FROM stdin;
b5b5a83a-faca-4bac-bfc8-6cb39572a32d	2	2	100.00	test1	2025-03-22 11:06:31.210121	\N
13491e5c-106c-456c-9071-4996a8179810	2	2	10.00	test2	2025-03-22 11:27:34.213581	\N
bc37a745-4c44-4a44-83a7-400ec60243f4	2	2	10.00	test 3	2025-03-22 13:01:15.737754	\N
2ee810d1-8395-4738-be10-fa7687a90cce	2	2	20.00	resolve test	2025-03-22 22:51:09.840241	\N
c04ca22c-3087-4d03-8852-806946970b52	2	2	100.00	test 4	2025-03-22 22:57:21.897262	\N
e6263e32-a689-4bb8-ae32-01b43b706a12	2	2	4343.00	3123	2025-03-22 22:58:03.750936	\N
b715ed1b-1b3a-4e49-8536-5dd96338d5d8	2	2	50.00	final	2025-03-22 23:04:38.695589	\N
9897ce3d-f962-40cc-be6d-a5cb8018352b	2	2	2.00	in process	2025-03-22 23:29:10.613321	\N
b588bf2f-7631-468a-ae0b-f87386d66bc2	2	2	10.00	sponsor	2025-03-23 19:36:47.681133	\N
a790dc84-ae59-40a0-80bf-07854ed3a883	2	2	100.00	sp test	2025-03-24 18:42:31.055328	\N
31deb2c5-1594-4343-b135-54e70d5b13f6	2	2	10.00	test5	2025-03-24 18:55:44.782644	\N
26c2c186-f6dc-448b-941d-13fb3a4e6944	2	2	120.00	total check	2025-03-25 20:40:24.492392	\N
a380d3f8-dfa8-446a-9f01-e838792be70a	2	2	40.00	total sponsor check	2025-03-25 20:41:18.375739	\N
9717a9b5-8dde-4a47-b34d-8ca0ff079e44	2	2	100.00	tag_check	2025-03-28 11:45:55.331892	accommodation
4fe627a6-f4ba-43d4-b3f2-c3fe98025fbc	2	2	10.00	tag_check2	2025-03-28 11:49:43.669902	dining
\.


--
-- Data for Name: user_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_groups (user_id, group_id, total_spent, total_loaned, total_owed, joined_at, budget) FROM stdin;
2	3	0.00	0.00	0.00	2025-03-21 23:52:44.144112	0.00
2	4	0.00	0.00	0.00	2025-03-23 19:40:37.409943	0.00
1	5	0.00	0.00	0.00	2025-03-23 19:41:04.031358	0.00
1	4	0.00	0.00	0.00	2025-03-23 19:41:07.487796	0.00
1	2	115.00	0.00	60.00	2025-03-21 23:26:39.842014	0.00
2	2	155.00	60.00	0.00	2025-03-21 19:38:02.34228	5000.00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, email, password, created_at) FROM stdin;
1	Ayush_Mishra	ashmishra2004@gmail.com	$2b$10$9M14tBOmYN7It1vBq3ghVelcdLzjaiaT/Q3MByIl/SXrIgabT6Bau	2025-03-09 18:14:48.616941
2	Admin	admin@gmail.com	$2b$10$qLA4gRzsHh0EiODIqfLB4u68c.nFv6A1xV7C2XI3RflZc02bq5iuC	2025-03-09 18:25:55.455887
\.


--
-- Name: groups_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.groups_group_id_seq', 5, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 2, true);


--
-- Name: debts debts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.debts
    ADD CONSTRAINT debts_pkey PRIMARY KEY (debt_id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (group_id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id);


--
-- Name: users unique_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- Name: users unique_username; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_username UNIQUE (username);


--
-- Name: user_groups user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_pkey PRIMARY KEY (user_id, group_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: debts prevent_insert_debts; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER prevent_insert_debts BEFORE INSERT OR UPDATE ON public.debts FOR EACH ROW EXECUTE FUNCTION public.check_group_not_deleted();


--
-- Name: transactions prevent_insert_transactions; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER prevent_insert_transactions BEFORE INSERT OR UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.check_group_not_deleted();


--
-- Name: user_groups prevent_insert_user_groups; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER prevent_insert_user_groups BEFORE INSERT OR UPDATE ON public.user_groups FOR EACH ROW EXECUTE FUNCTION public.check_group_not_deleted();


--
-- Name: debts debts_borrower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.debts
    ADD CONSTRAINT debts_borrower_id_fkey FOREIGN KEY (borrower_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: debts debts_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.debts
    ADD CONSTRAINT debts_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(group_id) ON DELETE CASCADE;


--
-- Name: debts debts_lender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.debts
    ADD CONSTRAINT debts_lender_id_fkey FOREIGN KEY (lender_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: debts debts_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.debts
    ADD CONSTRAINT debts_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(transaction_id) ON DELETE CASCADE;


--
-- Name: groups groups_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: transactions transactions_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(group_id) ON DELETE CASCADE;


--
-- Name: transactions transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: user_groups user_groups_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(group_id) ON DELETE CASCADE;


--
-- Name: user_groups user_groups_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

