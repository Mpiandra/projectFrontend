export type ProductTypeAttribute = {
    attributeId: number;
    attributeName: string;
    attributeType: string;
};

export type ProductType = {
    idProductType: number;
    productTypeName: string;
    attributes: ProductTypeAttribute[];
};

export type Category = {
    idCategory: number;
    categoryName: string;
    productTypes: ProductType[];
};

export type Product = {
    idProduct?: number;
    productName: string;
    price: string;
    imageUrl ?: string;
    productType: ResultProductType | null;
}

export type ProductAttribute = {
    idAttribute?: number;
    attributeName: string;
    attributeValue: string;
    product?: Product;
}

export type ResultProductType = {
        idProductType: number;
        productTypeName: string;
        category: ResultCategory;

};

export type ResultCategory = {
    idCategory: number;
    categoryName: string;
};
