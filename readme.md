
### Roles:

- **Owner**: Administrador principal do aplicativo.
- **Administrator**: Administrador que pode gerenciar todos os aspectos do aplicativo.
- **Member**: Usuários normais que podem acessar e utilizar as funcionalidades do aplicativo.
- **Anonymous**: Visitantes não autenticados que têm acesso limitado ao aplicativo.


### Permissions Table:

|                                 | Administrator | Member Basic | Member Pro | Anonymous |
| ------------------------------- | ------------- | ------------ | ---------- | --------- |
| Gerenciar clientes              | ✅             | ✅            | ✅          | ❌         |
| Gerenciar compras               | ✅             | ✅            | ✅          | ❌         |
| Visualizar histórico de compras | ✅             | ✅            | ✅          | ❌         |
| Criar métricas                  | ✅             | ❌            | ✅          | ❌         |
| Visualizar métricas             | ✅             | ❌            | ✅          | ❌         |
| Exportar métricas               | ✅             | ❌            | ✅          | ❌         |
| Gerar relatórios                | ✅             | ❌            | ✅          | ❌         |
| Gerenciar usuários              | ✅             | ✅            | ✅          | ❌         |
| Configurações do aplicativo     | ✅             | ✅            | ✅          | ❌         |

> ✅ = allowed
> ❌ = not allowed
> ⚠️ = allowed w/ conditions

**Basic**: 
  1. Limite de 200 clients por organizção
  2. Não tem permissões para relatorios e graficos

**Pro**: Clients Ilimitados, acesso aos relatorios