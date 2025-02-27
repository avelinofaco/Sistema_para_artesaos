# :checkered_flag: Loja Virtual para Artesãos Locais

Uma loja virtual acessível e eficiente para artesãos locais divulgarem e venderem seus produtos diretamente aos consumidores.

## :technologist: Membros da equipe

Antonio Avelino da Silva - 552416 SI
Gilardo Bento da Silva - 509145 - SI

## :bulb: Objetivo Geral
Desenvolver uma plataforma online que permita aos artesãos locais exibir, divulgar e vender seus produtos, promovendo o artesanato regional e proporcionando maior visibilidade e renda aos profissionais.

## :eyes: Público-Alvo
- Artesãos locais: Para divulgar e vender seus produtos.
- Consumidores: Pessoas interessadas em adquirir produtos artesanais exclusivos.

## :star2: Impacto Esperado
Aumentar a visibilidade e as oportunidades de negócio para artesãos locais, além de fomentar o consumo de produtos artesanais, criando um canal de fácil acesso entre artesãos e consumidores.

## :people_holding_hands: Papéis ou tipos de usuário da aplicação
- Administrador: Gerencia usuários, produtos e configurações da loja.
- Artesão: Pode cadastrar produtos, visualizar vendas e gerenciar seu inventário.
- Usuário logado (cliente): Adiciona produtos ao carrinho, finaliza compras e acompanha pedidos.
- Usuário não logado: Visualiza o catálogo de produtos.
- 
## :triangular_flag_on_post:	 Principais funcionalidades da aplicação
- Funcionalidades acessíveis a todos os usuários:
  - Visualizar o catálogo de produtos com imagens, descrições e preços.
  - Navegar pelas categorias de produtos.
- Funcionalidades restritas a usuários logados:
  - Adicionar produtos ao carrinho de compras.
  - Finalizar compras e realizar pagamentos online.
  - Acompanhar o status dos pedidos realizados.
- Funcionalidades exclusivas para artesãos:
  - Cadastrar e editar produtos.
  - Gerenciar estoque e visualizar relatórios de vendas.
- Funcionalidades exclusivas para administradores:
  - Gerenciar usuários e produtos.
  - Moderar avaliações e comentários nos produtos.

## :spiral_calendar: Entidades ou tabelas do sistema

- Usuários: Armazena informações de administradores, artesãos e clientes.
- Produtos: Contém detalhes dos produtos cadastrados, como nome, descrição, preço, imagens e categoria.
- Pedidos: Registra as compras realizadas pelos clientes, incluindo status e histórico.
- Carrinho: Tabela temporária que armazena os itens adicionados pelos clientes antes da finalização da compra.
- Categorias: Define as categorias disponíveis para organizar os produtos.
- Pagamentos: Registra os detalhes das transações realizadas.


----

:warning::warning::warning: As informações a seguir devem ser enviadas juntamente com a versão final do projeto. :warning::warning::warning:


----

## :desktop_computer: Tecnologias e frameworks utilizados

**Frontend:**

Usamos HTML, CSS e JAVASCRIPT

**Backend:**

STRAPI


## :shipit: Operações implementadas para cada entidade da aplicação


| Entidade| Criação | Leitura | Atualização | Remoção |
| --- | --- | --- | --- | --- |
| pedidos   |  X  |  X  |     |   X        
| produtos  |  X  |  X  |  X  |  X        
| Categorias|     |  X  |     |

> Lembre-se que é necessário implementar o CRUD de pelo menos duas entidades.

## :neckbeard: Rotas da API REST utilizadas

| Método HTTP | URL |
| --- | --- |
| GET | api/pedidos/|
| POST | api/produtos |
