import { AllDataProps, AllProductData, CategoryJoinProductType, CategoryWithStock, Employee, Permissions, ProductTypeJoinCategory, SaleGetted, SaleRowGetted, StockProductDTO, TransferData, TransferGetted } from "./types";

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

  export function groupStockProducts(data: StockProductDTO[]): CategoryWithStock[] {
    const groupedData: CategoryWithStock[] = [];
  
    data.forEach((item) => {
      // Find or create the category group
      let category = groupedData.find((cat) => cat.idCategory === item.idCategory);
      if (!category) {
        category = {
          idCategory: item.idCategory,
          categoryName: item.categoryName,
          productTypes: [],
        };
        groupedData.push(category);
      }
  
      // Find or create the product type group within the category
      let productType = category.productTypes.find((type) => type.idProductType === item.idProductType);
      if (!productType) {
        productType = {
          idProductType: item.idProductType,
          productTypeName: item.productTypeName,
          products: [],
        };
        category.productTypes.push(productType);
      }
  
      // Add the product to the product type
      productType.products.push({
        idStock: item.idStock,
        idProduct: item.idProduct,
        productName: item.productName,
        price: item.price,
        imageUrl: item.imageUrl,
        quantityStock: item.quantityStock,
      });
    });
  
    return groupedData;
  }

  export function transformTransferData(data: TransferData[]): TransferGetted[] {
    const transferMap: { [key: number]: TransferGetted } = {};
  
    // Parcours de chaque élément de TransferData
    data.forEach(item => {
      // Si l'ID du transfert n'existe pas encore dans le map, on crée une nouvelle entrée
      if (!transferMap[item.idTransfer]) {
        transferMap[item.idTransfer] = {
          idTransfer: item.idTransfer,
          transferDate: item.transferDate,
          transferStatus: item.transferStatus,
          pointOfSaleSource: item.pointOfSaleSourceId
            ? { idPointOfSale: item.pointOfSaleSourceId, pointOfSaleName: "", address: "" } // Remplacez par de vrais détails si nécessaires
            : undefined,
          pointOfSaleDestination: { idPointOfSale: item.pointOfSaleDestionationId, pointOfSaleName: item.pointOfSaleName, address: item.address },
          transferRows: []
        };
      }
  
      // Ajouter la ligne de transfert avec le produit dans l'objet Transfer
      transferMap[item.idTransfer].transferRows.push({
        idTransferRow: item.idTransferRow,
        quantityProductTransfer: item.quantityProductTransfer,
        product: {
          idProduct: item.idProduct,
          productName: item.productName,
          price: item.price,
          imageUrl: "", // Vous pouvez ajouter l'URL de l'image si elle est disponible
          attributes: [] // Ajoutez des attributs si nécessaires, sinon laissez vide
        }
      });
    });
  
    // Retourner la liste des transferts
    return Object.values(transferMap);
  }

  export function formatDate(dateString: string): string {
    const date = new Date(dateString);
  
    const day = String(date.getDate()).padStart(2, '0'); // Ajoute un '0' si nécessaire
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois vont de 0 à 11
    const year = date.getFullYear();
  
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  export function transformToEmployee(data: any): Employee {
    
      const permissions: Permissions = {
        canAddCategory: data.canAddCategory,
        canDeleteCategory: data.canDeleteCategory,
        canEditCategory: data.canEditCategory,
        canAddAppConfiguration: data.canAddAppConfiguration,
        canEditAppConfiguration: data.canEditAppConfiguration,
        canAddProduct: data.canAddProduct,
        canDeleteProduct: data.canDeleteProduct,
        canEditProduct: data.canEditProduct,
        canAddProductType: data.canAddProductType,
        canDeleteProductType: data.canDeleteProductType,
        canAddEmployee: data.canAddEmployee,
        canDeleteEmployee: data.canDeleteEmployee,
        canEditEmployee: data.canEditEmployee,
        canAddPointOfSale: data.canAddPointOfSale,
        canDeletePointOfSale: data.canDeletePointOfSale,
        canEditPointOfSale: data.canEditPointOfSale,
        canAddLoss: data.canAddLoss,
        canDeleteLoss: data.canDeleteLoss,
        canEditLoss: data.canEditLoss,
        canAddOrder: data.canAddOrder,
        canDeleteOrder: data.canDeleteOrder,
        canEditOrder: data.canEditOrder,
        canAddSale: data.canAddSale,
        canDeleteSale: data.canDeleteSale,
        canEditSale: data.canEditSale,
        canAddTransfer: data.canAddTransfer,
        canDeleteTransfer: data.canDeleteTransfer,
        canEditTransfer: data.canEditTransfer,
        canEditProductStock: data.canEditProductStock,
        canEditCommandStatus: data.canEditCommandStatus,
        canConfirmCommand: data.canConfirmCommand,
      };
  
      // Retourner un objet Employee en respectant le type Employee
        const newmployee = {
        idEmployee: data.idEmployee,
        nameEmployee: data.nameEmployee,
        mailEmployee: data.mailEmployee,
        password: data.password, // Vous pouvez choisir de ne pas inclure le mot de passe si ce n'est pas nécessaire
        pointOfSale: data.pointOfSale,
        permissions: permissions, // Attacher l'objet permissions
      };

      return newmployee;

    
  };

  export function transformToSaleGetted(data: any[]): SaleGetted[] {
    const salesMap: { [idSale: number]: SaleGetted } = {};

    data.forEach((item) => {
        const {
            idSale,
            idPointOfSale,
            saleDate,
            totalPrice,
            idSaleRow,
            idProduct,
            imageUrl,
            price,
            priceSale,
            productName,
            quantitySale,
        } = item;

        if (!salesMap[idSale]) {
            salesMap[idSale] = {
                idSale,
                idPointOfSale,
                saleDate: new Date(saleDate).getTime(), // Convertir la date en timestamp
                totalPrice,
                saleRows: [],
            };
        }

        const saleRow: SaleRowGetted = {
            idSaleRow,
            idProduct,
            imageUrl,
            price,
            priceSale,
            productName,
            quantitySale,
        };

        salesMap[idSale].saleRows.push(saleRow);
    });

    return Object.values(salesMap);
}