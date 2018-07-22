--
-- PostgreSQL database dump
--

-- Started on 2010-02-12 15:50:47 BRST

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 1585 (class 1259 OID 23109)
-- Dependencies: 3
-- Name: scm_config; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_config (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    value text,
    type character varying(255),
    system boolean
);


ALTER TABLE public.scm_config OWNER TO khronos;

--
-- TOC entry 1587 (class 1259 OID 23119)
-- Dependencies: 3
-- Name: scm_empresa; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_empresa (
    id integer NOT NULL,
    nm_empresa character varying(45) NOT NULL
);


ALTER TABLE public.scm_empresa OWNER TO khronos;

--
-- TOC entry 1586 (class 1259 OID 23117)
-- Dependencies: 1587 3
-- Name: scm_empresa_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_empresa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_empresa_id_seq OWNER TO khronos;

--
-- TOC entry 2113 (class 0 OID 0)
-- Dependencies: 1586
-- Name: scm_empresa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_empresa_id_seq OWNED BY scm_empresa.id;


--
-- TOC entry 2114 (class 0 OID 0)
-- Dependencies: 1586
-- Name: scm_empresa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_empresa_id_seq', 1, true);


--
-- TOC entry 1589 (class 1259 OID 23127)
-- Dependencies: 3
-- Name: scm_fatura_doc; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_fatura_doc (
    id integer NOT NULL,
    id_fatura_doc_status integer,
    dt_fatura timestamp without time zone NOT NULL,
    id_origem integer NOT NULL,
    id_filial integer NOT NULL,
    id_local integer NOT NULL,
    id_parceiro integer,
    id_usuario integer NOT NULL,
    dt_sistema timestamp without time zone NOT NULL
);


ALTER TABLE public.scm_fatura_doc OWNER TO khronos;

--
-- TOC entry 1588 (class 1259 OID 23125)
-- Dependencies: 3 1589
-- Name: scm_fatura_doc_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_fatura_doc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_fatura_doc_id_seq OWNER TO khronos;

--
-- TOC entry 2115 (class 0 OID 0)
-- Dependencies: 1588
-- Name: scm_fatura_doc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_fatura_doc_id_seq OWNED BY scm_fatura_doc.id;


--
-- TOC entry 2116 (class 0 OID 0)
-- Dependencies: 1588
-- Name: scm_fatura_doc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_fatura_doc_id_seq', 1, false);


--
-- TOC entry 1590 (class 1259 OID 23133)
-- Dependencies: 3
-- Name: scm_fatura_doc_status; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_fatura_doc_status (
    id integer NOT NULL,
    nm_fatura_doc_status character varying(255) NOT NULL
);


ALTER TABLE public.scm_fatura_doc_status OWNER TO khronos;

--
-- TOC entry 1592 (class 1259 OID 23140)
-- Dependencies: 3
-- Name: scm_fatura_excecao; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_fatura_excecao (
    id integer NOT NULL,
    id_fatura_doc integer NOT NULL,
    id_maquina integer NOT NULL,
    id_fatura_excecao_tipo integer NOT NULL
);


ALTER TABLE public.scm_fatura_excecao OWNER TO khronos;

--
-- TOC entry 1591 (class 1259 OID 23138)
-- Dependencies: 3 1592
-- Name: scm_fatura_excecao_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_fatura_excecao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_fatura_excecao_id_seq OWNER TO khronos;

--
-- TOC entry 2117 (class 0 OID 0)
-- Dependencies: 1591
-- Name: scm_fatura_excecao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_fatura_excecao_id_seq OWNED BY scm_fatura_excecao.id;


--
-- TOC entry 2118 (class 0 OID 0)
-- Dependencies: 1591
-- Name: scm_fatura_excecao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_fatura_excecao_id_seq', 1, false);


--
-- TOC entry 1593 (class 1259 OID 23146)
-- Dependencies: 3
-- Name: scm_fatura_excecao_tipo; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_fatura_excecao_tipo (
    id integer NOT NULL,
    nm_fatura_excecao_tipo character varying(255) NOT NULL
);


ALTER TABLE public.scm_fatura_excecao_tipo OWNER TO khronos;

--
-- TOC entry 1595 (class 1259 OID 23153)
-- Dependencies: 3
-- Name: scm_fatura_item; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_fatura_item (
    id integer NOT NULL,
    id_fatura_doc integer NOT NULL,
    vl_credito numeric(10,2) NOT NULL,
    id_maquina integer NOT NULL,
    id_jogo integer NOT NULL,
    id_gabinete integer NOT NULL,
    id_protocolo integer NOT NULL,
    id_moeda integer NOT NULL,
    nr_cont_1 bigint,
    nr_cont_2 bigint,
    nr_cont_3 bigint,
    nr_cont_4 bigint,
    nr_cont_5 bigint,
    nr_cont_6 bigint,
    nr_cont_1_ant bigint,
    nr_cont_2_ant bigint,
    nr_cont_3_ant bigint,
    nr_cont_4_ant bigint,
    nr_cont_5_ant bigint,
    nr_cont_6_ant bigint,
    nr_dif_cont_1 bigint,
    nr_dif_cont_2 bigint,
    nr_dif_cont_3 bigint,
    nr_dif_cont_4 bigint,
    nr_dif_cont_5 bigint,
    nr_dif_cont_6 bigint,
    vl_diff_cont_1 numeric(10,2),
    vl_diff_cont_2 numeric(10,2),
    vl_diff_cont_3 numeric(10,2),
    vl_diff_cont_4 numeric(10,2),
    vl_diff_cont_5 numeric(10,2),
    vl_diff_cont_6 numeric(10,2)
);


ALTER TABLE public.scm_fatura_item OWNER TO khronos;

--
-- TOC entry 1594 (class 1259 OID 23151)
-- Dependencies: 3 1595
-- Name: scm_fatura_item_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_fatura_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_fatura_item_id_seq OWNER TO khronos;

--
-- TOC entry 2119 (class 0 OID 0)
-- Dependencies: 1594
-- Name: scm_fatura_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_fatura_item_id_seq OWNED BY scm_fatura_item.id;


--
-- TOC entry 2120 (class 0 OID 0)
-- Dependencies: 1594
-- Name: scm_fatura_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_fatura_item_id_seq', 1, false);


--
-- TOC entry 1597 (class 1259 OID 23161)
-- Dependencies: 3
-- Name: scm_fatura_tipo_excecao; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_fatura_tipo_excecao (
    id integer NOT NULL,
    nm_fatura_tipo_excecao character varying(255) NOT NULL
);


ALTER TABLE public.scm_fatura_tipo_excecao OWNER TO khronos;

--
-- TOC entry 1596 (class 1259 OID 23159)
-- Dependencies: 3 1597
-- Name: scm_fatura_tipo_excecao_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_fatura_tipo_excecao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_fatura_tipo_excecao_id_seq OWNER TO khronos;

--
-- TOC entry 2121 (class 0 OID 0)
-- Dependencies: 1596
-- Name: scm_fatura_tipo_excecao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_fatura_tipo_excecao_id_seq OWNED BY scm_fatura_tipo_excecao.id;


--
-- TOC entry 2122 (class 0 OID 0)
-- Dependencies: 1596
-- Name: scm_fatura_tipo_excecao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_fatura_tipo_excecao_id_seq', 1, false);


--
-- TOC entry 1599 (class 1259 OID 23169)
-- Dependencies: 3
-- Name: scm_filial; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_filial (
    id integer NOT NULL,
    id_empresa integer NOT NULL,
    nm_filial character varying(45) NOT NULL
);


ALTER TABLE public.scm_filial OWNER TO khronos;

--
-- TOC entry 1598 (class 1259 OID 23167)
-- Dependencies: 1599 3
-- Name: scm_filial_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_filial_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_filial_id_seq OWNER TO khronos;

--
-- TOC entry 2123 (class 0 OID 0)
-- Dependencies: 1598
-- Name: scm_filial_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_filial_id_seq OWNED BY scm_filial.id;


--
-- TOC entry 2124 (class 0 OID 0)
-- Dependencies: 1598
-- Name: scm_filial_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_filial_id_seq', 1, true);


--
-- TOC entry 1601 (class 1259 OID 23177)
-- Dependencies: 3
-- Name: scm_gabinete; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_gabinete (
    id integer NOT NULL,
    nm_gabinete character varying(45) NOT NULL
);


ALTER TABLE public.scm_gabinete OWNER TO khronos;

--
-- TOC entry 1600 (class 1259 OID 23175)
-- Dependencies: 3 1601
-- Name: scm_gabinete_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_gabinete_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_gabinete_id_seq OWNER TO khronos;

--
-- TOC entry 2125 (class 0 OID 0)
-- Dependencies: 1600
-- Name: scm_gabinete_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_gabinete_id_seq OWNED BY scm_gabinete.id;


--
-- TOC entry 2126 (class 0 OID 0)
-- Dependencies: 1600
-- Name: scm_gabinete_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_gabinete_id_seq', 1, true);


