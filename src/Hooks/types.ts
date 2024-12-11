export type Category = {
    idCategory: number;
    categoryName: string;
};

export type CategoryJoinProductType = {
    idCategory: number;
    categoryName: string;
    productTypes: ProductTypeJoinProductTypeAttribute[];
};

export type AllProductData = {
    idCategory: number;
    categoryName: string;
    productTypes: ProductTypeJoinProduct[];
};


export type ProductTypeJoinProductTypeAttribute = {
    idProductType: number;
    productTypeName: string;
    attributes: Attribute[];
};

export type ProductTypeJoinProduct = {
    idProductType: number;
    productTypeName: string;
    products: ProductJoinProductAttribute[];
}



export type Attribute = {
    attributeId?: number;
    attributeName: string;
    attributeType: string;
    parent: string;
    attributeValue: string;
    idParent?: number;
};


export type ProductJoinProductType = {
    idProduct?: number;
    productName: string;
    price: string;
    imageUrl ?: string;
    productType?: ProductTypeJoinCategory | null;
}

export type ProductAttributeJoinProduct = {
    idAttribute?: number;
    attributeName: string;
    attributeValue: string;
    product?: ProductJoinProductType;
}

export type ProductTypeJoinCategory = {
        idProductType: number;
        productTypeName: string;
        category: Category;

};

export type ProductJoinProductAttribute = {
    idProduct: number;
    productName: string;
    price: number;
    imageUrl: string;
    attributes: Attribute[];
}

export type ProductAttribute = {
    idAttribute: number;
    attributeName: string;
    attributeValue: string;
}

export type AllDataProps = {
    idCategory: number;
    categoryName: string;
    idProductType: number;
    productTypeName: string;
    idProduct: number;
    price: number;
    productName: string;
    imageUrl: string;
    idAttribute: number;
    attributeName: string;
    attributeValue: string;
    attributeType: string;
    parent: string;
    idParent: number;
}

export type PointOfSale = {
    idPointOfSale ?: number;
    pointOfSaleName: string;
    address: string;
}

export type PointOfSaleDestination = {
    pointOfSaleDestinationId ?: number;
    pointOfSaleName: string;
    address: string;
}

export type Permissions = {
    canAddCategory: boolean;
    canDeleteCategory: boolean;
    canEditCategory: boolean;
    canAddAppConfiguration: boolean;
    canEditAppConfiguration: boolean;
    canAddProduct: boolean;
    canDeleteProduct: boolean;
    canEditProduct: boolean;
    canAddProductType: boolean;
    canDeleteProductType: boolean;
    canAddEmployee: boolean;
    canDeleteEmployee: boolean;
    canEditEmployee: boolean;
    canAddPointOfSale: boolean;
    canDeletePointOfSale: boolean;
    canEditPointOfSale: boolean;
    canAddLoss: boolean;
    canDeleteLoss: boolean;
    canEditLoss: boolean;
    canAddOrder: boolean;
    canDeleteOrder: boolean;
    canEditOrder: boolean;
    canAddSale: boolean;
    canDeleteSale: boolean;
    canEditSale: boolean;
    canAddTransfer: boolean;
    canDeleteTransfer: boolean;
    canEditTransfer: boolean;
    canEditProductStock: boolean;
    canEditCommandStatus: boolean;
    canConfirmCommand: boolean;
};

export type Employee = {
    idEmployee?: number;
    nameEmployee: string;
    mailEmployee: string;
    password?: string;
    pointOfSale?: PointOfSale;
    permissions: Permissions; 
};

export type Transfer = {
    idTransfer?: number;
    transferDate : string;
    transferStatus: string;
    pointOfSaleSource ?: PointOfSale;
    pointOfSaleDestination: PointOfSale;
}

export type TransferData = {
    idTransfer: number;
    pointOfSaleDestionationId: number;
    pointOfSaleSourceId: number | null;
    transferDate: string;
    transferStatus: string;
    idTransferRow: number;
    idProduct: number;
    quantityProductTransfer: number;
    productName: string;
    price: number;
    idPointOfSale: number;
    pointOfSaleName: string;
    address: string;
  };

export type TransferRow = {
    idTransferRow ?: number;
    quantityProductTransfer: number;
    product: ProductJoinProductAttribute;
    transfer?: Transfer;
}

export type TransferRowGetted = {
    idTransferRow ?: number;
    quantityProductTransfer: number;
    product: ProductJoinProductAttribute;
}

export type TransferGetted = {
    idTransfer?: number;
    transferDate : string;
    transferStatus: string;
    pointOfSaleSource?: PointOfSale;
    pointOfSaleDestination: PointOfSale;
    transferRows: TransferRowGetted[];
}

export type StockProductDTO = {
    idCategory: number;
    categoryName: string;
    idProductType: number;
    productTypeName: string;
    idProduct: number;
    productName: string;
    price: number;
    imageUrl: string;
    idStock: number;
    quantityStock: number;
    idPointOfSale: number;
    pointOfSaleName: string;
    address: string;
  }

  export type ProductStock = {
    idStock: number;
    idProduct: number;
    productName: string;
    price: number;
    imageUrl: string;
    quantityStock: number;
  }

  export type ProductTypeWithProductStock = {
    idProductType: number;
    productTypeName: string;
    products: ProductStock[];
  }

  export type CategoryWithStock = {
    idCategory: number;
    categoryName: string;
    productTypes: ProductTypeWithProductStock[];
  }

  export type ProductStockPosted = {
    idStock ?: number;
    quantityStock: number;
    product: ProductJoinProductAttribute;
    pointOfSale: PointOfSale | null;
  }

  export type Sale = {
    idSale?: number;
    saleDate: string;
    pointOfSale: PointOfSale;
    totalPrice: number;
  }

  export type SaleRow = {
    idSaleRow?: number;
    sale?: Sale;
    product: ProductStock;
    quantitySale: number;
    priceSale: number;
  }

  export type SaleRowGetted = {
    idSaleRow: number;
    idProduct: number;
    imageUrl: string;
    price: number;
    priceSale: number;
    productName: string;
    quantitySale: number;
  }

  export type SaleGetted = {
    idSale: number;
    idPointOfSale: number;
    saleDate: number;
    totalPrice: number;
    saleRows: SaleRowGetted[];
  }