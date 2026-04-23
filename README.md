# Kommo API SDK (V4) 🚀

SDK moderno, resiliente e **totalmente tipado** em TypeScript para a API V4 da [Kommo CRM](https://kommo.com).


## 📦 Instalação

```bash
npm install kommo-aiatende-api
# ou
yarn add kommo-aiatende-api
# ou
pnpm add kommo-aiatende-api
```

## ✨ Funcionalidades Mapeadas

Esta biblioteca foi desenhada com alto nível de rigor às complexidades da documentação da Kommo, encapsulando vulnerabilidades e garantindo auto-complete puro via Typescript (IntelliSense) em centenas de propriedades:

*   **Entidades Base:** `leads`, `contacts`, `companies`
*   **Caixa de Entrada (Unsorted):** Aceitar, recusar e vincular dados do pipeline.
*   **Funis (Pipelines & Status):** Configuração estrutural do CRM.
*   **Campos Personalizados (Custom Fields & Groups):** Inclusão de tipagem complexa para metadados invisíveis.
*   **Usuários e Funções (Users & Roles):** Leitura de Rights Limit.
*   **Notas e Tarefas (Notes & Tasks):** Com resolução inteligente do campo result.
*   **Eventos (Events):** Logs estruturados para ValueType Polymorphism.
*   **Listas (Catalogs & Elements)**.
*   **Tags:** Operações de batch patching e validações de Hex colors.
*   **Vínculos (Links):** Proteções Pre-flight em filtros essenciais.
*   **Salesbots & Templates (Waba):** Controle rigoroso de disparos com validações Max Length Limits.
*   **Integrações Externas:** Fontes (`sources`), Webhooks e Botões de Chat Web.


## 🚀 Configuração Básica

Inicializando e injetando o cliente em sua aplicação Node.js:

```typescript
import { KommoClient } from 'kommo-aiatende-api';

const client = new KommoClient({
  domain: 'meudominio', // Não inclua ".kommo.com", apenas o subdomínio!
  accessToken: 'SEU_BEARER_TOKEN_AQUI'
});
```

*Nota: Todos os métodos assumem que seus tokens são válidos. Você deve implementar o fluxo OAuth2.0 separadamente para emitir e reciclar seus tokens.*

---

## 📖 Exemplos Rápidos de Uso

### 1. Criando Entidades com Proteção Typada
```typescript
import { KommoClient } from 'kommo-aiatende-api';

const client = new KommoClient({ domain: 'meudominio', accessToken: 'TOKEN' });

async function criarLead() {
  const result = await client.leads.create({
    name: 'Novo Negócio Estratégico',
    price: 15400,
    tags_to_add: [
        { name: 'VIP' }
    ]
  });
  
  console.log('Lead criado com sucesso: ', result._embedded?.leads?.[0].id);
}
```

### 2. Vínculos Avançados (Links)

Conecte um contato diretamente ao seu Lead recém-criado em Lote (Batch).
```typescript
await client.links.link('leads', 15591, [
    {
       to_entity_type: 'contacts',
       to_entity_id: 11069775,
       metadata: {
          is_main: true // O SDK normalizará as ambiguidades da API!
       }
    }
]);
```

### 3. Executando um Salesbot com Barreiras Físicas

Esqueça o Erro "403 Limit Exceeded" da Kommo por não conhecer os limites. A própria SDK bloqueia antes do tráfego:
```typescript
await client.salesbots.runMany([
    // ... se passar de 100 itens ...
    // Throws: "A API da Kommo limita o 'runMany' a no máximo 100 salesbots por requisição."
]);
```

### 4. Gestão do Funil (Pipelines)
```typescript
const funis = await client.pipelines.list();

const funilAtivo = funis._embedded?.pipelines?.find(p => p.is_main);
console.log('Funil Principal: ', funilAtivo?.name);
```

---

## 🛡️ Tratamento de Erros Moderno e Intuitivo

Qualquer rota falha lançará a classe `KommoApiError`. Ela empacota o padrão nativo de `application/problem+json` num wrapper explícito:

```typescript
import { KommoApiError } from 'kommo-aiatende-api/errors';

try {
  await client.leads.getById(99999999);
} catch (error) {
  if (error instanceof KommoApiError) {
    console.error('Código HTTP:', error.status); // ex: 404
    console.error('Título da Kommo:', error.title);
    console.error('Detalhe Técnico:', error.detail);
    
    // Payload brutal devolvido pela requisição (quando disponível)
    console.log(error.raw);
  }
}
```

## 🏗️ Padrões Internos (Architecture)
A lib adota dois estilos de serialização para proteger suas chamadas:
1. **Raw Body Conversions:** Rotas da Kommo v4 exigem arrays brutos (`[]`) misturados a requests sem aninhamento de object. O SDK mapeia se você enviou Arrays ou Singleton e encapsula conforme o exigido na Doc.
2. **Query String Normalization:** Usamos o `qs` com a instrução `{ arrayFormat: 'brackets' }` para evitar que seus arrays nos filtros de `GET` quebrem a formatação em backend na Rússia.


---
## 📄 Licença
Licenciado sob a Licença MIT. Sinta-se livre para ramificar e customizar seu repositório local.