--
-- TOC entry 1603 (class 1259 OID 23185)
-- Dependencies: 3
-- Name: scm_group; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_group (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.scm_group OWNER TO khronos;

--
-- TOC entry 1602 (class 1259 OID 23183)
-- Dependencies: 3 1603
-- Name: scm_group_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_group_id_seq OWNER TO khronos;

--
-- TOC entry 2127 (class 0 OID 0)
-- Dependencies: 1602
-- Name: scm_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_group_id_seq OWNED BY scm_group.id;


--
-- TOC entry 2128 (class 0 OID 0)
-- Dependencies: 1602
-- Name: scm_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_group_id_seq', 4, true);


--
-- TOC entry 1604 (class 1259 OID 23191)
-- Dependencies: 3
-- Name: scm_group_rule; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_group_rule (
    group_id integer NOT NULL,
    rule_id integer NOT NULL
);


ALTER TABLE public.scm_group_rule OWNER TO khronos;

--
-- TOC entry 1606 (class 1259 OID 23198)
-- Dependencies: 3
-- Name: scm_historico_status; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_historico_status (
    id integer NOT NULL,
    dt_status timestamp without time zone NOT NULL,
    id_status integer NOT NULL,
    id_maquina integer NOT NULL,
    id_filial integer NOT NULL,
    id_local integer NOT NULL,
    id_parceiro integer,
    id_usuario integer,
    dt_sistema timestamp without time zone NOT NULL
);


ALTER TABLE public.scm_historico_status OWNER TO khronos;

--
-- TOC entry 1605 (class 1259 OID 23196)
-- Dependencies: 1606 3
-- Name: scm_historico_status_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_historico_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_historico_status_id_seq OWNER TO khronos;

--
-- TOC entry 2129 (class 0 OID 0)
-- Dependencies: 1605
-- Name: scm_historico_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_historico_status_id_seq OWNED BY scm_historico_status.id;


--
-- TOC entry 2130 (class 0 OID 0)
-- Dependencies: 1605
-- Name: scm_historico_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_historico_status_id_seq', 1, false);


--
-- TOC entry 1608 (class 1259 OID 23206)
-- Dependencies: 3
-- Name: scm_jogo; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_jogo (
    id integer NOT NULL,
    nm_jogo character varying(45) NOT NULL
);


ALTER TABLE public.scm_jogo OWNER TO khronos;

--
-- TOC entry 1607 (class 1259 OID 23204)
-- Dependencies: 3 1608
-- Name: scm_jogo_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_jogo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_jogo_id_seq OWNER TO khronos;

--
-- TOC entry 2131 (class 0 OID 0)
-- Dependencies: 1607
-- Name: scm_jogo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_jogo_id_seq OWNED BY scm_jogo.id;


--
-- TOC entry 2132 (class 0 OID 0)
-- Dependencies: 1607
-- Name: scm_jogo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_jogo_id_seq', 5, true);


--
-- TOC entry 1610 (class 1259 OID 23214)
-- Dependencies: 1932 3
-- Name: scm_local; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_local (
    id integer NOT NULL,
    nm_local character varying(45) NOT NULL,
    tp_local integer NOT NULL,
    fl_portal smallint DEFAULT 0 NOT NULL,
    user_portal character varying(50),
    pass_portal character varying(20)
);


ALTER TABLE public.scm_local OWNER TO khronos;

--
-- TOC entry 1609 (class 1259 OID 23212)
-- Dependencies: 3 1610
-- Name: scm_local_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_local_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_local_id_seq OWNER TO khronos;

--
-- TOC entry 2133 (class 0 OID 0)
-- Dependencies: 1609
-- Name: scm_local_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_local_id_seq OWNED BY scm_local.id;


--
-- TOC entry 2134 (class 0 OID 0)
-- Dependencies: 1609
-- Name: scm_local_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_local_id_seq', 2, true);


--
-- TOC entry 1612 (class 1259 OID 23223)
-- Dependencies: 3
-- Name: scm_local_server; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_local_server (
    id integer NOT NULL,
    id_local integer NOT NULL,
    ip_server character varying(255),
    id_protocolo integer,
    num_port bigint NOT NULL,
    timeout bigint NOT NULL
);


ALTER TABLE public.scm_local_server OWNER TO khronos;

--
-- TOC entry 1611 (class 1259 OID 23221)
-- Dependencies: 3 1612
-- Name: scm_local_server_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_local_server_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_local_server_id_seq OWNER TO khronos;

--
-- TOC entry 2135 (class 0 OID 0)
-- Dependencies: 1611
-- Name: scm_local_server_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_local_server_id_seq OWNED BY scm_local_server.id;


--
-- TOC entry 2136 (class 0 OID 0)
-- Dependencies: 1611
-- Name: scm_local_server_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_local_server_id_seq', 2, true);


--
-- TOC entry 1614 (class 1259 OID 23231)
-- Dependencies: 3
-- Name: scm_maquina; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_maquina (
    id integer NOT NULL,
    nr_serie_imob character varying(45) NOT NULL,
    nr_serie_connect character varying(45),
    nr_serie_aux character varying(45),
    dt_ultima_movimentacao timestamp without time zone,
    dt_ultima_transformacao timestamp without time zone,
    dt_ultimo_faturamento timestamp without time zone,
    dt_ultima_regularizacao timestamp without time zone,
    dt_ultimo_status timestamp without time zone,
    dt_cadastro timestamp without time zone NOT NULL,
    dt_sistema timestamp without time zone NOT NULL,
    id_usuario integer NOT NULL,
    id_protocolo integer NOT NULL,
    id_filial integer NOT NULL,
    id_local integer,
    id_status integer NOT NULL,
    id_jogo integer NOT NULL,
    nr_versao_jogo character varying(45),
    vl_credito numeric(10,2) NOT NULL,
    id_gabinete integer NOT NULL,
    nr_cont_1 integer,
    nr_cont_2 integer,
    nr_cont_3 integer,
    nr_cont_4 integer,
    nr_cont_5 integer,
    nr_cont_6 integer,
    nr_cont_1_parcial integer,
    nr_cont_2_parcial integer,
    nr_cont_3_parcial integer,
    nr_cont_4_parcial integer,
    nr_cont_5_parcial integer,
    nr_cont_6_parcial integer,
    id_moeda integer NOT NULL,
    id_parceiro integer
);


ALTER TABLE public.scm_maquina OWNER TO khronos;

--
-- TOC entry 1613 (class 1259 OID 23229)
-- Dependencies: 1614 3
-- Name: scm_maquina_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_maquina_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_maquina_id_seq OWNER TO khronos;

--
-- TOC entry 2137 (class 0 OID 0)
-- Dependencies: 1613
-- Name: scm_maquina_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_maquina_id_seq OWNED BY scm_maquina.id;


--
-- TOC entry 2138 (class 0 OID 0)
-- Dependencies: 1613
-- Name: scm_maquina_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_maquina_id_seq', 1, false);


--
-- TOC entry 1616 (class 1259 OID 23241)
-- Dependencies: 3
-- Name: scm_module; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_module (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.scm_module OWNER TO khronos;

--
-- TOC entry 1615 (class 1259 OID 23239)
-- Dependencies: 1616 3
-- Name: scm_module_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_module_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_module_id_seq OWNER TO khronos;

--
-- TOC entry 2139 (class 0 OID 0)
-- Dependencies: 1615
-- Name: scm_module_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_module_id_seq OWNED BY scm_module.id;


--
-- TOC entry 2140 (class 0 OID 0)
-- Dependencies: 1615
-- Name: scm_module_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_module_id_seq', 6, true);


--
-- TOC entry 1618 (class 1259 OID 23249)
-- Dependencies: 3
-- Name: scm_moeda; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_moeda (
    id integer NOT NULL,
    nm_moeda character varying(255) NOT NULL,
    simbolo_moeda character varying(255) NOT NULL
);


ALTER TABLE public.scm_moeda OWNER TO khronos;

--
-- TOC entry 1617 (class 1259 OID 23247)
-- Dependencies: 3 1618
-- Name: scm_moeda_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_moeda_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_moeda_id_seq OWNER TO khronos;

--
-- TOC entry 2141 (class 0 OID 0)
-- Dependencies: 1617
-- Name: scm_moeda_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_moeda_id_seq OWNED BY scm_moeda.id;


--
-- TOC entry 2142 (class 0 OID 0)
-- Dependencies: 1617
-- Name: scm_moeda_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_moeda_id_seq', 2, true);


--
-- TOC entry 1620 (class 1259 OID 23260)
-- Dependencies: 3
-- Name: scm_movimentacao_doc; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_movimentacao_doc (
    id integer NOT NULL,
    id_origem bigint,
    dt_movimentacao timestamp without time zone NOT NULL,
    id_filial integer NOT NULL,
    id_local integer NOT NULL,
    id_parceiro integer,
    id_usuario integer NOT NULL,
    dt_sistema timestamp without time zone NOT NULL,
    tp_movimento character varying(1) NOT NULL
);


ALTER TABLE public.scm_movimentacao_doc OWNER TO khronos;

--
-- TOC entry 1619 (class 1259 OID 23258)
-- Dependencies: 3 1620
-- Name: scm_movimentacao_doc_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_movimentacao_doc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_movimentacao_doc_id_seq OWNER TO khronos;

--
-- TOC entry 2143 (class 0 OID 0)
-- Dependencies: 1619
-- Name: scm_movimentacao_doc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_movimentacao_doc_id_seq OWNED BY scm_movimentacao_doc.id;


--
-- TOC entry 2144 (class 0 OID 0)
-- Dependencies: 1619
-- Name: scm_movimentacao_doc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_movimentacao_doc_id_seq', 1, false);


--
-- TOC entry 1622 (class 1259 OID 23268)
-- Dependencies: 3
-- Name: scm_movimentacao_item; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_movimentacao_item (
    id integer NOT NULL,
    id_movimentacao_doc integer,
    id_maquina integer NOT NULL,
    fl_cont_manual boolean,
    nr_cont_1 integer,
    nr_cont_2 integer,
    nr_cont_3 integer,
    nr_cont_4 integer,
    nr_cont_5 integer,
    nr_cont_6 integer
);


ALTER TABLE public.scm_movimentacao_item OWNER TO khronos;

--
-- TOC entry 1621 (class 1259 OID 23266)
-- Dependencies: 3 1622
-- Name: scm_movimentacao_item_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_movimentacao_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_movimentacao_item_id_seq OWNER TO khronos;

--
-- TOC entry 2145 (class 0 OID 0)
-- Dependencies: 1621
-- Name: scm_movimentacao_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_movimentacao_item_id_seq OWNED BY scm_movimentacao_item.id;


--
-- TOC entry 2146 (class 0 OID 0)
-- Dependencies: 1621
-- Name: scm_movimentacao_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_movimentacao_item_id_seq', 1, false);


--
-- TOC entry 1624 (class 1259 OID 23276)
-- Dependencies: 3
-- Name: scm_parceiro; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_parceiro (
    id integer NOT NULL,
    nm_parceiro character varying(255) NOT NULL,
    id_empresa integer NOT NULL
);


ALTER TABLE public.scm_parceiro OWNER TO khronos;

--
-- TOC entry 1623 (class 1259 OID 23274)
-- Dependencies: 3 1624
-- Name: scm_parceiro_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_parceiro_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_parceiro_id_seq OWNER TO khronos;

--
-- TOC entry 2147 (class 0 OID 0)
-- Dependencies: 1623
-- Name: scm_parceiro_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_parceiro_id_seq OWNED BY scm_parceiro.id;


--
-- TOC entry 2148 (class 0 OID 0)
-- Dependencies: 1623
-- Name: scm_parceiro_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_parceiro_id_seq', 1, false);


--
-- TOC entry 1626 (class 1259 OID 23284)
-- Dependencies: 3
-- Name: scm_protocolo; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_protocolo (
    id integer NOT NULL,
    nm_protocolo character varying(255) NOT NULL
);


ALTER TABLE public.scm_protocolo OWNER TO khronos;

--
-- TOC entry 1625 (class 1259 OID 23282)
-- Dependencies: 1626 3
-- Name: scm_protocolo_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_protocolo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_protocolo_id_seq OWNER TO khronos;

--
-- TOC entry 2149 (class 0 OID 0)
-- Dependencies: 1625
-- Name: scm_protocolo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_protocolo_id_seq OWNED BY scm_protocolo.id;


--
-- TOC entry 2150 (class 0 OID 0)
-- Dependencies: 1625
-- Name: scm_protocolo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_protocolo_id_seq', 2, true);


--
-- TOC entry 1628 (class 1259 OID 23292)
-- Dependencies: 3
-- Name: scm_regularizacao_doc; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_regularizacao_doc (
    id bigint NOT NULL,
    dt_regularizacao timestamp without time zone NOT NULL,
    ds_motivo character varying(255) NOT NULL,
    tp_regularizacao character varying(1) NOT NULL,
    id_filial integer NOT NULL,
    id_local integer NOT NULL,
    id_parceiro integer,
    id_usuario integer NOT NULL,
    dt_sistema timestamp without time zone NOT NULL
);


ALTER TABLE public.scm_regularizacao_doc OWNER TO khronos;

--
-- TOC entry 1627 (class 1259 OID 23290)
-- Dependencies: 1628 3
-- Name: scm_regularizacao_doc_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_regularizacao_doc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_regularizacao_doc_id_seq OWNER TO khronos;

--
-- TOC entry 2151 (class 0 OID 0)
-- Dependencies: 1627
-- Name: scm_regularizacao_doc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_regularizacao_doc_id_seq OWNED BY scm_regularizacao_doc.id;


--
-- TOC entry 2152 (class 0 OID 0)
-- Dependencies: 1627
-- Name: scm_regularizacao_doc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_regularizacao_doc_id_seq', 1, false);


--
-- TOC entry 1630 (class 1259 OID 23300)
-- Dependencies: 3
-- Name: scm_regularizacao_item; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_regularizacao_item (
    id bigint NOT NULL,
    id_regularizacao_doc bigint NOT NULL,
    id_maquina integer NOT NULL,
    nr_cont_1 integer,
    nr_cont_2 integer,
    nr_cont_3 integer,
    nr_cont_4 integer,
    nr_cont_5 integer,
    nr_cont_6 integer,
    nr_cont_1_ant integer,
    nr_cont_2_ant integer,
    nr_cont_3_ant integer,
    nr_cont_4_ant integer,
    nr_cont_5_ant integer,
    nr_cont_6_ant integer
);


ALTER TABLE public.scm_regularizacao_item OWNER TO khronos;

--
-- TOC entry 1629 (class 1259 OID 23298)
-- Dependencies: 3 1630
-- Name: scm_regularizacao_item_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_regularizacao_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_regularizacao_item_id_seq OWNER TO khronos;

--
-- TOC entry 2153 (class 0 OID 0)
-- Dependencies: 1629
-- Name: scm_regularizacao_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_regularizacao_item_id_seq OWNED BY scm_regularizacao_item.id;


--
-- TOC entry 2154 (class 0 OID 0)
-- Dependencies: 1629
-- Name: scm_regularizacao_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_regularizacao_item_id_seq', 1, false);


--
-- TOC entry 1631 (class 1259 OID 23306)
-- Dependencies: 3
-- Name: scm_rule; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_rule (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    module_id smallint NOT NULL
);


ALTER TABLE public.scm_rule OWNER TO khronos;

--
-- TOC entry 1633 (class 1259 OID 23316)
-- Dependencies: 3
-- Name: scm_status_maquina; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_status_maquina (
    id integer NOT NULL,
    nm_status_maquina character varying(45) NOT NULL,
    fl_permite_movimentacao smallint,
    fl_permite_transformacao smallint,
    fl_permite_faturamento smallint,
    fl_permite_regularizacao smallint,
    fl_sistema smallint,
    fl_operativa smallint,
    fl_alta smallint
);


ALTER TABLE public.scm_status_maquina OWNER TO khronos;

--
-- TOC entry 1632 (class 1259 OID 23314)
-- Dependencies: 1633 3
-- Name: scm_status_maquina_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_status_maquina_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_status_maquina_id_seq OWNER TO khronos;

--
-- TOC entry 2155 (class 0 OID 0)
-- Dependencies: 1632
-- Name: scm_status_maquina_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_status_maquina_id_seq OWNED BY scm_status_maquina.id;


--
-- TOC entry 2156 (class 0 OID 0)
-- Dependencies: 1632
-- Name: scm_status_maquina_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_status_maquina_id_seq', 3, true);


--
-- TOC entry 1635 (class 1259 OID 23324)
-- Dependencies: 3
-- Name: scm_tipo_local; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_tipo_local (
    id integer NOT NULL,
    nm_tipo_local character varying(45) NOT NULL,
    fl_sistema boolean
);


ALTER TABLE public.scm_tipo_local OWNER TO khronos;

--
-- TOC entry 1634 (class 1259 OID 23322)
-- Dependencies: 1635 3
-- Name: scm_tipo_local_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_tipo_local_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_tipo_local_id_seq OWNER TO khronos;

--
-- TOC entry 2157 (class 0 OID 0)
-- Dependencies: 1634
-- Name: scm_tipo_local_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_tipo_local_id_seq OWNED BY scm_tipo_local.id;


--
-- TOC entry 2158 (class 0 OID 0)
-- Dependencies: 1634
-- Name: scm_tipo_local_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_tipo_local_id_seq', 2, true);


--
-- TOC entry 1637 (class 1259 OID 23332)
-- Dependencies: 3
-- Name: scm_transformacao_doc; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_transformacao_doc (
    id integer NOT NULL,
    id_origem bigint,
    dt_transformacao timestamp without time zone NOT NULL,
    id_filial integer NOT NULL,
    id_local integer NOT NULL,
    id_parceiro integer,
    id_usuario integer NOT NULL,
    dt_sistema timestamp without time zone NOT NULL
);


ALTER TABLE public.scm_transformacao_doc OWNER TO khronos;

--
-- TOC entry 1636 (class 1259 OID 23330)
-- Dependencies: 1637 3
-- Name: scm_transformacao_doc_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_transformacao_doc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_transformacao_doc_id_seq OWNER TO khronos;

--
-- TOC entry 2159 (class 0 OID 0)
-- Dependencies: 1636
-- Name: scm_transformacao_doc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_transformacao_doc_id_seq OWNED BY scm_transformacao_doc.id;


--
-- TOC entry 2160 (class 0 OID 0)
-- Dependencies: 1636
-- Name: scm_transformacao_doc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_transformacao_doc_id_seq', 1, false);


--
-- TOC entry 1639 (class 1259 OID 23340)
-- Dependencies: 3
-- Name: scm_transformacao_item; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_transformacao_item (
    id integer NOT NULL,
    id_transformacao_doc integer,
    id_maquina integer NOT NULL,
    nr_cont_1 integer,
    nr_cont_2 integer,
    nr_cont_3 integer,
    nr_cont_4 integer,
    nr_cont_5 integer,
    nr_cont_6 integer,
    id_jogo integer NOT NULL,
    nr_versao_jogo character varying(45),
    vl_credito numeric(10,2) NOT NULL,
    id_gabinete integer NOT NULL,
    id_moeda integer NOT NULL,
    nr_cont_1_ant integer,
    nr_cont_2_ant integer,
    nr_cont_3_ant integer,
    nr_cont_4_ant integer,
    nr_cont_5_ant integer,
    nr_cont_6_ant integer
);


ALTER TABLE public.scm_transformacao_item OWNER TO khronos;

--
-- TOC entry 1638 (class 1259 OID 23338)
-- Dependencies: 3 1639
-- Name: scm_transformacao_item_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_transformacao_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_transformacao_item_id_seq OWNER TO khronos;

--
-- TOC entry 2161 (class 0 OID 0)
-- Dependencies: 1638
-- Name: scm_transformacao_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_transformacao_item_id_seq OWNED BY scm_transformacao_item.id;


--
-- TOC entry 2162 (class 0 OID 0)
-- Dependencies: 1638
-- Name: scm_transformacao_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_transformacao_item_id_seq', 1, false);


--
-- TOC entry 1641 (class 1259 OID 23348)
-- Dependencies: 3
-- Name: scm_user; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_user (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    language character varying(255),
    status character(1)
);


ALTER TABLE public.scm_user OWNER TO khronos;

--
-- TOC entry 1642 (class 1259 OID 23357)
-- Dependencies: 3
-- Name: scm_user_empresa; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_user_empresa (
    user_id integer NOT NULL,
    id_empresa integer NOT NULL
);


ALTER TABLE public.scm_user_empresa OWNER TO khronos;

--
-- TOC entry 1643 (class 1259 OID 23362)
-- Dependencies: 3
-- Name: scm_user_group; Type: TABLE; Schema: public; Owner: khronos; Tablespace: 
--

CREATE TABLE scm_user_group (
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.scm_user_group OWNER TO khronos;

--
-- TOC entry 1640 (class 1259 OID 23346)
-- Dependencies: 1641 3
-- Name: scm_user_id_seq; Type: SEQUENCE; Schema: public; Owner: khronos
--

CREATE SEQUENCE scm_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.scm_user_id_seq OWNER TO khronos;

--
-- TOC entry 2163 (class 0 OID 0)
-- Dependencies: 1640
-- Name: scm_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khronos
--

ALTER SEQUENCE scm_user_id_seq OWNED BY scm_user.id;


--
-- TOC entry 2164 (class 0 OID 0)
-- Dependencies: 1640
-- Name: scm_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khronos
--

SELECT pg_catalog.setval('scm_user_id_seq', 6, true);


--
-- TOC entry 1921 (class 2604 OID 23122)
-- Dependencies: 1587 1586 1587
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_empresa ALTER COLUMN id SET DEFAULT nextval('scm_empresa_id_seq'::regclass);


--
-- TOC entry 1922 (class 2604 OID 23130)
-- Dependencies: 1589 1588 1589
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_fatura_doc ALTER COLUMN id SET DEFAULT nextval('scm_fatura_doc_id_seq'::regclass);


--
-- TOC entry 1923 (class 2604 OID 23143)
-- Dependencies: 1591 1592 1592
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_fatura_excecao ALTER COLUMN id SET DEFAULT nextval('scm_fatura_excecao_id_seq'::regclass);


--
-- TOC entry 1924 (class 2604 OID 23156)
-- Dependencies: 1594 1595 1595
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_fatura_item ALTER COLUMN id SET DEFAULT nextval('scm_fatura_item_id_seq'::regclass);


--
-- TOC entry 1925 (class 2604 OID 23164)
-- Dependencies: 1596 1597 1597
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_fatura_tipo_excecao ALTER COLUMN id SET DEFAULT nextval('scm_fatura_tipo_excecao_id_seq'::regclass);


--
-- TOC entry 1926 (class 2604 OID 23172)
-- Dependencies: 1598 1599 1599
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_filial ALTER COLUMN id SET DEFAULT nextval('scm_filial_id_seq'::regclass);


--
-- TOC entry 1927 (class 2604 OID 23180)
-- Dependencies: 1601 1600 1601
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_gabinete ALTER COLUMN id SET DEFAULT nextval('scm_gabinete_id_seq'::regclass);


--
-- TOC entry 1928 (class 2604 OID 23188)
-- Dependencies: 1603 1602 1603
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_group ALTER COLUMN id SET DEFAULT nextval('scm_group_id_seq'::regclass);


--
-- TOC entry 1929 (class 2604 OID 23201)
-- Dependencies: 1606 1605 1606
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_historico_status ALTER COLUMN id SET DEFAULT nextval('scm_historico_status_id_seq'::regclass);


--
-- TOC entry 1930 (class 2604 OID 23209)
-- Dependencies: 1608 1607 1608
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_jogo ALTER COLUMN id SET DEFAULT nextval('scm_jogo_id_seq'::regclass);


--
-- TOC entry 1931 (class 2604 OID 23217)
-- Dependencies: 1610 1609 1610
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_local ALTER COLUMN id SET DEFAULT nextval('scm_local_id_seq'::regclass);


--
-- TOC entry 1933 (class 2604 OID 23226)
-- Dependencies: 1612 1611 1612
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_local_server ALTER COLUMN id SET DEFAULT nextval('scm_local_server_id_seq'::regclass);


--
-- TOC entry 1934 (class 2604 OID 23234)
-- Dependencies: 1614 1613 1614
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_maquina ALTER COLUMN id SET DEFAULT nextval('scm_maquina_id_seq'::regclass);


--
-- TOC entry 1935 (class 2604 OID 23244)
-- Dependencies: 1615 1616 1616
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_module ALTER COLUMN id SET DEFAULT nextval('scm_module_id_seq'::regclass);


--
-- TOC entry 1936 (class 2604 OID 23252)
-- Dependencies: 1617 1618 1618
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_moeda ALTER COLUMN id SET DEFAULT nextval('scm_moeda_id_seq'::regclass);


--
-- TOC entry 1937 (class 2604 OID 23263)
-- Dependencies: 1620 1619 1620
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_movimentacao_doc ALTER COLUMN id SET DEFAULT nextval('scm_movimentacao_doc_id_seq'::regclass);


--
-- TOC entry 1938 (class 2604 OID 23271)
-- Dependencies: 1621 1622 1622
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_movimentacao_item ALTER COLUMN id SET DEFAULT nextval('scm_movimentacao_item_id_seq'::regclass);


--
-- TOC entry 1939 (class 2604 OID 23279)
-- Dependencies: 1623 1624 1624
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_parceiro ALTER COLUMN id SET DEFAULT nextval('scm_parceiro_id_seq'::regclass);


--
-- TOC entry 1940 (class 2604 OID 23287)
-- Dependencies: 1625 1626 1626
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_protocolo ALTER COLUMN id SET DEFAULT nextval('scm_protocolo_id_seq'::regclass);


--
-- TOC entry 1941 (class 2604 OID 23295)
-- Dependencies: 1628 1627 1628
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_regularizacao_doc ALTER COLUMN id SET DEFAULT nextval('scm_regularizacao_doc_id_seq'::regclass);


--
-- TOC entry 1942 (class 2604 OID 23303)
-- Dependencies: 1630 1629 1630
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_regularizacao_item ALTER COLUMN id SET DEFAULT nextval('scm_regularizacao_item_id_seq'::regclass);


--
-- TOC entry 1943 (class 2604 OID 23319)
-- Dependencies: 1633 1632 1633
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_status_maquina ALTER COLUMN id SET DEFAULT nextval('scm_status_maquina_id_seq'::regclass);


--
-- TOC entry 1944 (class 2604 OID 23327)
-- Dependencies: 1635 1634 1635
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_tipo_local ALTER COLUMN id SET DEFAULT nextval('scm_tipo_local_id_seq'::regclass);


--
-- TOC entry 1945 (class 2604 OID 23335)
-- Dependencies: 1637 1636 1637
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_transformacao_doc ALTER COLUMN id SET DEFAULT nextval('scm_transformacao_doc_id_seq'::regclass);


--
-- TOC entry 1946 (class 2604 OID 23343)
-- Dependencies: 1639 1638 1639
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_transformacao_item ALTER COLUMN id SET DEFAULT nextval('scm_transformacao_item_id_seq'::regclass);


--
-- TOC entry 1947 (class 2604 OID 23351)
-- Dependencies: 1640 1641 1641
-- Name: id; Type: DEFAULT; Schema: public; Owner: khronos
--

ALTER TABLE scm_user ALTER COLUMN id SET DEFAULT nextval('scm_user_id_seq'::regclass);


--
-- TOC entry 2076 (class 0 OID 23109)
-- Dependencies: 1585
-- Data for Name: scm_config; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_config (id, name, value, type, system) FROM stdin;
1	Lenguaje por defecto	es	\N	\N
2	Nombre del sistema	| Novo sistema chamado de Unknow	\N	\N
3	Dirección de la Logo	images/logo.png	\N	\N
4	Contadores Obligatorios	1,2,3,4	\N	\N
5	Local por Defecto	1	\N	\N
6	Número de registros por página	15	\N	t
8	Dirección del Servidor de Listados	localhost	\N	t
10	Timeout del Servidor de Listados	30	\N	t
11	Porta del Servidor de Listados	8080	\N	t
12	Crédito para considerar jogando	0.20	\N	f
13	Copyright	Copyright &copy; TSG | All rights reserved - Powered by <a target="_blank" href="http://www.tesystem.com.br/">TSG</a>	\N	t
14	Nombre del Portal	| Novo sistema chamado de Unknow	\N	t
\.


--
-- TOC entry 2077 (class 0 OID 23119)
-- Dependencies: 1587
-- Data for Name: scm_empresa; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_empresa (id, nm_empresa) FROM stdin;
1	Empresa Standard
\.


--
-- TOC entry 2078 (class 0 OID 23127)
-- Dependencies: 1589
-- Data for Name: scm_fatura_doc; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_fatura_doc (id, id_fatura_doc_status, dt_fatura, id_origem, id_filial, id_local, id_parceiro, id_usuario, dt_sistema) FROM stdin;
\.


--
-- TOC entry 2079 (class 0 OID 23133)
-- Dependencies: 1590
-- Data for Name: scm_fatura_doc_status; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_fatura_doc_status (id, nm_fatura_doc_status) FROM stdin;
1	Standard
\.


--
-- TOC entry 2080 (class 0 OID 23140)
-- Dependencies: 1592
-- Data for Name: scm_fatura_excecao; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_fatura_excecao (id, id_fatura_doc, id_maquina, id_fatura_excecao_tipo) FROM stdin;
\.


--
-- TOC entry 2081 (class 0 OID 23146)
-- Dependencies: 1593
-- Data for Name: scm_fatura_excecao_tipo; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_fatura_excecao_tipo (id, nm_fatura_excecao_tipo) FROM stdin;
1	Não selecionada
2	Jogando
3	Offline
4	Contadores inconsistentes
\.


--
-- TOC entry 2082 (class 0 OID 23153)
-- Dependencies: 1595
-- Data for Name: scm_fatura_item; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_fatura_item (id, id_fatura_doc, vl_credito, id_maquina, id_jogo, id_gabinete, id_protocolo, id_moeda, nr_cont_1, nr_cont_2, nr_cont_3, nr_cont_4, nr_cont_5, nr_cont_6, nr_cont_1_ant, nr_cont_2_ant, nr_cont_3_ant, nr_cont_4_ant, nr_cont_5_ant, nr_cont_6_ant, nr_dif_cont_1, nr_dif_cont_2, nr_dif_cont_3, nr_dif_cont_4, nr_dif_cont_5, nr_dif_cont_6, vl_diff_cont_1, vl_diff_cont_2, vl_diff_cont_3, vl_diff_cont_4, vl_diff_cont_5, vl_diff_cont_6) FROM stdin;
\.


--
-- TOC entry 2083 (class 0 OID 23161)
-- Dependencies: 1597
-- Data for Name: scm_fatura_tipo_excecao; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_fatura_tipo_excecao (id, nm_fatura_tipo_excecao) FROM stdin;
\.


--
-- TOC entry 2084 (class 0 OID 23169)
-- Dependencies: 1599
-- Data for Name: scm_filial; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_filial (id, id_empresa, nm_filial) FROM stdin;
1	1	Filial Standard
\.


--
-- TOC entry 2085 (class 0 OID 23177)
-- Dependencies: 1601
-- Data for Name: scm_gabinete; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_gabinete (id, nm_gabinete) FROM stdin;
1	Mueble PST3
\.


--
-- TOC entry 2086 (class 0 OID 23185)
-- Dependencies: 1603
-- Data for Name: scm_group; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_group (id, name) FROM stdin;
1	Administradores
2	Gerentes
3	Técnicos
4	Listados
\.


--
-- TOC entry 2087 (class 0 OID 23191)
-- Dependencies: 1604
-- Data for Name: scm_group_rule; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_group_rule (group_id, rule_id) FROM stdin;
1	1
1	2
1	3
1	4
1	5
1	6
1	7
1	8
1	9
1	10
1	11
1	12
1	13
1	14
1	15
1	16
1	17
1	18
1	19
1	20
1	21
1	22
1	23
1	24
1	25
1	26
1	27
1	28
1	30
2	21
2	22
2	23
2	24
2	25
2	26
2	27
2	28
2	30
3	21
3	22
3	23
3	24
3	25
3	26
3	27
3	28
3	30
4	25
4	30
4	13
4	21
2	13
3	13
1	34
1	36
1	37
1	38
1	39
1	40
1	41
1	42
1	43
1	44
1	45
1	46
1	47
1	48
1	49
1	50
1	51
1	52
1	53
1	54
1	55
1	56
1	57
1	58
1	59
1	60
1	61
1	62
1	63
1	64
1	65
1	66
1	67
1	68
1	69
1	70
1	71
1	72
1	73
\.


--
-- TOC entry 2088 (class 0 OID 23198)
-- Dependencies: 1606
-- Data for Name: scm_historico_status; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_historico_status (id, dt_status, id_status, id_maquina, id_filial, id_local, id_parceiro, id_usuario, dt_sistema) FROM stdin;
\.


--
-- TOC entry 2089 (class 0 OID 23206)
-- Dependencies: 1608
-- Data for Name: scm_jogo; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_jogo (id, nm_jogo) FROM stdin;
1	Big Bingo
2	Fast Ball
3	Golden Premio
4	Golden Ball
5	Bingo X
\.


--
-- TOC entry 2090 (class 0 OID 23214)
-- Dependencies: 1610
-- Data for Name: scm_local; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_local (id, nm_local, tp_local, fl_portal, user_portal, pass_portal) FROM stdin;
1	Sala Standard	1	1	sala	1234
2	Deposito Standard	2	1	deposito	1234
\.


--
-- TOC entry 2091 (class 0 OID 23223)
-- Dependencies: 1612
-- Data for Name: scm_local_server; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_local_server (id, id_local, ip_server, id_protocolo, num_port, timeout) FROM stdin;
1	1	172.99.2.69	1	80	30
2	2	172.99.2.69	1	80	30
\.


--
-- TOC entry 2092 (class 0 OID 23231)
-- Dependencies: 1614
-- Data for Name: scm_maquina; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_maquina (id, nr_serie_imob, nr_serie_connect, nr_serie_aux, dt_ultima_movimentacao, dt_ultima_transformacao, dt_ultimo_faturamento, dt_ultima_regularizacao, dt_ultimo_status, dt_cadastro, dt_sistema, id_usuario, id_protocolo, id_filial, id_local, id_status, id_jogo, nr_versao_jogo, vl_credito, id_gabinete, nr_cont_1, nr_cont_2, nr_cont_3, nr_cont_4, nr_cont_5, nr_cont_6, nr_cont_1_parcial, nr_cont_2_parcial, nr_cont_3_parcial, nr_cont_4_parcial, nr_cont_5_parcial, nr_cont_6_parcial, id_moeda, id_parceiro) FROM stdin;
\.


--
-- TOC entry 2093 (class 0 OID 23241)
-- Dependencies: 1616
-- Data for Name: scm_module; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_module (id, name) FROM stdin;
1	Administración
2	Parque
3	Cierre
4	Consultas y Listados
5	Portal
6	Relatórios
\.


--
-- TOC entry 2094 (class 0 OID 23249)
-- Dependencies: 1618
-- Data for Name: scm_moeda; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_moeda (id, nm_moeda, simbolo_moeda) FROM stdin;
1	Euro	€
2	Dolar	US$
\.


--
-- TOC entry 2095 (class 0 OID 23260)
-- Dependencies: 1620
-- Data for Name: scm_movimentacao_doc; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_movimentacao_doc (id, id_origem, dt_movimentacao, id_filial, id_local, id_parceiro, id_usuario, dt_sistema, tp_movimento) FROM stdin;
\.


--
-- TOC entry 2096 (class 0 OID 23268)
-- Dependencies: 1622
-- Data for Name: scm_movimentacao_item; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_movimentacao_item (id, id_movimentacao_doc, id_maquina, fl_cont_manual, nr_cont_1, nr_cont_2, nr_cont_3, nr_cont_4, nr_cont_5, nr_cont_6) FROM stdin;
\.


--
-- TOC entry 2097 (class 0 OID 23276)
-- Dependencies: 1624
-- Data for Name: scm_parceiro; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_parceiro (id, nm_parceiro, id_empresa) FROM stdin;
\.


--
-- TOC entry 2098 (class 0 OID 23284)
-- Dependencies: 1626
-- Data for Name: scm_protocolo; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_protocolo (id, nm_protocolo) FROM stdin;
1	TSG
2	SAS
\.


--
-- TOC entry 2099 (class 0 OID 23292)
-- Dependencies: 1628
-- Data for Name: scm_regularizacao_doc; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_regularizacao_doc (id, dt_regularizacao, ds_motivo, tp_regularizacao, id_filial, id_local, id_parceiro, id_usuario, dt_sistema) FROM stdin;
\.


--
-- TOC entry 2100 (class 0 OID 23300)
-- Dependencies: 1630
-- Data for Name: scm_regularizacao_item; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_regularizacao_item (id, id_regularizacao_doc, id_maquina, nr_cont_1, nr_cont_2, nr_cont_3, nr_cont_4, nr_cont_5, nr_cont_6, nr_cont_1_ant, nr_cont_2_ant, nr_cont_3_ant, nr_cont_4_ant, nr_cont_5_ant, nr_cont_6_ant) FROM stdin;
\.


--
-- TOC entry 2101 (class 0 OID 23306)
-- Dependencies: 1631
-- Data for Name: scm_rule; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_rule (id, name, description, module_id) FROM stdin;
1	Visualizar configurações do sistema	\N	1
2	Modificar configurações do sistema	\N	1
3	Visualizar lista de usuários	\N	1
4	Modificar usuários	\N	1
5	Adicionar usuários	\N	1
6	Deletar usuários	\N	1
7	Visualizar lista de grupos	\N	1
8	Modificar grupos	\N	1
9	Adicionar grupos	\N	1
10	Deletar grupos	\N	1
11	Modificar permissões do grupo	\N	1
12	Modificar grupos do usuário	\N	1
13	Visualizar lista de jogos	\N	2
14	Modificar jogo	\N	2
15	Adicionar jogo	\N	2
16	Deletar jogo	\N	2
17	Visualizar lista de salas	\N	2
18	Modificar sala	\N	2
19	Adicionar sala	\N	2
20	Deletar sala	\N	2
21	Visualizar lista de gabinetes	\N	2
22	Modificar gabinete	\N	2
23	Adicionar gabinete	\N	2
24	Deletar gabinete	\N	2
25	Visualizar lista de máquinas	\N	2
26	Modificar máquina	\N	2
27	Adicionar máquina	\N	2
28	Transformar máquina	\N	2
30	Consultar Contadores Atuais	\N	4
34	Gráfico de Entradas	\N	5
35	Status das máquinas	\N	5
36	Relatórios	\N	6
37	Modificar empresas do usuário	\N	1
38	Visualizar empresas	\N	1
39	Modificar empresa	\N	1
40	Adicionar empresa	\N	1
41	Deletar empresa	\N	1
42	Visualizar filiais	\N	1
43	Adicionar filial	\N	1
44	Modificar filial	\N	1
45	Deletar filial	\N	1
46	Visualizar tipos de local	\N	2
47	Adicionar tipo de local	\N	2
48	Modificar tipo de local	\N	2
49	Deletar tipo de local	\N	2
50	Visualizar parceiros	\N	1
51	Adicionar parceiro	\N	1
52	Modificar parceiro	\N	1
53	Deletar parceiro	\N	1
54	Visualizar status de máquina	\N	1
55	Adicionar status de máquina	\N	1
56	Modificar status de máquina	\N	1
57	Deletar status de máquina	\N	1
58	Entrada de Máquinas	\N	2
59	Saída de Máquinas	\N	2
60	Digitar contadores manualmente na movimentação	\N	2
61	Permite alterar filial de uma máquina	\N	2
62	Regularização de contadores	\N	2
63	Regularização de contadores controlada	\N	2
64	Regularização de contadores por falha	\N	2
65	Mudar status de uma máquina	\N	2
66	Relatório Parque resumido	\N	6
67	Preencher contadores manualmente no cadastro de máquinas	\N	2
68	Relatório Parque Detalhado	\N	2
69	Relatório de Máquinas em Trânsito	\N	2
70	Consultas	\N	2
71	Consulta histórico de máquina	\N	2
72	Visualizar listagem de faturas	\N	2
73	Gerar fatura	\N	2
\.


--
-- TOC entry 2102 (class 0 OID 23316)
-- Dependencies: 1633
-- Data for Name: scm_status_maquina; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_status_maquina (id, nm_status_maquina, fl_permite_movimentacao, fl_permite_transformacao, fl_permite_faturamento, fl_permite_regularizacao, fl_sistema, fl_operativa, fl_alta) FROM stdin;
1	Cadastrada	1	1	1	1	1	1	1
2	Em trânsito	1	0	0	0	1	1	1
3	Instalada	1	1	1	1	1	1	1
\.


--
-- TOC entry 2103 (class 0 OID 23324)
-- Dependencies: 1635
-- Data for Name: scm_tipo_local; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_tipo_local (id, nm_tipo_local, fl_sistema) FROM stdin;
1	Sala	t
2	Depósito	t
\.


--
-- TOC entry 2104 (class 0 OID 23332)
-- Dependencies: 1637
-- Data for Name: scm_transformacao_doc; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_transformacao_doc (id, id_origem, dt_transformacao, id_filial, id_local, id_parceiro, id_usuario, dt_sistema) FROM stdin;
\.


--
-- TOC entry 2105 (class 0 OID 23340)
-- Dependencies: 1639
-- Data for Name: scm_transformacao_item; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_transformacao_item (id, id_transformacao_doc, id_maquina, nr_cont_1, nr_cont_2, nr_cont_3, nr_cont_4, nr_cont_5, nr_cont_6, id_jogo, nr_versao_jogo, vl_credito, id_gabinete, id_moeda, nr_cont_1_ant, nr_cont_2_ant, nr_cont_3_ant, nr_cont_4_ant, nr_cont_5_ant, nr_cont_6_ant) FROM stdin;
\.


--
-- TOC entry 2106 (class 0 OID 23348)
-- Dependencies: 1641
-- Data for Name: scm_user; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_user (id, name, username, password, email, language, status) FROM stdin;
1	Administrador	admin	1234	rafael@agenciadmg.com.br	es	1
2	Gerente	gerente	1234	rafael@agenciadmg.com.br	\N	1
3	Tecnico	tecnico	1234	rafael@agenciadmg.com.br	\N	1
4	Listados	listados	1234	rafael@agenciadmg.com.br	\N	1
6	jean	jean	4321	ofoda@gmail.com	es	1
\.


--
-- TOC entry 2107 (class 0 OID 23357)
-- Dependencies: 1642
-- Data for Name: scm_user_empresa; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_user_empresa (user_id, id_empresa) FROM stdin;
1	1
2	1
3	1
4	1
\.


--
-- TOC entry 2108 (class 0 OID 23362)
-- Dependencies: 1643
-- Data for Name: scm_user_group; Type: TABLE DATA; Schema: public; Owner: khronos
--

COPY scm_user_group (user_id, group_id) FROM stdin;
1	1
2	2
3	3
4	4
6	1
\.


--
-- TOC entry 1949 (class 2606 OID 23116)
-- Dependencies: 1585 1585
-- Name: scm_config_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_config
    ADD CONSTRAINT scm_config_pkey PRIMARY KEY (id);


--
-- TOC entry 1951 (class 2606 OID 23124)
-- Dependencies: 1587 1587
-- Name: scm_empresa_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_empresa
    ADD CONSTRAINT scm_empresa_pkey PRIMARY KEY (id);


--
-- TOC entry 1953 (class 2606 OID 23132)
-- Dependencies: 1589 1589
-- Name: scm_fatura_doc_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_fatura_doc
    ADD CONSTRAINT scm_fatura_doc_pkey PRIMARY KEY (id);


--
-- TOC entry 1955 (class 2606 OID 23137)
-- Dependencies: 1590 1590
-- Name: scm_fatura_doc_status_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_fatura_doc_status
    ADD CONSTRAINT scm_fatura_doc_status_pkey PRIMARY KEY (id);


--
-- TOC entry 1957 (class 2606 OID 23145)
-- Dependencies: 1592 1592
-- Name: scm_fatura_excecao_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_fatura_excecao
    ADD CONSTRAINT scm_fatura_excecao_pkey PRIMARY KEY (id);


--
-- TOC entry 1959 (class 2606 OID 23150)
-- Dependencies: 1593 1593
-- Name: scm_fatura_excecao_tipo_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_fatura_excecao_tipo
    ADD CONSTRAINT scm_fatura_excecao_tipo_pkey PRIMARY KEY (id);


--
-- TOC entry 1961 (class 2606 OID 23158)
-- Dependencies: 1595 1595
-- Name: scm_fatura_item_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_fatura_item
    ADD CONSTRAINT scm_fatura_item_pkey PRIMARY KEY (id);


--
-- TOC entry 1963 (class 2606 OID 23166)
-- Dependencies: 1597 1597
-- Name: scm_fatura_tipo_excecao_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_fatura_tipo_excecao
    ADD CONSTRAINT scm_fatura_tipo_excecao_pkey PRIMARY KEY (id);


--
-- TOC entry 1965 (class 2606 OID 23174)
-- Dependencies: 1599 1599
-- Name: scm_filial_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_filial
    ADD CONSTRAINT scm_filial_pkey PRIMARY KEY (id);


--
-- TOC entry 1967 (class 2606 OID 23182)
-- Dependencies: 1601 1601
-- Name: scm_gabinete_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_gabinete
    ADD CONSTRAINT scm_gabinete_pkey PRIMARY KEY (id);


--
-- TOC entry 1969 (class 2606 OID 23190)
-- Dependencies: 1603 1603
-- Name: scm_group_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_group
    ADD CONSTRAINT scm_group_pkey PRIMARY KEY (id);


--
-- TOC entry 1971 (class 2606 OID 23195)
-- Dependencies: 1604 1604 1604
-- Name: scm_group_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_group_rule
    ADD CONSTRAINT scm_group_rule_pkey PRIMARY KEY (group_id, rule_id);


--
-- TOC entry 1973 (class 2606 OID 23203)
-- Dependencies: 1606 1606
-- Name: scm_historico_status_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_historico_status
    ADD CONSTRAINT scm_historico_status_pkey PRIMARY KEY (id);


--
-- TOC entry 1975 (class 2606 OID 23211)
-- Dependencies: 1608 1608
-- Name: scm_jogo_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_jogo
    ADD CONSTRAINT scm_jogo_pkey PRIMARY KEY (id);


--
-- TOC entry 1977 (class 2606 OID 23220)
-- Dependencies: 1610 1610
-- Name: scm_local_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_local
    ADD CONSTRAINT scm_local_pkey PRIMARY KEY (id);


--
-- TOC entry 1980 (class 2606 OID 23228)
-- Dependencies: 1612 1612
-- Name: scm_local_server_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_local_server
    ADD CONSTRAINT scm_local_server_pkey PRIMARY KEY (id);


--
-- TOC entry 1982 (class 2606 OID 23238)
-- Dependencies: 1614 1614
-- Name: scm_maquina_nr_serie_imob_key; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_maquina
    ADD CONSTRAINT scm_maquina_nr_serie_imob_key UNIQUE (nr_serie_imob);


--
-- TOC entry 1984 (class 2606 OID 23236)
-- Dependencies: 1614 1614
-- Name: scm_maquina_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_maquina
    ADD CONSTRAINT scm_maquina_pkey PRIMARY KEY (id);


--
-- TOC entry 1986 (class 2606 OID 23246)
-- Dependencies: 1616 1616
-- Name: scm_module_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_module
    ADD CONSTRAINT scm_module_pkey PRIMARY KEY (id);


--
-- TOC entry 1988 (class 2606 OID 23257)
-- Dependencies: 1618 1618
-- Name: scm_moeda_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_moeda
    ADD CONSTRAINT scm_moeda_pkey PRIMARY KEY (id);


--
-- TOC entry 1990 (class 2606 OID 23265)
-- Dependencies: 1620 1620
-- Name: scm_movimentacao_doc_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_movimentacao_doc
    ADD CONSTRAINT scm_movimentacao_doc_pkey PRIMARY KEY (id);


--
-- TOC entry 1992 (class 2606 OID 23273)
-- Dependencies: 1622 1622
-- Name: scm_movimentacao_item_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_movimentacao_item
    ADD CONSTRAINT scm_movimentacao_item_pkey PRIMARY KEY (id);


--
-- TOC entry 1994 (class 2606 OID 23281)
-- Dependencies: 1624 1624
-- Name: scm_parceiro_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_parceiro
    ADD CONSTRAINT scm_parceiro_pkey PRIMARY KEY (id);


--
-- TOC entry 1996 (class 2606 OID 23289)
-- Dependencies: 1626 1626
-- Name: scm_protocolo_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_protocolo
    ADD CONSTRAINT scm_protocolo_pkey PRIMARY KEY (id);


--
-- TOC entry 1998 (class 2606 OID 23297)
-- Dependencies: 1628 1628
-- Name: scm_regularizacao_doc_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_regularizacao_doc
    ADD CONSTRAINT scm_regularizacao_doc_pkey PRIMARY KEY (id);


--
-- TOC entry 2000 (class 2606 OID 23305)
-- Dependencies: 1630 1630
-- Name: scm_regularizacao_item_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_regularizacao_item
    ADD CONSTRAINT scm_regularizacao_item_pkey PRIMARY KEY (id);


--
-- TOC entry 2002 (class 2606 OID 23313)
-- Dependencies: 1631 1631
-- Name: scm_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_rule
    ADD CONSTRAINT scm_rule_pkey PRIMARY KEY (id);


--
-- TOC entry 2004 (class 2606 OID 23321)
-- Dependencies: 1633 1633
-- Name: scm_status_maquina_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_status_maquina
    ADD CONSTRAINT scm_status_maquina_pkey PRIMARY KEY (id);


--
-- TOC entry 2006 (class 2606 OID 23329)
-- Dependencies: 1635 1635
-- Name: scm_tipo_local_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_tipo_local
    ADD CONSTRAINT scm_tipo_local_pkey PRIMARY KEY (id);


--
-- TOC entry 2008 (class 2606 OID 23337)
-- Dependencies: 1637 1637
-- Name: scm_transformacao_doc_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_transformacao_doc
    ADD CONSTRAINT scm_transformacao_doc_pkey PRIMARY KEY (id);


--
-- TOC entry 2010 (class 2606 OID 23345)
-- Dependencies: 1639 1639
-- Name: scm_transformacao_item_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_transformacao_item
    ADD CONSTRAINT scm_transformacao_item_pkey PRIMARY KEY (id);


--
-- TOC entry 2014 (class 2606 OID 23361)
-- Dependencies: 1642 1642 1642
-- Name: scm_user_empresa_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_user_empresa
    ADD CONSTRAINT scm_user_empresa_pkey PRIMARY KEY (user_id, id_empresa);


--
-- TOC entry 2016 (class 2606 OID 23366)
-- Dependencies: 1643 1643 1643
-- Name: scm_user_group_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_user_group
    ADD CONSTRAINT scm_user_group_pkey PRIMARY KEY (user_id, group_id);


--
-- TOC entry 2012 (class 2606 OID 23356)
-- Dependencies: 1641 1641
-- Name: scm_user_pkey; Type: CONSTRAINT; Schema: public; Owner: khronos; Tablespace: 
--

ALTER TABLE ONLY scm_user
    ADD CONSTRAINT scm_user_pkey PRIMARY KEY (id);


--
-- TOC entry 1978 (class 1259 OID 23367)
-- Dependencies: 1610
-- Name: userunique; Type: INDEX; Schema: public; Owner: khronos; Tablespace: 
--

CREATE UNIQUE INDEX userunique ON scm_local USING btree (user_portal);


--
-- TOC entry 2021 (class 2606 OID 23388)
-- Dependencies: 1589 1590 1954
-- Name: scm_fatura_doc_id_fatura_doc_status_scm_fatura_doc_status_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_fatura_doc
    ADD CONSTRAINT scm_fatura_doc_id_fatura_doc_status_scm_fatura_doc_status_id FOREIGN KEY (id_fatura_doc_status) REFERENCES scm_fatura_doc_status(id);


--
-- TOC entry 2020 (class 2606 OID 23383)
-- Dependencies: 1589 1599 1964
-- Name: scm_fatura_doc_id_filial_scm_filial_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_fatura_doc
    ADD CONSTRAINT scm_fatura_doc_id_filial_scm_filial_id FOREIGN KEY (id_filial) REFERENCES scm_filial(id);


--
-- TOC entry 2019 (class 2606 OID 23378)
-- Dependencies: 1610 1976 1589
-- Name: scm_fatura_doc_id_local_scm_local_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_fatura_doc
    ADD CONSTRAINT scm_fatura_doc_id_local_scm_local_id FOREIGN KEY (id_local) REFERENCES scm_local(id);


--
-- TOC entry 2018 (class 2606 OID 23373)
-- Dependencies: 1624 1589 1993
-- Name: scm_fatura_doc_id_parceiro_scm_parceiro_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_fatura_doc
    ADD CONSTRAINT scm_fatura_doc_id_parceiro_scm_parceiro_id FOREIGN KEY (id_parceiro) REFERENCES scm_parceiro(id);


--
-- TOC entry 2017 (class 2606 OID 23368)
-- Dependencies: 1641 2011 1589
-- Name: scm_fatura_doc_id_usuario_scm_user_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_fatura_doc
    ADD CONSTRAINT scm_fatura_doc_id_usuario_scm_user_id FOREIGN KEY (id_usuario) REFERENCES scm_user(id);


--
-- TOC entry 2023 (class 2606 OID 23398)
-- Dependencies: 1952 1589 1592
-- Name: scm_fatura_excecao_id_fatura_doc_scm_fatura_doc_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_fatura_excecao
    ADD CONSTRAINT scm_fatura_excecao_id_fatura_doc_scm_fatura_doc_id FOREIGN KEY (id_fatura_doc) REFERENCES scm_fatura_doc(id);


--
-- TOC entry 2022 (class 2606 OID 23393)
-- Dependencies: 1983 1592 1614
-- Name: scm_fatura_excecao_id_maquina_scm_maquina_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_fatura_excecao
    ADD CONSTRAINT scm_fatura_excecao_id_maquina_scm_maquina_id FOREIGN KEY (id_maquina) REFERENCES scm_maquina(id);


--
-- TOC entry 2029 (class 2606 OID 23428)
-- Dependencies: 1952 1589 1595
-- Name: scm_fatura_item_id_fatura_doc_scm_fatura_doc_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_fatura_item
    ADD CONSTRAINT scm_fatura_item_id_fatura_doc_scm_fatura_doc_id FOREIGN KEY (id_fatura_doc) REFERENCES scm_fatura_doc(id);


--
-- TOC entry 2028 (class 2606 OID 23423)
-- Dependencies: 1966 1595 1601
-- Name: scm_fatura_item_id_gabinete_scm_gabinete_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_fatura_item
    ADD CONSTRAINT scm_fatura_item_id_gabinete_scm_gabinete_id FOREIGN KEY (id_gabinete) REFERENCES scm_gabinete(id);


--
-- TOC entry 2027 (class 2606 OID 23418)
-- Dependencies: 1595 1974 1608
-- Name: scm_fatura_item_id_jogo_scm_jogo_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_fatura_item
    ADD CONSTRAINT scm_fatura_item_id_jogo_scm_jogo_id FOREIGN KEY (id_jogo) REFERENCES scm_jogo(id);


--
-- TOC entry 2026 (class 2606 OID 23413)
-- Dependencies: 1595 1614 1983
-- Name: scm_fatura_item_id_maquina_scm_maquina_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_fatura_item
    ADD CONSTRAINT scm_fatura_item_id_maquina_scm_maquina_id FOREIGN KEY (id_maquina) REFERENCES scm_maquina(id);


--
-- TOC entry 2025 (class 2606 OID 23408)
-- Dependencies: 1618 1987 1595
-- Name: scm_fatura_item_id_moeda_scm_moeda_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_fatura_item
    ADD CONSTRAINT scm_fatura_item_id_moeda_scm_moeda_id FOREIGN KEY (id_moeda) REFERENCES scm_moeda(id);


--
-- TOC entry 2024 (class 2606 OID 23403)
-- Dependencies: 1995 1595 1626
-- Name: scm_fatura_item_id_protocolo_scm_protocolo_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_fatura_item
    ADD CONSTRAINT scm_fatura_item_id_protocolo_scm_protocolo_id FOREIGN KEY (id_protocolo) REFERENCES scm_protocolo(id);


--
-- TOC entry 2030 (class 2606 OID 23433)
-- Dependencies: 1950 1587 1599
-- Name: scm_filial_id_empresa_scm_empresa_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_filial
    ADD CONSTRAINT scm_filial_id_empresa_scm_empresa_id FOREIGN KEY (id_empresa) REFERENCES scm_empresa(id);


--
-- TOC entry 2032 (class 2606 OID 23443)
-- Dependencies: 1604 1968 1603
-- Name: scm_group_rule_group_id_scm_group_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_group_rule
    ADD CONSTRAINT scm_group_rule_group_id_scm_group_id FOREIGN KEY (group_id) REFERENCES scm_group(id);


--
-- TOC entry 2031 (class 2606 OID 23438)
-- Dependencies: 2001 1631 1604
-- Name: scm_group_rule_rule_id_scm_rule_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_group_rule
    ADD CONSTRAINT scm_group_rule_rule_id_scm_rule_id FOREIGN KEY (rule_id) REFERENCES scm_rule(id);


--
-- TOC entry 2036 (class 2606 OID 23463)
-- Dependencies: 1964 1599 1606
-- Name: scm_historico_status_id_filial_scm_filial_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_historico_status
    ADD CONSTRAINT scm_historico_status_id_filial_scm_filial_id FOREIGN KEY (id_filial) REFERENCES scm_filial(id);


--
-- TOC entry 2035 (class 2606 OID 23458)
-- Dependencies: 1610 1976 1606
-- Name: scm_historico_status_id_local_scm_local_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_historico_status
    ADD CONSTRAINT scm_historico_status_id_local_scm_local_id FOREIGN KEY (id_local) REFERENCES scm_local(id);


--
-- TOC entry 2034 (class 2606 OID 23453)
-- Dependencies: 1983 1606 1614
-- Name: scm_historico_status_id_maquina_scm_maquina_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_historico_status
    ADD CONSTRAINT scm_historico_status_id_maquina_scm_maquina_id FOREIGN KEY (id_maquina) REFERENCES scm_maquina(id);


--
-- TOC entry 2033 (class 2606 OID 23448)
-- Dependencies: 1606 1993 1624
-- Name: scm_historico_status_id_parceiro_scm_parceiro_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_historico_status
    ADD CONSTRAINT scm_historico_status_id_parceiro_scm_parceiro_id FOREIGN KEY (id_parceiro) REFERENCES scm_parceiro(id);


--
-- TOC entry 2039 (class 2606 OID 23478)
-- Dependencies: 1976 1610 1612
-- Name: scm_local_server_id_local_scm_local_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_local_server
    ADD CONSTRAINT scm_local_server_id_local_scm_local_id FOREIGN KEY (id_local) REFERENCES scm_local(id);


--
-- TOC entry 2038 (class 2606 OID 23473)
-- Dependencies: 1995 1626 1612
-- Name: scm_local_server_id_protocolo_scm_protocolo_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_local_server
    ADD CONSTRAINT scm_local_server_id_protocolo_scm_protocolo_id FOREIGN KEY (id_protocolo) REFERENCES scm_protocolo(id);


--
-- TOC entry 2037 (class 2606 OID 23468)
-- Dependencies: 1635 1610 2005
-- Name: scm_local_tp_local_scm_tipo_local_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_local
    ADD CONSTRAINT scm_local_tp_local_scm_tipo_local_id FOREIGN KEY (tp_local) REFERENCES scm_tipo_local(id);


--
-- TOC entry 2048 (class 2606 OID 23523)
-- Dependencies: 1964 1614 1599
-- Name: scm_maquina_id_filial_scm_filial_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_maquina
    ADD CONSTRAINT scm_maquina_id_filial_scm_filial_id FOREIGN KEY (id_filial) REFERENCES scm_filial(id);


--
-- TOC entry 2047 (class 2606 OID 23518)
-- Dependencies: 1614 1966 1601
-- Name: scm_maquina_id_gabinete_scm_gabinete_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_maquina
    ADD CONSTRAINT scm_maquina_id_gabinete_scm_gabinete_id FOREIGN KEY (id_gabinete) REFERENCES scm_gabinete(id);


--
-- TOC entry 2046 (class 2606 OID 23513)
-- Dependencies: 1608 1614 1974
-- Name: scm_maquina_id_jogo_scm_jogo_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_maquina
    ADD CONSTRAINT scm_maquina_id_jogo_scm_jogo_id FOREIGN KEY (id_jogo) REFERENCES scm_jogo(id);


--
-- TOC entry 2045 (class 2606 OID 23508)
-- Dependencies: 1976 1610 1614
-- Name: scm_maquina_id_local_scm_local_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_maquina
    ADD CONSTRAINT scm_maquina_id_local_scm_local_id FOREIGN KEY (id_local) REFERENCES scm_local(id);


--
-- TOC entry 2044 (class 2606 OID 23503)
-- Dependencies: 1987 1614 1618
-- Name: scm_maquina_id_moeda_scm_moeda_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_maquina
    ADD CONSTRAINT scm_maquina_id_moeda_scm_moeda_id FOREIGN KEY (id_moeda) REFERENCES scm_moeda(id);


--
-- TOC entry 2043 (class 2606 OID 23498)
-- Dependencies: 1614 1624 1993
-- Name: scm_maquina_id_parceiro_scm_parceiro_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_maquina
    ADD CONSTRAINT scm_maquina_id_parceiro_scm_parceiro_id FOREIGN KEY (id_parceiro) REFERENCES scm_parceiro(id);


--
-- TOC entry 2042 (class 2606 OID 23493)
-- Dependencies: 1995 1614 1626
-- Name: scm_maquina_id_protocolo_scm_protocolo_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_maquina
    ADD CONSTRAINT scm_maquina_id_protocolo_scm_protocolo_id FOREIGN KEY (id_protocolo) REFERENCES scm_protocolo(id);


--
-- TOC entry 2041 (class 2606 OID 23488)
-- Dependencies: 2003 1633 1614
-- Name: scm_maquina_id_status_scm_status_maquina_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_maquina
    ADD CONSTRAINT scm_maquina_id_status_scm_status_maquina_id FOREIGN KEY (id_status) REFERENCES scm_status_maquina(id);


--
-- TOC entry 2040 (class 2606 OID 23483)
-- Dependencies: 1614 1641 2011
-- Name: scm_maquina_id_usuario_scm_user_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_maquina
    ADD CONSTRAINT scm_maquina_id_usuario_scm_user_id FOREIGN KEY (id_usuario) REFERENCES scm_user(id);


--
-- TOC entry 2052 (class 2606 OID 23543)
-- Dependencies: 1964 1599 1620
-- Name: scm_movimentacao_doc_id_filial_scm_filial_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_movimentacao_doc
    ADD CONSTRAINT scm_movimentacao_doc_id_filial_scm_filial_id FOREIGN KEY (id_filial) REFERENCES scm_filial(id);


--
-- TOC entry 2051 (class 2606 OID 23538)
-- Dependencies: 1610 1620 1976
-- Name: scm_movimentacao_doc_id_local_scm_local_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_movimentacao_doc
    ADD CONSTRAINT scm_movimentacao_doc_id_local_scm_local_id FOREIGN KEY (id_local) REFERENCES scm_local(id);


--
-- TOC entry 2050 (class 2606 OID 23533)
-- Dependencies: 1624 1993 1620
-- Name: scm_movimentacao_doc_id_parceiro_scm_parceiro_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_movimentacao_doc
    ADD CONSTRAINT scm_movimentacao_doc_id_parceiro_scm_parceiro_id FOREIGN KEY (id_parceiro) REFERENCES scm_parceiro(id);


--
-- TOC entry 2049 (class 2606 OID 23528)
-- Dependencies: 1620 1641 2011
-- Name: scm_movimentacao_doc_id_usuario_scm_user_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_movimentacao_doc
    ADD CONSTRAINT scm_movimentacao_doc_id_usuario_scm_user_id FOREIGN KEY (id_usuario) REFERENCES scm_user(id);


--
-- TOC entry 2054 (class 2606 OID 23553)
-- Dependencies: 1614 1622 1983
-- Name: scm_movimentacao_item_id_maquina_scm_maquina_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_movimentacao_item
    ADD CONSTRAINT scm_movimentacao_item_id_maquina_scm_maquina_id FOREIGN KEY (id_maquina) REFERENCES scm_maquina(id);


--
-- TOC entry 2055 (class 2606 OID 23558)
-- Dependencies: 1624 1587 1950
-- Name: scm_parceiro_id_empresa_scm_empresa_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_parceiro
    ADD CONSTRAINT scm_parceiro_id_empresa_scm_empresa_id FOREIGN KEY (id_empresa) REFERENCES scm_empresa(id);


--
-- TOC entry 2059 (class 2606 OID 23578)
-- Dependencies: 1599 1628 1964
-- Name: scm_regularizacao_doc_id_filial_scm_filial_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_regularizacao_doc
    ADD CONSTRAINT scm_regularizacao_doc_id_filial_scm_filial_id FOREIGN KEY (id_filial) REFERENCES scm_filial(id);


--
-- TOC entry 2058 (class 2606 OID 23573)
-- Dependencies: 1610 1628 1976
-- Name: scm_regularizacao_doc_id_local_scm_local_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_regularizacao_doc
    ADD CONSTRAINT scm_regularizacao_doc_id_local_scm_local_id FOREIGN KEY (id_local) REFERENCES scm_local(id);


--
-- TOC entry 2057 (class 2606 OID 23568)
-- Dependencies: 1628 1624 1993
-- Name: scm_regularizacao_doc_id_parceiro_scm_parceiro_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_regularizacao_doc
    ADD CONSTRAINT scm_regularizacao_doc_id_parceiro_scm_parceiro_id FOREIGN KEY (id_parceiro) REFERENCES scm_parceiro(id);


--
-- TOC entry 2056 (class 2606 OID 23563)
-- Dependencies: 1628 1641 2011
-- Name: scm_regularizacao_doc_id_usuario_scm_user_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_regularizacao_doc
    ADD CONSTRAINT scm_regularizacao_doc_id_usuario_scm_user_id FOREIGN KEY (id_usuario) REFERENCES scm_user(id);


--
-- TOC entry 2061 (class 2606 OID 23588)
-- Dependencies: 1630 1614 1983
-- Name: scm_regularizacao_item_id_maquina_scm_maquina_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_regularizacao_item
    ADD CONSTRAINT scm_regularizacao_item_id_maquina_scm_maquina_id FOREIGN KEY (id_maquina) REFERENCES scm_maquina(id);


--
-- TOC entry 2062 (class 2606 OID 23593)
-- Dependencies: 1616 1631 1985
-- Name: scm_rule_module_id_scm_module_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_rule
    ADD CONSTRAINT scm_rule_module_id_scm_module_id FOREIGN KEY (module_id) REFERENCES scm_module(id);


--
-- TOC entry 2066 (class 2606 OID 23613)
-- Dependencies: 1599 1637 1964
-- Name: scm_transformacao_doc_id_filial_scm_filial_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_transformacao_doc
    ADD CONSTRAINT scm_transformacao_doc_id_filial_scm_filial_id FOREIGN KEY (id_filial) REFERENCES scm_filial(id);


--
-- TOC entry 2065 (class 2606 OID 23608)
-- Dependencies: 1610 1976 1637
-- Name: scm_transformacao_doc_id_local_scm_local_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_transformacao_doc
    ADD CONSTRAINT scm_transformacao_doc_id_local_scm_local_id FOREIGN KEY (id_local) REFERENCES scm_local(id);


--
-- TOC entry 2064 (class 2606 OID 23603)
-- Dependencies: 1993 1624 1637
-- Name: scm_transformacao_doc_id_parceiro_scm_parceiro_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_transformacao_doc
    ADD CONSTRAINT scm_transformacao_doc_id_parceiro_scm_parceiro_id FOREIGN KEY (id_parceiro) REFERENCES scm_parceiro(id);


--
-- TOC entry 2063 (class 2606 OID 23598)
-- Dependencies: 2011 1641 1637
-- Name: scm_transformacao_doc_id_usuario_scm_user_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_transformacao_doc
    ADD CONSTRAINT scm_transformacao_doc_id_usuario_scm_user_id FOREIGN KEY (id_usuario) REFERENCES scm_user(id);


--
-- TOC entry 2071 (class 2606 OID 23638)
-- Dependencies: 1966 1601 1639
-- Name: scm_transformacao_item_id_gabinete_scm_gabinete_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_transformacao_item
    ADD CONSTRAINT scm_transformacao_item_id_gabinete_scm_gabinete_id FOREIGN KEY (id_gabinete) REFERENCES scm_gabinete(id);


--
-- TOC entry 2070 (class 2606 OID 23633)
-- Dependencies: 1608 1639 1974
-- Name: scm_transformacao_item_id_jogo_scm_jogo_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_transformacao_item
    ADD CONSTRAINT scm_transformacao_item_id_jogo_scm_jogo_id FOREIGN KEY (id_jogo) REFERENCES scm_jogo(id);


--
-- TOC entry 2069 (class 2606 OID 23628)
-- Dependencies: 1983 1639 1614
-- Name: scm_transformacao_item_id_maquina_scm_maquina_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_transformacao_item
    ADD CONSTRAINT scm_transformacao_item_id_maquina_scm_maquina_id FOREIGN KEY (id_maquina) REFERENCES scm_maquina(id);


--
-- TOC entry 2068 (class 2606 OID 23623)
-- Dependencies: 1639 1618 1987
-- Name: scm_transformacao_item_id_moeda_scm_moeda_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_transformacao_item
    ADD CONSTRAINT scm_transformacao_item_id_moeda_scm_moeda_id FOREIGN KEY (id_moeda) REFERENCES scm_moeda(id);


--
-- TOC entry 2073 (class 2606 OID 23648)
-- Dependencies: 1642 1950 1587
-- Name: scm_user_empresa_id_empresa_scm_empresa_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_user_empresa
    ADD CONSTRAINT scm_user_empresa_id_empresa_scm_empresa_id FOREIGN KEY (id_empresa) REFERENCES scm_empresa(id);


--
-- TOC entry 2072 (class 2606 OID 23643)
-- Dependencies: 2011 1642 1641
-- Name: scm_user_empresa_user_id_scm_user_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_user_empresa
    ADD CONSTRAINT scm_user_empresa_user_id_scm_user_id FOREIGN KEY (user_id) REFERENCES scm_user(id);


--
-- TOC entry 2075 (class 2606 OID 23658)
-- Dependencies: 1603 1643 1968
-- Name: scm_user_group_group_id_scm_group_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_user_group
    ADD CONSTRAINT scm_user_group_group_id_scm_group_id FOREIGN KEY (group_id) REFERENCES scm_group(id);


--
-- TOC entry 2074 (class 2606 OID 23653)
-- Dependencies: 1641 2011 1643
-- Name: scm_user_group_user_id_scm_user_id; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_user_group
    ADD CONSTRAINT scm_user_group_user_id_scm_user_id FOREIGN KEY (user_id) REFERENCES scm_user(id);


--
-- TOC entry 2053 (class 2606 OID 23548)
-- Dependencies: 1989 1622 1620
-- Name: sisi_2; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_movimentacao_item
    ADD CONSTRAINT sisi_2 FOREIGN KEY (id_movimentacao_doc) REFERENCES scm_movimentacao_doc(id);


--
-- TOC entry 2060 (class 2606 OID 23583)
-- Dependencies: 1630 1628 1997
-- Name: sisi_4; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_regularizacao_item
    ADD CONSTRAINT sisi_4 FOREIGN KEY (id_regularizacao_doc) REFERENCES scm_regularizacao_doc(id);


--
-- TOC entry 2067 (class 2606 OID 23618)
-- Dependencies: 1639 1637 2007
-- Name: sisi_6; Type: FK CONSTRAINT; Schema: public; Owner: khronos
--

ALTER TABLE ONLY scm_transformacao_item
    ADD CONSTRAINT sisi_6 FOREIGN KEY (id_transformacao_doc) REFERENCES scm_transformacao_doc(id);


--
-- TOC entry 2112 (class 0 OID 0)
-- Dependencies: 3
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2010-02-12 15:50:47 BRST

--
-- PostgreSQL database dump complete
--

