-- FAQ bootstrap data
INSERT INTO "tb_faq" ("question","answer","created_at","updated_at")
SELECT
'Como funciona a autenticação via SMS?',
'Após inserir seu número de celular, você receberá um código de verificação por SMS. Digite esse código no aplicativo para fazer login. Isso garante que apenas usuários autenticados possam acessar determinadas funcionalidades do aplicativo.',
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
WHERE NOT EXISTS (
SELECT 1 FROM "tb_faq"
WHERE "question"='Como funciona a autenticação via SMS?'
);

INSERT INTO "tb_faq" ("question","answer","created_at","updated_at")
SELECT
'Como posso marcar um ponto de alagamento?',
'Para marcar um ponto de alagamento: 1. Acesse o mapa interativo. 2. Selecione o local onde ocorreu o alagamento. 3. Envie uma imagem que comprove o alagamento. 4. Escolha o nível de gravidade (leve, moderado ou interditado). 5. Confirme sua localização.',
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
WHERE NOT EXISTS (
SELECT 1 FROM "tb_faq"
WHERE "question"='Como posso marcar um ponto de alagamento?'
);

INSERT INTO "tb_faq" ("question","answer","created_at","updated_at")
SELECT
'Como posso visualizar os pontos de alagamento registrados?',
'O aplicativo exibe todos os pontos de alagamento registrados em tempo real no mapa interativo.',
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
WHERE NOT EXISTS (
SELECT 1 FROM "tb_faq"
WHERE "question"='Como posso visualizar os pontos de alagamento registrados?'
);

INSERT INTO "tb_faq" ("question","answer","created_at","updated_at")
SELECT
'O que acontece quando recebo um alerta sobre um ponto de alagamento?',
'Quando você estiver próximo a um ponto de alagamento, receberá um alerta perguntando se o local ainda está alagado.',
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
WHERE NOT EXISTS (
SELECT 1 FROM "tb_faq"
WHERE "question"='O que acontece quando recebo um alerta sobre um ponto de alagamento?'
);

-- Admin bootstrap
INSERT INTO "tb_user_admin" ("name","email","password","active","created_at","updated_at")
VALUES (
'Rayane Melo',
'ray@gmail.com',
'$2b$10$IGR0JVrsi/hIK44YVqcZhOruXgxtsAlcfea196pelsDkZv0uJzCp6',
true,
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
)
ON CONFLICT ("email")
DO UPDATE SET "active"=EXCLUDED."active";

-- Flood levels bootstrap
INSERT INTO "tb_flood_level" ("level","created_at","updated_at")
SELECT 'leve',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "tb_flood_level" WHERE "level"='leve');

INSERT INTO "tb_flood_level" ("level","created_at","updated_at")
SELECT 'moderado',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "tb_flood_level" WHERE "level"='moderado');

INSERT INTO "tb_flood_level" ("level","created_at","updated_at")
SELECT 'interditado',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "tb_flood_level" WHERE "level"='interditado');
