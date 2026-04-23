# Kommo API SDK (V4) 🚀

SDK moderno, robusto, resiliente e **totalmente tipado** em TypeScript para a API V4 da [Kommo CRM](https://kommo.com). Desenhado para remover o atrito na comunicação com a API da Kommo, encapsulando vulnerabilidades e oferecendo uma experiência de desenvolvedor (DX) premium com IntelliSense nativo.

## 📦 Instalação

```bash
npm install kommo-aiatende-api
# ou
yarn add kommo-aiatende-api
# ou
pnpm add kommo-aiatende-api
```

---

## 🛠 Funcionalidades e Mapeamento
Um dos grandes diferenciais desta biblioteca é a padronização das inconsistências da Documentação da Kommo. 
Abaixo está o **Escopo Padrão de 100% de Cobertura** implementado no cliente:

- [x] **Leads**, **Contatos** e **Empresas**: CRUD completo.
- [x] **Unsorted (Caixa de Entrada)**: Aceitação, recusa e linkagem para pipelines.
- [x] **Pipelines e Status (Estágios)**: Gestão de funis incluindo cores RGB validadas.
- [x] **Campos Personalizados (Custom Fields & Groups)**: Tratamento tipado para Enum types e Multitexts.
- [x] **Usuários e Funções (Roles)**: Suporte a Rights Limits estruturados.
- [x] **Tarefas (Tasks)** e **Anotações (Notes)**: Automação completa do CRM interno com tratamento de `result` textuais da V4.
- [x] **Eventos (Events)**: Log System com `value_after` e `value_before` tipados via polimorfismo.
- [x] **Catálogos / Elements (Lists)**.
- [x] **Vínculos (Links)**: Associações entre leads/contacts e validações pre-flight no backend para evitar BadRequests de Filtros cruzados falhos.
- [x] **Tags (Etiquetas)**: Validadores de Hex-colors forçados apenas para Entidades suportadas (Leads).
- [x] **Modelos (Chat Templates / WABA)**: Gestão global do WABA (Meta API), submissão de Reviews, Modificações de status com proteções (templates WABA só alteram em caso de "draft").
- [x] **Webhooks**: Gerenciamento completo com a particularidade do Delete HTTP baseado em URL `destination`, ao invés de ID.
- [x] **Fontes (Sources) & WebButtons**: Divisão arquitetural correta, para gestão robusta dos fluxos Frontend x Backend da sua I.A.
- [x] **Salesbots**: Pre-flight de rate Limits bloqueando envio massivo maior que `100 bots` por fila e aviso em botões longos no DOM Mobile.
- [x] **Files API & CDN**: Gerenciamento binário multi-part estruturado e fallback nativo na resposta inconsistente dos "Arrays brutos e Embedded JSONs". Separação do uso da infra `v1.0` de Drive, e da Infra `api/v4` de anexos de entidade.

---

## 🚀 Configuração Básica e Autenticação

A biblioteca gerencia toda a serialização do Body JSON e QueryStrings, bastando que você cuide do seu Token Bearer.

```typescript
import { KommoClient } from 'kommo-aiatende-api';

const client = new KommoClient({
  domain: 'meudominio', // Não inclua ".kommo.com", apenas o subdomínio base!
  accessToken: 'SEU_BEARER_TOKEN_AQUI'
});

// Acessando as entidades - Exemplo de GET simples com Paginação
const { _embedded: { leads }, _page } = await client.leads.list({
    limit: 50,
    page: 2,
    with: 'contacts' // O Auto-complete trará quais parâmetros `with` a SDK suporta.
});

console.log(`Buscando a pagina ${ _page }. Total de leads recebidos: ${leads?.length}`);
```

*Nota Cautelar: Todos os métodos assumem que seus Access Tokens estão sendo refrescados por sua infraestrutura OAuth 2.0 externa.*

---

## 📖 Exemplos Práticos de Uso Avançado

### 1. Criando Entidades com Proteção Tipada
```typescript
async function criarNegocioEstrategico() {
  const result = await client.leads.create({
    name: 'Lead Inteligência Artificial',
    price: 15400,
    pipeline_id: 8887,
    tags_to_add: [
        { name: 'VIP' }
    ]
  });
  
  console.log('Lead ID: ', result._embedded?.leads?.[0].id);
}
```

### 2. Vínculos e Lotes (Links Batch)
Exemplo vinculando um Contato a um Lead recém-criado, utilizando normalização automática das strings de metadados:
```typescript
await client.links.link('leads', 15591, [
    {
       to_entity_type: 'contacts',
       to_entity_id: 11069775,
       metadata: {
          is_main: true // A SDK serializa e aceita "is_main" ao invés do confuso "main_contact" de Payload cruzado
       }
    }
]);
```

### 3. Rate Limits e Pre-Flight Blockers (Ex: SalesBots)
Esqueça o Erro "403 Limit Exceeded" silencioso na Kommo. A própria SDK bloqueia ações fisicamente antes delas atingirem os cabos de rede:
```typescript
try {
   await client.salesbots.runMany([...105 itens...]); 
} catch (e) {
   // ERRO PRÉVIO GERADO NO NODE: 
   // "A API da Kommo limita o 'runMany' a no máximo 100 salesbots por requisição."
}
```

### 4. Gestão de Arquivos e Binários (Files API)
A SDK se encarrega de instruir o HTTP Client a setar os Data-Types de _octet-stream_. É só dar o Buffer Node para ele:

```typescript
const { session_token } = await client.files.service.createUploadSession({ 
   file_name: "Contrato.pdf",
   file_size: 150000 
});

await client.files.service.uploadPart(session_token, myPdfBufferData);
```

---

## 🛡️ Tratamento de Erros e `KommoApiError`

Para uma excelente depuração no seu console ou Grafana, qualquer rota do Server falha lançará a classe empacotada abstrata `KommoApiError`. Tratamentos assíncronos não resolvidos (204 e 202) são traduzidos polidamente em promessas `void`.

Você mapeia o rastro do servidor nativo assim:

```typescript
import { KommoApiError } from 'kommo-aiatende-api/errors';

try {
  await client.leads.getById(99999999);
} catch (error) {
  if (error instanceof KommoApiError) {
    console.error(`[ KOMMO API ERROR ] - HTTP ${error.status}`); // ex: 404
    console.error(`=> Título: ${error.title}`);
    console.error(`=> Detalhe: ${error.detail}`);
    
    // Payload JSON completo devolvido pela web
    console.log(error.raw);
  } else {
    // Erros padões de Syntax NodeJS ou da engine V8
    console.error(error);
  }
}
```

## 🏗️ Padrões Internos & Arquitetura (Architecture)
- **Raw Body Conversions:** Rotas da Kommo v4 exigem arrays brutos (`[ {...} ]`) injetados diretamente no Corpo do Payload. A SDK faz a normalização e envelopamento se você enviou Arrays ou Objetos Únicos num request que exija coleção no Backend da Rússia.
- **Query String Normalization (`qs`)**: O Typescript utiliza o pacote `qs` formatado para `brackets`, convertendo arrays lógicos Node em arrays compreensivos pela V4 (Ex: `{ filter_id: [1,2] }` vira `?filter[id][]=1&filter[id][]=2`) sem fricção pro desenvolvedor.

---
## 📄 Licença
Licenciado livremente sob os termos da licença MIT. 
Sinta-se à vontade para "Forkar" e ramificar customizações em sua infraestrutura!
