import { AllDataProps, AllProductData, CategoryJoinProductType, ProductTypeJoinCategory } from "./types";

interface GroupDataProps {
    data : {
        idCategory: number;
        categoryName: string;
        idProductType: number;
        productTypeName: string;
        attributeId: number;
        attributeName: string;
        attributeType: string;
    }[]
}

export function groupData ({data} : GroupDataProps) {
    
    // Groupement des données
    const groupedData: CategoryJoinProductType[] = data.reduce((acc: CategoryJoinProductType[], item: any) => {
        // Cherche ou crée une catégorie
        let category = acc.find(c => c.idCategory === item.idCategory);
        if (!category) {
            category = {
                idCategory: item.idCategory,
                categoryName: item.categoryName,
                productTypes: [],
            };
            acc.push(category);
        }

        // Vérifie si idProductType n'est pas null
        if (item.idProductType !== null) {
            let productType = category.productTypes.find(pt => pt.idProductType === item.idProductType);
            if (!productType) {
                // Corriger ici : utilisez item.idProductType au lieu de item.productType
                productType = {
                    idProductType: item.idProductType, // Correction ici
                    productTypeName: item.productTypeName,
                    attributes: [],
                };
                category.productTypes.push(productType);
            }

            // Ajout des attributs si attributeId est valide
            if (item.attributeId !== null) {
                productType.attributes.push({
                    attributeId: item.attributeId,
                    attributeName: item.attributeName,
                    attributeType: item.attributeType,
                    parent: item.parent,
                    attributeValue: item.attributeValue
                });
            }
        }

        return acc;

    }, []);

    return groupedData;

}


export function transformCategoryArray(categories: CategoryJoinProductType[]): ProductTypeJoinCategory[] {
    const result : ProductTypeJoinCategory[] = [];

    categories.forEach(category => {
        category.productTypes.forEach(productType => {
            result.push(
                {
                    idProductType : productType.idProductType,
                    productTypeName: productType.productTypeName,
                    category : {
                        idCategory : category.idCategory,
                        categoryName: category.categoryName
                    }
                }
            )
        })
    })
    return result;
}

export function transformToAllProductData(data: AllDataProps[]): AllProductData[] {
    const categoryMap = new Map<number, AllProductData>();

    data.forEach((item) => {
        let category = categoryMap.get(item.idCategory);
        if (!category) {
            category = {
                idCategory: item.idCategory,
                categoryName: item.categoryName,
                productTypes: [],
            };
            categoryMap.set(item.idCategory, category);
        }

        let productType = category.productTypes.find(pt => pt.idProductType === item.idProductType);
        if (!productType) {
            productType = {
                idProductType: item.idProductType,
                productTypeName: item.productTypeName,
                products: [],
            };
            category.productTypes.push(productType);
        }

        let product = productType.products.find(p => p.idProduct === item.idProduct);
        if (!product) {
            product = {
                idProduct: item.idProduct,
                productName: item.productName,
                price: item.price,
                imageUrl: item.imageUrl,
                attributes: [],
            };
            productType.products.push(product);
        }

        if (item.idAttribute) {
            product.attributes.push({
                attributeId: item.idAttribute,
                attributeName: item.attributeName,
                attributeValue: item.attributeValue,
                attributeType: item.attributeType,
                parent: item.parent,
                idParent: item.idParent
            });
        }
    });

    return Array.from(categoryMap.values());
}
