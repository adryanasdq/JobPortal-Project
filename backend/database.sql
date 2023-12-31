PGDMP     3                     {            postgres    15.3    15.3     (           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            )           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            *           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            +           1262    5    postgres    DATABASE        CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
    DROP DATABASE postgres;
                postgres    false            ,           0    0    DATABASE postgres    COMMENT     N   COMMENT ON DATABASE postgres IS 'default administrative connection database';
                   postgres    false    3371                        2615    16398 	   portaljob    SCHEMA        CREATE SCHEMA portaljob;
    DROP SCHEMA portaljob;
                postgres    false            �            1259    16399    application    TABLE     �  CREATE TABLE portaljob.application (
    id integer NOT NULL,
    job_id integer NOT NULL,
    jobseeker_id integer NOT NULL,
    status character varying,
    cover_letter text,
    note character varying,
    CONSTRAINT application_status_check CHECK (((status)::text = ANY (ARRAY[('applied'::character varying)::text, ('accepted'::character varying)::text, ('rejected'::character varying)::text])))
);
 "   DROP TABLE portaljob.application;
    	   portaljob         heap    postgres    false    7            �            1259    16405    company    TABLE     �  CREATE TABLE portaljob.company (
    id integer NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    email character varying NOT NULL,
    name character varying NOT NULL,
    industry character varying,
    address character varying NOT NULL,
    website character varying,
    contact character varying NOT NULL,
    logo_url character varying,
    about text
);
    DROP TABLE portaljob.company;
    	   portaljob         heap    postgres    false    7            �            1259    16410 
   job_seeker    TABLE     �  CREATE TABLE portaljob.job_seeker (
    id integer NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    email character varying NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    age integer,
    gender character varying,
    education character varying,
    major character varying,
    contact character varying NOT NULL,
    address character varying NOT NULL,
    summary text,
    url_pict character varying,
    CONSTRAINT job_seeker_age_check CHECK ((age >= 0)),
    CONSTRAINT job_seeker_gender_check CHECK (((gender)::text = ANY (ARRAY[('L'::character varying)::text, ('P'::character varying)::text])))
);
 !   DROP TABLE portaljob.job_seeker;
    	   portaljob         heap    postgres    false    7            �            1259    16417    job_vacancy    TABLE       CREATE TABLE portaljob.job_vacancy (
    id integer NOT NULL,
    company_id integer,
    "position" character varying NOT NULL,
    location character varying,
    posted_on date NOT NULL,
    expired_on date NOT NULL,
    salary integer,
    description text,
    requirements text
);
 "   DROP TABLE portaljob.job_vacancy;
    	   portaljob         heap    postgres    false    7            "          0    16399    application 
   TABLE DATA           ^   COPY portaljob.application (id, job_id, jobseeker_id, status, cover_letter, note) FROM stdin;
 	   portaljob          postgres    false    216   �#       #          0    16405    company 
   TABLE DATA              COPY portaljob.company (id, username, password, email, name, industry, address, website, contact, logo_url, about) FROM stdin;
 	   portaljob          postgres    false    217   o%       $          0    16410 
   job_seeker 
   TABLE DATA           �   COPY portaljob.job_seeker (id, username, password, email, first_name, last_name, age, gender, education, major, contact, address, summary, url_pict) FROM stdin;
 	   portaljob          postgres    false    218   )       %          0    16417    job_vacancy 
   TABLE DATA           �   COPY portaljob.job_vacancy (id, company_id, "position", location, posted_on, expired_on, salary, description, requirements) FROM stdin;
 	   portaljob          postgres    false    219   �+       �           2606    16437    application application_pkey 
   CONSTRAINT     s   ALTER TABLE ONLY portaljob.application
    ADD CONSTRAINT application_pkey PRIMARY KEY (id, job_id, jobseeker_id);
 I   ALTER TABLE ONLY portaljob.application DROP CONSTRAINT application_pkey;
    	   portaljob            postgres    false    216    216    216            �           2606    16439    company company_contact_key 
   CONSTRAINT     \   ALTER TABLE ONLY portaljob.company
    ADD CONSTRAINT company_contact_key UNIQUE (contact);
 H   ALTER TABLE ONLY portaljob.company DROP CONSTRAINT company_contact_key;
    	   portaljob            postgres    false    217            �           2606    16441    company company_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY portaljob.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (id);
 A   ALTER TABLE ONLY portaljob.company DROP CONSTRAINT company_pkey;
    	   portaljob            postgres    false    217            �           2606    16443    company company_username_key 
   CONSTRAINT     ^   ALTER TABLE ONLY portaljob.company
    ADD CONSTRAINT company_username_key UNIQUE (username);
 I   ALTER TABLE ONLY portaljob.company DROP CONSTRAINT company_username_key;
    	   portaljob            postgres    false    217            �           2606    16445 !   job_seeker job_seeker_contact_key 
   CONSTRAINT     b   ALTER TABLE ONLY portaljob.job_seeker
    ADD CONSTRAINT job_seeker_contact_key UNIQUE (contact);
 N   ALTER TABLE ONLY portaljob.job_seeker DROP CONSTRAINT job_seeker_contact_key;
    	   portaljob            postgres    false    218            �           2606    16447    job_seeker job_seeker_email_key 
   CONSTRAINT     ^   ALTER TABLE ONLY portaljob.job_seeker
    ADD CONSTRAINT job_seeker_email_key UNIQUE (email);
 L   ALTER TABLE ONLY portaljob.job_seeker DROP CONSTRAINT job_seeker_email_key;
    	   portaljob            postgres    false    218            �           2606    16449    job_seeker job_seeker_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY portaljob.job_seeker
    ADD CONSTRAINT job_seeker_pkey PRIMARY KEY (id);
 G   ALTER TABLE ONLY portaljob.job_seeker DROP CONSTRAINT job_seeker_pkey;
    	   portaljob            postgres    false    218            �           2606    16451 "   job_seeker job_seeker_username_key 
   CONSTRAINT     d   ALTER TABLE ONLY portaljob.job_seeker
    ADD CONSTRAINT job_seeker_username_key UNIQUE (username);
 O   ALTER TABLE ONLY portaljob.job_seeker DROP CONSTRAINT job_seeker_username_key;
    	   portaljob            postgres    false    218            �           2606    16453    job_vacancy job_vacancy_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY portaljob.job_vacancy
    ADD CONSTRAINT job_vacancy_pkey PRIMARY KEY (id);
 I   ALTER TABLE ONLY portaljob.job_vacancy DROP CONSTRAINT job_vacancy_pkey;
    	   portaljob            postgres    false    219            �           2606    16462 #   application application_job_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY portaljob.application
    ADD CONSTRAINT application_job_id_fkey FOREIGN KEY (job_id) REFERENCES portaljob.job_vacancy(id);
 P   ALTER TABLE ONLY portaljob.application DROP CONSTRAINT application_job_id_fkey;
    	   portaljob          postgres    false    219    3216    216            �           2606    16467 )   application application_jobseeker_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY portaljob.application
    ADD CONSTRAINT application_jobseeker_id_fkey FOREIGN KEY (jobseeker_id) REFERENCES portaljob.job_seeker(id);
 V   ALTER TABLE ONLY portaljob.application DROP CONSTRAINT application_jobseeker_id_fkey;
    	   portaljob          postgres    false    216    218    3212            �           2606    16472 '   job_vacancy job_vacancy_company_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY portaljob.job_vacancy
    ADD CONSTRAINT job_vacancy_company_id_fkey FOREIGN KEY (company_id) REFERENCES portaljob.company(id);
 T   ALTER TABLE ONLY portaljob.job_vacancy DROP CONSTRAINT job_vacancy_company_id_fkey;
    	   portaljob          postgres    false    3204    219    217            "   �  x����N�0���S�	P����V��.��J�v�(��x{ƍE��$���N&�u9�3���E}oX����Y9��Ȅ�T	�@�M�&��gR��Ƀ��NHI���)RG�LHI��ȐAs�u3Xd�۩~z$�}�:�c��:�sy�y����lG��dE%F�{����Hl�����@홌`;����˘VuS�i6F|���������c���VZ����㈇�Ore���ʽҙD\�5��hYl�F&7���"�A��)��i��aT���~U�L��y���� �X��=�;η��{�L��B˫���'���*H�	���J��F��Xh5�1�Ñ�{��<�"E��5l�~R.,�-یgᔦ�+��b�$��D��r2�WD��ֺ4�߶֯���n6�}>�H�      #   �  x�u��n�6E����p\;�-�o�b�h]4� }S#�6E�$e����CZv�6`K�h4<��l7�&���׋�Ç�����ʊ�k���3=�-� �a��Q�������%��\�|�n���m����$_茶�&"'�&ʃ�PRRgŵ+
]'�������GY��M�:�s�;�����#��Ib�w��CyL+2sF=����P3����y����6���z|�]�qA2N�$Q������=�2�����9�\o�����wN��s�:|p�?7��c��va��l
�����Ô2*N�.��(G�n��_�+-u���/'���tCqws����/��0��Z� ����8��r��u2��L)��ʪc�L/	q]�[�)t��PZ�O]�#W�[ݪB��h�r�P�np�F��hN�l��R�H�7�pDq��P0J���%�m>�I����h�찴&(�����.�7�.�~߬����'����x]�4�N|fͰ����bn��S�rɦj�O��`���	!^�	GhmFW��Q�C|�Y�U?��y8�Y	�p[;��X<���lxw.��*�"kU���Ѷ��
���ꔨ/j!aLB^�M�
�͙G�-�7�����'4�Y1�X�^oA�y�}�|�,Y��K�F3��`��{�v�����j;��+P�#�$�������O�𜎒���9;'��Z���2X�T7t׻���z���ڇ9z9'B@����@X0O�@�cJY~lZ12bH\/n4���%�OQ՚��͛ 5�䏏���uS1.�C�NKEy*�b:a���'m [�:Y���0Mu�h4X�pu����u�H��@��T�p];��˘B��n��k;h�\y�!���̥�WtdԠ�t�G񵦻��www�U]�D      $   �  x��U�r�0>��B�q-�����N��L2=���A��߾�Id׽ǘ���]�J�L�0��|�I�H��v]�=�zV3{}��oʢ,�֣���uw��Fe���J7;R�8{_8�)�t�GuC���}�H��NӔ~�f-NlĠ�67���ȮѢel`�DN��b�"HQ�@|� �]��!�I�{�V���_<���3�j-? .b�X�
��mõ	��2�:s#���\�F. �A�: �ˌvY�m��< �Q;����[���Wp�@	R4���A��|�"��,Z�;t��IÓ>9��/�u�^P�l�S\8Ѓ����4�3ˀ
����3b߷J��ZIZ�x�@�!?�;���>`���9��{I<�a� �<B�*���K�$tO�?0z��܊�J+S)��%z�����%�[�� �,z����z����o{{'0��;5��7��&Ǿ�o�����Z��[7L<
ŢV-^t�t@d�U��;%�aҽ`[5z�+��b5{��o������4^�!�=�.߅�XĨ �ůoD$k�f]��J���s� ����[Y�����:T�v���eI��'��&A���U¨j�]<��_z��؅�;���6����/�<X-M�v1;e|����١#�t0�KF۳�o��V��K�I����p"��y�	n�&����?����<D�I��+�z���z�Z�{�d�      %   �  x�͖MS�H���WLN�V�ml��C%[��br˥���G3��01�>=#YNl�ڪ���,c�����U�fIF͝6�߰� ��||������r~��I6M�Or�\7Ȁ}D��%�l�nO�tJ��d�(��$W�
��c�>���Q�Ԇ!��@���6��� 2]�O̠�k��4~F�I�`<_�����!��t�&��eN3W#CUF�|�FT��}N���ٕ�Pօ7/4kF�ɸkVr-E/`3b�FT��w�6F?�gy�ݵ���D�&�a�f�2&=���XU1��"w��VvĴBf�-5�o��c���r��	?!�8��\{�@��I؁�,$(��7�h�)��PD���tA��d�s�֞%�qG<��kCy;v�@n���Z�o@���!<��1lZ���wb�\�Ї��f�8!���	>�+����.I%0ݢ:lh<�3qKӡ�-�"2o$����^>�_�a2㩆��8�Pb�JCH˞��i�bn�F�eX�M��M��ߠ�aγ�^���v]�P�	�i�_��|���nilE<����#�Hh���]��C�$�;x:����ӹ�/h�7/)�V�.���������!�2c�V���-�0㈹�RZA{qM�ݾ�������G/d A$n�
2�_��
����Ƕ5�N��Q�u���k�6�"1�N�:��4�v��7��a$���o�f�1���{�K/b��L�-��k}�]Ba[T6��i�,7�
����N�F�eA"�f2T@}*F�����
	V7
�f�e4FHN�$���eݣD4������,�Z	K
ڄ��(�����+�/��vr%��^�)?��ع��H���^ѩ�V�����n6�e�:���9����V���]����ugL�xWSIt�~ϩmVeh>w�1��/®v�RG����~��U罞J��SpZi��ʃ��	�:�=��vvrr��K�^     