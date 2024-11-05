import {Link} from "react-router-dom";

const MenuCustomer : React.FC = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Produits</Link>
                </li>
                <li>
                    <Link to="/login">Se connecter</Link>
                </li>
            </ul>
        </nav>
    )
}

export default MenuCustomer