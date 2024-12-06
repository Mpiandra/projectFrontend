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

export type Employee = {
    idEmployee ?: number;
    nameEmployee: string;
    mailEmployee: string;
    password?:string;
    pointOfSale?:PointOfSale;
}