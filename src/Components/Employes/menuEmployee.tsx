import {useNavigate} from "react-router-dom";
import React from "react";
import {Toolbar, Divider, List, ListItem, ListItemButton, Button, ListItemText} from "@mui/material";

import { LogoutSharp } from "@mui/icons-material";

const MenuEmployee: React.FC = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

    const arrayLink = [
        {
            link: "/employeeHome",
            label: "Produits"
        },
        {
            link: "/categoryList",
            label: "Categories"
        },
        {
            link: "/pointOfSale",
            label: "Points de vente"
        },
        {
            link: "/employee",
            label: "Employés"
        }
    ];


    return (
        <>
            <Toolbar/>
            <Divider/>
            <List>
                {arrayLink.map((item) => {
                    return (
                        <ListItem key={item.link}>
                            <ListItemButton slot="link" to={item.link}>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>
            <Divider />
            <List>
                <ListItem>
                    <Button onClick={handleLogout} variant="outlined" endIcon={<LogoutSharp/>}>
                        Se déconnecter
                    </Button>
                </ListItem>
            </List>
        </>
    )
}
export default MenuEmployee