import type { Schema, Struct } from '@strapi/strapi';

export interface ItemPedidoItens extends Struct.ComponentSchema {
  collectionName: 'components_item_pedido_itens';
  info: {
    displayName: 'itens';
    icon: '';
  };
  attributes: {};
}

export interface PedidoItens extends Struct.ComponentSchema {
  collectionName: 'components_pedido_itens';
  info: {
    displayName: 'itens';
    icon: 'book';
  };
  attributes: {
    image: Schema.Attribute.Media<'images', true>;
    name: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'item-pedido.itens': ItemPedidoItens;
      'pedido.itens': PedidoItens;
    }
  }
}
