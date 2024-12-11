
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
                    <Link to="/employee">Employés</Link>
                </li>
                <li>
                    <Link to="/transfers">Transferts</Link>
                </li> 
                <li>
                    <Link to="/productStock">Stock de produit</Link>
                </li>
                <li>
                    <Link to="/sale">Ventes</Link>
                </li>
                <li>
                    <Link to={"/account"}>Compte</Link>
                </li>
                <li>
                    <button onClick={handleLogout}>Se déconnecter</button>
                </li>
            </ul>
        </nav>
    )
}
export default MenuEmployee