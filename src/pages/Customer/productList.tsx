import MenuCustomer from "../../Components/Customer/menuCustomer.tsx";

const ProductList : React.FC = () => {
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try{
    //             const response = await axiosInstance.get("/products");
    //             console.log(response.data);
    //         } catch (error){
    //             console.error(error)
    //         }
    //     }
    //     fetchData();
    // }, [])
    return (
        <div>
            <MenuCustomer />
        </div>
    )
}

export default ProductList;