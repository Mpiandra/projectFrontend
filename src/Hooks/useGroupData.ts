import { AllDataProps, AllProductData, CategoryJoinProductType, Employee, Permissions, ProductTypeJoinCategory } from "./types";

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

export function transformToEmployeeList(data: any[]): Employee[] {
    const listEmployeeFormated: Employee[] = [];
    data.map((employeeData) => {
      const permissions: Permissions = {
        canAddCategory: employeeData.canAddCategory,
        canDeleteCategory: employeeData.canDeleteCategory,
        canEditCategory: employeeData.canEditCategory,
        canAddAppConfiguration: employeeData.canAddAppConfiguration,
        canEditAppConfiguration: employeeData.canEditAppConfiguration,
        canAddProduct: employeeData.canAddProduct,
        canDeleteProduct: employeeData.canDeleteProduct,
        canEditProduct: employeeData.canEditProduct,
        canAddProductType: employeeData.canAddProductType,
        canDeleteProductType: employeeData.canDeleteProductType,
        canAddEmployee: employeeData.canAddEmployee,
        canDeleteEmployee: employeeData.canDeleteEmployee,
        canEditEmployee: employeeData.canEditEmployee,
        canAddPointOfSale: employeeData.canAddPointOfSale,
        canDeletePointOfSale: employeeData.canDeletePointOfSale,
        canEditPointOfSale: employeeData.canEditPointOfSale,
        canAddLoss: employeeData.canAddLoss,
        canDeleteLoss: employeeData.canDeleteLoss,
        canEditLoss: employeeData.canEditLoss,
        canAddOrder: employeeData.canAddOrder,
        canDeleteOrder: employeeData.canDeleteOrder,
        canEditOrder: employeeData.canEditOrder,
        canAddSale: employeeData.canAddSale,
        canDeleteSale: employeeData.canDeleteSale,
        canEditSale: employeeData.canEditSale,
        canAddTransfer: employeeData.canAddTransfer,
        canDeleteTransfer: employeeData.canDeleteTransfer,
        canEditTransfer: employeeData.canEditTransfer,
        canEditProductStock: employeeData.canEditProductStock,
        canEditCommandStatus: employeeData.canEditCommandStatus,
        canConfirmCommand: employeeData.canConfirmCommand,
      };
  
      // Retourner un objet Employee en respectant le type Employee
        const newmployee = {
        idEmployee: employeeData.idEmployee,
        nameEmployee: employeeData.nameEmployee,
        mailEmployee: employeeData.mailEmployee,
        password: employeeData.password, // Vous pouvez choisir de ne pas inclure le mot de passe si ce n'est pas nécessaire
        pointOfSale: employeeData.pointOfSale,
        permissions: permissions, // Attacher l'objet permissions
      };

      listEmployeeFormated.push(newmployee);
    });
    return listEmployeeFormated;
  };
