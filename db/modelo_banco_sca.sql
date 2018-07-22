CREATE TABLE sca_status_mensagem (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  nome_status VARCHAR NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE scm_config (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR NULL,
  descricao VARCHAR NULL,
  value VARCHAR NULL,
  fl_system BOOL NULL,
  PRIMARY KEY(id)
);

CREATE TABLE sca_tipo_mensagem (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  nome_tipo_mensagem VARCHAR NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE sca_account (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  nome_account VARCHAR NOT NULL,
  email_account VARCHAR NULL,
  fl_ativa BOOL NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE scm_module (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE scm_rule (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR NOT NULL,
  description VARCHAR NULL,
  module_id INTEGER UNSIGNED NULL,
  PRIMARY KEY(id),
  INDEX scm_rule_FKIndex1(module_id),
  FOREIGN KEY(module_id)
    REFERENCES scm_module(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE scm_group (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR NOT NULL,
  sca_account_id INTEGER UNSIGNED NOT NULL,
  PRIMARY KEY(id),
  INDEX scm_group_FKIndex1(sca_account_id),
  FOREIGN KEY(sca_account_id)
    REFERENCES sca_account(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE sca_clientes (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  cod_cliente VARCHAR NULL,
  nome_cliente VARCHAR NOT NULL,
  sca_account_id INTEGER UNSIGNED NOT NULL,
  id_responsavel INTEGER UNSIGNED NULL,
  fl_acesso_portal BOOL NULL,
  PRIMARY KEY(id),
  INDEX tb_clientes_FKIndex1(sca_account_id),
  FOREIGN KEY(sca_account_id)
    REFERENCES sca_account(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE sca_departamentos (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  cod_departamento VARCHAR NULL,
  nome_departamento VARCHAR NOT NULL,
  id_gerente INTEGER UNSIGNED NULL,
  sca_account_id INTEGER UNSIGNED NOT NULL,
  PRIMARY KEY(id),
  INDEX tb_departamentos_FKIndex1(sca_account_id),
  FOREIGN KEY(sca_account_id)
    REFERENCES sca_account(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE sca_account_config (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  sca_account_id INTEGER UNSIGNED NOT NULL,
  nome_parametro VARCHAR NOT NULL,
  desc_parametro VARCHAR NULL,
  valor_parametro VARCHAR NULL,
  PRIMARY KEY(id),
  INDEX tb_account_config_FKIndex1(sca_account_id),
  FOREIGN KEY(sca_account_id)
    REFERENCES sca_account(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE scm_group_rule (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  group_id INTEGER UNSIGNED NOT NULL,
  rule_id INTEGER UNSIGNED NOT NULL,
  PRIMARY KEY(id),
  INDEX scm_group_rule_FKIndex1(rule_id),
  INDEX scm_group_rule_FKIndex2(group_id),
  FOREIGN KEY(rule_id)
    REFERENCES scm_rule(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(group_id)
    REFERENCES scm_group(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE scm_user (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  sca_account_id INTEGER UNSIGNED NOT NULL,
  sca_clientes_id INTEGER UNSIGNED NULL,
  sca_departamentos_id INTEGER UNSIGNED NOT NULL,
  tipo_usuario VARCHAR NOT NULL,
  nome_usuario VARCHAR NOT NULL,
  login_usuario VARCHAR NOT NULL,
  senha_usuario VARCHAR NOT NULL,
  recebe_mensagem BOOL NULL,
  idioma_usuario VARCHAR NULL,
  email VARCHAR NULL,
  fl_system BOOL NOT NULL,
  fl_status BOOL NULL,
  PRIMARY KEY(id),
  INDEX tb_usuarios_FKIndex1(sca_departamentos_id),
  INDEX tb_usuarios_FKIndex2(sca_clientes_id),
  INDEX tb_usuarios_FKIndex3(sca_account_id),
  FOREIGN KEY(sca_departamentos_id)
    REFERENCES sca_departamentos(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(sca_clientes_id)
    REFERENCES sca_clientes(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(sca_account_id)
    REFERENCES sca_account(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE sca_postagens (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  data_postagem DATETIME NULL,
  texto_postagem VARCHAR(1000) NULL,
  sca_account_id INTEGER UNSIGNED NOT NULL,
  sca_clientes_id INTEGER UNSIGNED NOT NULL,
  scm_user_id INTEGER UNSIGNED NOT NULL,
  log_leituras INTEGER UNSIGNED NULL,
  log_downloads INTEGER UNSIGNED NULL,
  fl_publicado BOOL NULL,
  PRIMARY KEY(id),
  INDEX tb_postagens_FKIndex1(scm_user_id),
  INDEX tb_postagens_FKIndex2(sca_clientes_id),
  INDEX tb_postagens_FKIndex3(sca_account_id),
  FOREIGN KEY(scm_user_id)
    REFERENCES scm_user(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(sca_clientes_id)
    REFERENCES sca_clientes(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(sca_account_id)
    REFERENCES sca_account(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE sca_mensagens (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  sca_account_id INTEGER UNSIGNED NOT NULL,
  sca_tipo_mensagem_id INTEGER UNSIGNED NOT NULL,
  sca_status_mensagem_id INTEGER UNSIGNED NOT NULL,
  sca_postagens_id INTEGER UNSIGNED NOT NULL,
  data_mensagem DATETIME NULL,
  remetente VARCHAR NULL,
  destinatarios VARCHAR NULL,
  assunto VARCHAR NULL,
  corpo VARCHAR(1000) NULL,
  PRIMARY KEY(id),
  INDEX tb_mensagens_FKIndex1(sca_postagens_id),
  INDEX tb_mensagens_FKIndex2(sca_status_mensagem_id),
  INDEX tb_mensagens_FKIndex3(sca_tipo_mensagem_id),
  INDEX sca_mensagens_FKIndex4(sca_account_id),
  FOREIGN KEY(sca_postagens_id)
    REFERENCES sca_postagens(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(sca_status_mensagem_id)
    REFERENCES sca_status_mensagem(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(sca_tipo_mensagem_id)
    REFERENCES sca_tipo_mensagem(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(sca_account_id)
    REFERENCES sca_account(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE sca_mensagens_log (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  sca_mensagens_id INTEGER UNSIGNED NOT NULL,
  data_log DATETIME NULL,
  texto_log VARCHAR NULL,
  PRIMARY KEY(id),
  INDEX tb_mensagens_log_FKIndex1(sca_mensagens_id),
  FOREIGN KEY(sca_mensagens_id)
    REFERENCES sca_mensagens(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE sca_anexos (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  sca_postagens_id INTEGER UNSIGNED NOT NULL,
  nome_anexo VARCHAR NULL,
  caminho_anexo VARCHAR NULL,
  tipo_anexo VARCHAR NULL,
  PRIMARY KEY(id),
  INDEX tb_anexos_FKIndex1(sca_postagens_id),
  FOREIGN KEY(sca_postagens_id)
    REFERENCES sca_postagens(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE sca_logleituras (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  sca_postagens_id INTEGER UNSIGNED NOT NULL,
  data_leitura DATETIME NULL,
  id_usuario INTEGER UNSIGNED NULL,
  PRIMARY KEY(id),
  INDEX tb_logleituras_FKIndex1(sca_postagens_id),
  FOREIGN KEY(sca_postagens_id)
    REFERENCES sca_postagens(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE sca_logdownloads (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  sca_anexos_id INTEGER UNSIGNED NOT NULL,
  data_download DATETIME NULL,
  id_usuario INTEGER UNSIGNED NULL,
  PRIMARY KEY(id),
  INDEX tb_downloads_FKIndex1(sca_anexos_id),
  FOREIGN KEY(sca_anexos_id)
    REFERENCES sca_anexos(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE scm_user_group (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INTEGER UNSIGNED NULL,
  group_id INTEGER UNSIGNED NULL,
  PRIMARY KEY(id),
  INDEX scm_user_group_FKIndex1(group_id),
  INDEX scm_user_group_FKIndex2(user_id),
  FOREIGN KEY(group_id)
    REFERENCES scm_group(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(user_id)
    REFERENCES scm_user(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

