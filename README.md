# kommo-aiatende-api

SDK não oficial, moderno e **totalmente tipado** em TypeScript para a API V4 da [Kommo CRM](https://kommo.com). Cobre todos os recursos documentados, normaliza inconsistências da API e oferece validações locais (pre-flight) para evitar erros HTTP desnecessários.

---

## 📦 Instalação

```bash
npm install kommo-aiatende-api
# ou
yarn add kommo-aiatende-api
# ou
pnpm add kommo-aiatende-api
```

---

## 🚀 Inicialização

```typescript
import { KommoClient } from 'kommo-aiatende-api';

const client = new KommoClient({
  domain: 'meusubdominio', // apenas o subdomínio, sem ".kommo.com"
  accessToken: 'SEU_ACCESS_TOKEN',
});

// Atualizar o token dinamicamente (ex: após refresh OAuth)
client.setAccessToken('NOVO_TOKEN');
```

> **Nota:** A biblioteca não gerencia o fluxo OAuth. Você deve implementar a renovação de tokens na sua infraestrutura.

---

## 🛡️ Tratamento de Erros

Todos os erros HTTP são convertidos em `KommoApiError`:

```typescript
import { KommoApiError } from 'kommo-aiatende-api';

try {
  await client.leads.getById(999999);
} catch (err) {
  if (err instanceof KommoApiError) {
    console.log(err.status);  // número HTTP (ex: 404)
    console.log(err.title);   // título do erro
    console.log(err.detail);  // detalhe técnico
    console.log(err.raw);     // corpo bruto da resposta
  }
}
```

---

## 📋 Referência Completa da API

### `client.account`

Parâmetros e configurações da conta Kommo.

| Método | Descrição |
|--------|-----------|
| `get(params?)` | Retorna informações da conta |

**Parâmetros `with` disponíveis:**

| Valor | Descrição |
|-------|-----------|
| `amojo_id` | ID da conta no serviço de chat |
| `amojo_rights` | Direitos de chat (grupos e diretos) |
| `users_groups` | Grupos de usuários da conta |
| `task_types` | Tipos de tarefas configurados |
| `version` | Versão atual da Kommo |
| `entity_names` | Nomes de entidades com traduções |
| `datetime_settings` | Configurações de data/hora |
| `drive_url` | URL base do serviço de arquivos (Files API) |

```typescript
const account = await client.account.get({
  with: ['amojo_id', 'drive_url', 'version'],
});

console.log(account.name);
console.log(account.subdomain);
console.log(account.amojo_id);
console.log(account._embedded?.drive_url);
```

---

### `client.leads`

| Método | Descrição |
|--------|-----------|
| `list(params?)` | Lista leads com filtros e paginação |
| `getById(id, params?)` | Retorna um lead por ID (ou `null` se não encontrado) |
| `create(items)` | Cria um ou mais leads |
| `update(items)` | Atualiza leads em lote |
| `updateOne(id, payload)` | Atualiza um único lead |
| `createComplex(items)` | Cria leads com contatos e empresas em uma requisição |
| `listLossReasons()` | Lista os motivos de perda configurados |
| `getLossReasonById(id)` | Retorna um motivo de perda por ID |

**Parâmetros de listagem (`ListLeadsParams`):**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `page` | `number` | Página |
| `limit` | `number` | Itens por página |
| `query` | `string` | Busca textual |
| `with` | `string \| string[]` | Blocos opcionais (`contacts`, `loss_reason`, `catalog_elements`, `is_price_modified_by_robot`, `only_deleted`, `source_id`) |
| `filter_id` | `number[]` | Filtro por IDs |
| `filter_name` | `string[]` | Filtro por nomes |
| `filter_price` | `{ from?, to? }` | Filtro por valor |
| `filter_pipeline_id` | `number[]` | Filtro por pipeline |
| `filter_responsible_user_id` | `number[]` | Filtro por responsável |
| `filter_statuses` | `{ pipeline_id, status_id }[]` | Filtro por estágio |
| `filter_created_at_from` / `_to` | `number` | Unix timestamp de criação |
| `filter_updated_at_from` / `_to` | `number` | Unix timestamp de atualização |
| `filter_closed_at_from` / `_to` | `number` | Unix timestamp de fechamento |
| `filter_closest_task_at_from` / `_to` | `number` | Unix timestamp da próxima tarefa |
| `order_created_at` | `'asc' \| 'desc'` | Ordenação por criação |
| `order_updated_at` | `'asc' \| 'desc'` | Ordenação por atualização |
| `order_id` | `'asc' \| 'desc'` | Ordenação por ID |

```typescript
const { _embedded } = await client.leads.list({
  with: ['contacts'],
  filter_pipeline_id: [1234],
  filter_statuses: [{ pipeline_id: 1234, status_id: 5678 }],
  order_created_at: 'desc',
  page: 1,
  limit: 50,
});

const leads = _embedded?.leads ?? [];
```

---

### `client.contacts`

| Método | Descrição |
|--------|-----------|
| `list(params?)` | Lista contatos |
| `getById(id, params?)` | Retorna contato por ID (ou `null`) |
| `create(items)` | Cria um ou mais contatos |
| `update(items)` | Atualiza contatos em lote |
| `updateOne(id, payload)` | Atualiza um único contato |

**Parâmetros `with` disponíveis:** `leads`, `catalog_elements`

**Filtros disponíveis:** `filter_id`, `filter_name`, `filter_created_by`, `filter_updated_by`, `filter_responsible_user_id`, `filter_created_at_from/to`, `filter_updated_at_from/to`, `filter_closest_task_at_from/to`

---

### `client.companies`

| Método | Descrição |
|--------|-----------|
| `list(params?)` | Lista empresas |
| `getById(id, params?)` | Retorna empresa por ID (ou `null`) |
| `create(items)` | Cria uma ou mais empresas |
| `update(items)` | Atualiza empresas em lote |
| `updateOne(id, payload)` | Atualiza uma única empresa |

**Parâmetros `with` disponíveis:** `leads`, `contacts`, `catalog_elements`

**Filtros disponíveis:** `filter_id`, `filter_name`, `filter_created_by`, `filter_updated_by`, `filter_responsible_user_id`, `filter_created_at_from/to`, `filter_updated_at_from/to`, `filter_closest_task_at_from/to`

---

### `client.unsorted`

Gerencia leads da caixa de entrada (Unsorted).

| Método | Descrição |
|--------|-----------|
| `list(params?)` | Lista leads não classificados |
| `getByUid(uid)` | Retorna um lead não classificado pelo UID |
| `createSip(items)` | Cria leads via integração SIP |
| `createForms(items)` | Cria leads via formulário |
| `accept(uid, payload?)` | Aceita um lead (move para pipeline) |
| `decline(uid, payload?)` | Recusa e remove um lead não classificado |
| `link(uid, payload)` | Vincula o lead a uma entidade existente |
| `summary(params?)` | Resumo estatístico dos leads não classificados |

```typescript
// Aceitar um lead não classificado
await client.unsorted.accept('UID_DO_LEAD', {
  user_id: 123,
  status_id: 456,
});

// Vincular a um lead existente
await client.unsorted.link('UID_DO_LEAD', {
  link: {
    entity_id: 9999,
    entity_type: 'leads',
  },
});
```

---

### `client.pipelines`

Gerencia funis e estágios de leads.

| Método | Descrição |
|--------|-----------|
| `list()` | Lista todos os funis |
| `getById(id)` | Retorna um funil por ID |
| `create(items)` | Cria funis |
| `update(id, payload)` | Atualiza um funil |
| `delete(id)` | Remove um funil |
| `listStatuses(pipelineId, params?)` | Lista estágios de um funil |
| `getStatusById(pipelineId, id, params?)` | Retorna um estágio por ID |
| `createStatuses(pipelineId, items)` | Cria estágios no funil |
| `updateStatus(pipelineId, id, payload)` | Atualiza um estágio |
| `deleteStatus(pipelineId, id)` | Remove um estágio |

**Parâmetro `with` disponível para Status:** `'descriptions'`

> ⚠️ **Validação local:** Estágios aceitam no máximo **3 descrições**, sem repetição de `level`, e cada descrição pode ter no máximo **1000 caracteres**. A SDK valida antes de enviar.

---

### `client.tasks`

| Método | Descrição |
|--------|-----------|
| `list(params?)` | Lista tarefas |
| `getById(id)` | Retorna tarefa por ID |
| `create(items)` | Cria tarefas |
| `update(items)` | Atualiza tarefas em lote |
| `updateOne(id, payload)` | Atualiza uma única tarefa |

**Filtros disponíveis:** `filter_id`, `filter_responsible_user_id`, `filter_is_completed`, `filter_task_type`, `filter_entity_type`, `filter_entity_id`, `filter_updated_at_from/to`

**Ordenação:** `order_complete_till`, `order_created_at`, `order_id`

---

### `client.notes`

Notas são sempre escopadas por tipo de entidade (`leads`, `contacts`, `companies`).

| Método | Descrição |
|--------|-----------|
| `listByEntity(entityType, entityId, params?)` | Lista notas de uma entidade específica |
| `listByEntityType(entityType, params?)` | Lista notas de todas as entidades do tipo |
| `getById(entityType, id)` | Retorna uma nota por ID |
| `create(entityType, items)` | Cria notas |
| `update(entityType, items)` | Atualiza notas em lote |
| `updateOne(entityType, id, payload)` | Atualiza uma única nota |
| `pin(entityType, id)` | Fixa uma nota |
| `unpin(entityType, id)` | Desafixa uma nota |

**Tipos de nota (`note_type`):** `common`, `call_in`, `call_out`, `service_message`, `extended_service_message`, `geolocation`, `image`, `video`, `voice`, `doc`, `invoice`, `site_visit`, `messenger`, `sms`, `amolink`, `drive_file`, `chat_message`, entre outros.

```typescript
// Criar nota de texto em um lead
await client.notes.create('leads', {
  entity_id: 1234,
  note_type: 'common',
  params: { text: 'Cliente confirmou reunião.' },
});

// Criar nota de chamada
await client.notes.create('leads', {
  entity_id: 1234,
  note_type: 'call_in',
  params: {
    uniq: 'UUID_DA_CHAMADA',
    duration: 120,
    source: 'minha-ura',
    link: 'https://cdn.example.com/recording.mp3',
    phone: '+5511999999999',
  },
});
```

---

### `client.events`

| Método | Descrição |
|--------|-----------|
| `list(params?)` | Lista eventos do log |
| `getById(id, params?)` | Retorna um evento por ID |
| `listTypes(params?)` | Lista os tipos de evento disponíveis |

**Parâmetros `with` disponíveis:** `contact_name`

**Filtros disponíveis:** `filter_id`, `filter_created_by`, `filter_entity`, `filter_entity_id` (exige `filter_entity` único), `filter_type`, `filter_created_at_from/to`, `filter_value_before`, `filter_value_after`

> ⚠️ **Validação local:** `filter_entity_id` só é aceito quando `filter_entity` contém exatamente **um** tipo de entidade.

---

### `client.catalogs`

Gerencia listas (catálogos) e seus elementos.

| Método | Descrição |
|--------|-----------|
| `list(params?)` | Lista catálogos |
| `getById(id)` | Retorna catálogo por ID |
| `create(items)` | Cria catálogos |
| `update(items)` | Atualiza catálogos em lote |
| `updateOne(id, payload)` | Atualiza um único catálogo |
| `listElements(listId, params?)` | Lista elementos do catálogo |
| `getElementById(listId, elementId)` | Retorna elemento por ID |
| `createElements(listId, items)` | Cria elementos no catálogo |
| `updateElements(listId, items)` | Atualiza elementos em lote |
| `updateElementById(listId, elementId, payload)` | Atualiza um único elemento |

```typescript
// Listar elementos de um catálogo com busca textual
const { _embedded } = await client.catalogs.listElements(42, {
  query: 'Produto X',
  limit: 20,
});
```

---

### `client.customFields` e `client.customFieldGroups`

#### `client.customFields`

| Método | Descrição |
|--------|-----------|
| `listEntity(entityType)` | Lista campos de uma entidade (`leads`, `contacts`, `companies`) |
| `getEntityById(entityType, id)` | Retorna campo por ID |
| `createEntity(entityType, items)` | Cria campos |
| `updateEntity(entityType, items)` | Atualiza campos em lote |
| `updateEntityById(entityType, id, payload)` | Atualiza um campo |
| `deleteEntity(entityType, id)` | Remove um campo |
| `listList(listId)` | Lista campos de um catálogo |
| `getListById(listId, customFieldId)` | Retorna campo de catálogo por ID |
| `createList(listId, items)` | Cria campos no catálogo |
| `updateList(listId, items)` | Atualiza campos do catálogo em lote |
| `updateListById(listId, customFieldId, payload)` | Atualiza um campo |
| `deleteList(listId, id)` | Remove campo do catálogo |

#### `client.customFieldGroups`

| Método | Descrição |
|--------|-----------|
| `list(entityType)` | Lista grupos de campos |
| `getById(entityType, id)` | Retorna grupo por ID |
| `create(entityType, items)` | Cria grupos |
| `update(entityType, id, payload)` | Atualiza um grupo |
| `delete(entityType, id)` | Remove um grupo |

---

### `client.users` e `client.roles`

#### `client.users`

| Método | Descrição |
|--------|-----------|
| `list(params?)` | Lista usuários |
| `getById(id, params?)` | Retorna usuário por ID |
| `create(items)` | Cria usuários (máximo **10** por requisição) |

**Parâmetros `with` disponíveis:** `role`, `group`, `uuid`, `is_free`, `is_active`, `rights`

#### `client.roles`

| Método | Descrição |
|--------|-----------|
| `list(params?)` | Lista funções/roles |
| `getById(id, params?)` | Retorna role por ID |
| `create(items)` | Cria roles |
| `update(items)` | Atualiza roles em lote |
| `delete(id)` | Remove uma role |

**Parâmetros `with` disponíveis:** `users`

---

### `client.tags`

Tags são escopadas por tipo de entidade.

| Método | Descrição |
|--------|-----------|
| `list(entityType, params?)` | Lista tags da entidade |
| `create(entityType, items)` | Cria tags |
| `updateForMany(entityType, items)` | Atualiza tags de múltiplas entidades via batch PATCH |
| `updateForOne(entityType, id, payload)` | Atualiza tags de uma entidade |

> ⚠️ **Validação local:** A propriedade `color` nas tags só é suportada para a entidade `leads`. Um aviso é emitido no console se usada em outros tipos.

```typescript
// Criar tags coloridas para leads
await client.tags.create('leads', [
  { name: 'VIP', color: '#FF0000' },
  { name: 'Urgente', color: '#FF5E00' },
]);

// Substituir as tags de um contato específico
await client.tags.updateForOne('contacts', 1234, {
  _embedded: { tags: [{ id: 99 }, { name: 'Nova Tag' }] },
});
```

---

### `client.links`

Gerencia vínculos entre entidades.

| Método | Descrição |
|--------|-----------|
| `list(entity, entityId, params?)` | Lista vínculos de uma entidade |
| `link(entity, entityId, items)` | Cria vínculos |
| `unlink(entity, entityId, items)` | Remove vínculos |

**Entidades fonte suportadas:** `leads`, `contacts`, `companies`

**Filtros disponíveis:**

| Parâmetro | Obs |
|-----------|-----|
| `filter_to_entity_id` | Deve ser usado **junto** com `filter_to_entity_type` |
| `filter_to_entity_type` | Deve ser usado **junto** com `filter_to_entity_id` |
| `filter_to_catalog_id` | Filtro por catálogo |

> ⚠️ **Validação local:** `filter_to_entity_id` e `filter_to_entity_type` devem ser fornecidos **juntos**. A SDK lança erro se apenas um deles for informado.

---

### `client.salesbots`

| Método | Descrição |
|--------|-----------|
| `list(params?)` | Lista salesbots disponíveis |
| `run(botId, payload)` | Executa um bot em um lead/contato |
| `runMany(items)` | Executa múltiplos bots em lote (máx. **100**) |
| `stop(botId, payload)` | Para a execução de um bot |
| `continueWidgetExecution(bot, botId, continueId, payload)` | Confirma execução de bloco de widget interativo |

> ⚠️ **Validações locais:**
> - `runMany` limita a **100 itens** por chamada.
> - `continueWidgetExecution` limita `execute_handlers` a **10 itens**.
> - Handlers `show` com mais de **80 caracteres** em `value` emitem aviso.
> - Handlers `show` com mais de **25 botões** lançam erro.

---

### `client.sources` e `client.websiteButtons`

#### `client.sources`

| Método | Descrição |
|--------|-----------|
| `list()` | Lista fontes de captação |
| `getById(id)` | Retorna fonte por ID |
| `create(items)` | Cria fontes (máx. **100** por vez) |
| `updateOne(id, payload)` | Atualiza uma fonte |
| `update(items)` | Atualiza fontes em lote (máx. **100**) |
| `deleteOne(id)` | Remove uma fonte |
| `delete(items)` | Remove fontes em lote |

#### `client.websiteButtons`

| Método | Descrição |
|--------|-----------|
| `list(params?)` | Lista botões de chat web |
| `getBySourceId(sourceId, params?)` | Retorna botão por source ID |
| `create(payload)` | Cria um botão de chat web |
| `connectOnlineChat(sourceId)` | Conecta chat online ao botão |
| `update(sourceId, payload)` | Atualiza um botão |

**Parâmetros `with` disponíveis para botões:** `'scripts'`

> ⚠️ **Validação local:** Se `trusted_websites` não for informado e `is_used_in_app` não for `true`, a SDK emite aviso no console.

---

### `client.chatTemplates`

Gerencia modelos de mensagem (inclui WABA/WhatsApp Business).

| Método | Descrição |
|--------|-----------|
| `list(params?)` | Lista modelos da integração atual |
| `getById(id, params?)` | Retorna modelo por ID |
| `create(items)` | Cria modelos |
| `update(items)` | Atualiza modelos em lote |
| `submitForReview(id)` | Envia modelo WABA para moderação Meta |
| `updateReviewStatus(id, reviewId, payload)` | Atualiza status de revisão (`approved`, `paused`, `rejected`) |
| `delete(items)` | Remove modelos em lote |
| `deleteOne(id)` | Remove um único modelo |

**Parâmetros `with` disponíveis:** `'reviews'` — inclui `review_status`, `is_on_review` e `_embedded.reviews`

**Filtros disponíveis:** `filter_external_id`

> ⚠️ **Validação local:** A SDK emite aviso ao tentar atualizar modelos do tipo `waba` — eles só podem ser editados quando estão em estado `draft`.

```typescript
// Criar modelo WABA (WhatsApp Business)
await client.chatTemplates.create({
  name: 'confirmacao_consulta',
  content: 'Olá {{1}}, sua consulta está confirmada para {{2}}.',
  type: 'waba',
  waba_category: 'UTILITY',
  waba_language: 'pt_BR',
  waba_examples: { '1': 'João', '2': '10/06 às 14h' },
});

// Enviar para revisão da Meta
const { _embedded } = await client.chatTemplates.submitForReview(templateId);
console.log(_embedded?.reviews?.[0].status); // "review"
```

---

### `client.webhooks`

| Método | Descrição |
|--------|-----------|
| `list(params?)` | Lista webhooks registrados |
| `create(payload)` | Cria um webhook |
| `delete(payload)` | Remove um webhook **pela URL** (`destination`) |

**Filtros disponíveis:** `filter_destination`

> ⚠️ A exclusão de webhook **não usa ID** — usa a URL de destino (`destination`). Isso é um comportamento intencional da API Kommo.

```typescript
await client.webhooks.create({
  destination: 'https://meuservidor.com/kommo-webhook',
  settings: ['add_lead', 'update_lead', 'add_contact'],
  sort: 10,
});

await client.webhooks.delete({
  destination: 'https://meuservidor.com/kommo-webhook',
});
```

**Eventos conhecidos (`settings`):** `add_lead`, `update_lead`, `delete_lead`, `restore_lead`, `add_contact`, `update_contact`, `delete_contact`, `add_company`, `update_company`, `add_task`, `update_task`, `delete_task`, entre outros.

---

### `client.files`

A Files API é dividida em três sub-módulos: `service`, `entities` e `links`.

#### `client.files.service` — CDN de arquivos (`/v1.0/files`)

| Método | Descrição |
|--------|-----------|
| `getByUuid(fileUuid)` | Retorna arquivo por UUID (ou `null` se não encontrado) |
| `list(params?)` | Lista arquivos com filtros avançados |
| `createUploadSession(payload)` | Abre uma sessão de upload multipart |
| `uploadPart(sessionToken, filePart)` | Envia parte binária do arquivo |
| `update(fileUuid, payload)` | Renomeia arquivo ou define nova versão ativa |
| `delete(items)` | Remove arquivos em lote |
| `restore(items)` | Restaura arquivos removidos |
| `listVersions(fileUuid)` | Lista versões de um arquivo |

**Filtros de listagem disponíveis:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `filter_uuid` | `string[]` | Por UUID |
| `filter_name` | `string` | Por nome |
| `filter_extensions` | `string[]` | Por extensão |
| `filter_term` | `string` | Busca textual |
| `filter_source_id` | `number` | Por fonte |
| `filter_deleted` | `boolean` | Incluir/excluir deletados |
| `filter_size_unit` / `_from` / `_to` | `number` | Por tamanho |
| `filter_date_type` | `'created_at' \| 'updated_at'` | Tipo de data |
| `filter_date_preset` | `string` | Preset de data (`day`, `week`, `month`, `year`, `last_3_days`, etc.) |
| `filter_date_from` / `_to` | `number` | Intervalo de datas (Unix) |
| `filter_created_by` / `filter_updated_by` | `number[]` | Por usuário (`-1` = cliente, `0` = robô) |

> ⚠️ **Validação local:** `update()` lança erro se `name` e `version_uuid` forem informados simultaneamente — a API não permite os dois juntos.

```typescript
// Fluxo completo de upload
const session = await client.files.service.createUploadSession({
  file_name: 'contrato.pdf',
  file_size: buffer.byteLength,
  content_type: 'application/pdf',
});

const sessionToken = (session as any).upload_url?.split('/').pop();

await client.files.service.uploadPart(sessionToken, buffer);
```

#### `client.files.entities` — Anexos em entidades (`/api/v4`)

| Método | Descrição |
|--------|-----------|
| `listAttachedToEntity(entity, entityId, params?)` | Lista arquivos anexados |
| `attachToEntity(entity, entityId, items)` | Anexa arquivos |
| `detachFromEntity(entity, entityId, items)` | Desanexa arquivos |

**Entidades suportadas:** `leads`, `contacts`, `companies`

#### `client.files.links` — Vínculos reversos de arquivo

| Método | Descrição |
|--------|-----------|
| `listLinkedEntities(fileUuid)` | Lista as entidades associadas a um arquivo |

---

## 🏗️ Arquitetura Interna

| Mecanismo | Descrição |
|-----------|-----------|
| **Raw Body** | Rotas com `RAW_BODY` na Kommo são automaticamente envelopadas como array pelo SDK |
| **Query String** | Usa `qs` com `arrayFormat: 'brackets'` — compatível com o backend da Kommo |
| **204 → null/void** | Respostas `204 No Content` são normalizadas para `null` ou arrays vazios |
| **Pre-flight checks** | Validações locais antes da requisição HTTP para evitar erros 4xx desnecessários |
| **Normalização PT→EN** | Entidades em português (`contatos`, `empresas`) são automaticamente normalizadas para o inglês usado na API |

---

## 📄 Licença

MIT — livre para uso, modificação e distribuição.
