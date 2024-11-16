import { Category, ResultProductType } from "./types";

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
    const groupedData: Category[] = data.reduce((acc: Category[], item: any) => {
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
                });
            }
        }

        return acc;

    }, []);

    return groupedData;

}


export function transformCategoryArray(categories: Category[]): ResultProductType[] {
    const result : ResultProductType[] = [];

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