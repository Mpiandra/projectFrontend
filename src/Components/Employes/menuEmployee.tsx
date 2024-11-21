import {Link, useNavigate} from "react-router-dom";

const MenuEmployee : React.FC = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }



    return (
        <nav>
            <ul>
                <li>
                    <Link to="/employeeHome">Produits</Link>
                </li>
                <li>
                    <Link to="/categoryList">Categories</Link>
                </li>
                <li>
                    <Link to="/pointOfSale">Points de vente</Link>
                </li>
                <li>
                    <Link to="/action">Actions</Link>
                </li>
                <li>
                    <button onClick={handleLogout}>Se déconnecter</button>
                </li>
            </ul>
        </nav>
    )
}
export default MenuEmployee