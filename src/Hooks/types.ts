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
    attributes: ProductTypeAttribute[];
};

export type ProductTypeJoinProduct = {
    idProductType: number;
    productTypeName: string;
    products: ProductJoinProductAttribute[];
}



export type ProductTypeAttribute = {
    attributeId: number;
    attributeName: string;
    attributeType: string;
};


export type ProductJoinProductType = {
    idProduct?: number;
    productName: string;
    price: string;
    imageUrl ?: string;
    productType?: ProductTypeJoinCategory | null;
}

export type ProductAttributeJoinProduct = {
    idAttribute: number;
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
    attributes: ProductAttribute[];
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
}

export type PointOfSale = {
    idPointOfSale ?: number;
    pointOfSaleName: string;
    address: string;
}