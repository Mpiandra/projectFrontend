import {
    Box,
    Button,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar
} from "@mui/material";
import {LogoutSharp} from "@mui/icons-material";
import React, {ReactNode} from "react";
import { useNavigate } from "react-router-dom";
import { BadgeEuro, ChartBarStacked, Layers, Move3D, ShoppingBasket, Store, Users } from "lucide-react";
import { colors } from "../../Colors";

export default function AppDrawer({children}:{children:ReactNode}){
    const drawerWidth =240

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }
    const arrayLink = [
        {
            link: "/categories",
            label: "Categories",
            icon: <ChartBarStacked />
        },
        {
            link: "/produits",
            label: "Produits",
            icon: <ShoppingBasket />
        },
        {
            link: "/sale",
            label: "Ventes",
            icon: <BadgeEuro />
        },
        {
            link: "/productStock",
            label: "Stock de produit",
            icon: <Layers />
        },
        {
            link: "/pointOfSale",
            label: "Points de vente",
            icon: <Store />
        },
        {
            link: "/employee",
            label: "Employés",
            icon: <Users />
        },
        {
            link: "/transfer",
            label: "Transferts",
            icon: <Move3D />
        },
        
    ];

    


    return (
        <>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor: colors.primary },
                    
                }} >

                <Box sx={{ flex: 1, display: "flex", flexDirection: "column"}}>
                    <Toolbar/>
                    <Divider sx={{mt:1}}/>
                    <List sx={{height: "90vh",
                                overflowY: "auto"
                    }}>
                        {arrayLink.map((item) => {
                            return (
                                <ListItem key={item.link}>

                                    <ListItemButton slot="link" to={item.link}>
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.label} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        })}
                    </List>
                    <Divider />
                    <List sx={{display:"flex",height:"10vh", alignItems:"flex-end"}}>
                        <ListItem>
                            <Button onClick={handleLogout} variant="outlined" size="small" endIcon={<LogoutSharp/>} sx={{backgroundColor: colors.neutral, color: colors.secondary}}>
                                Se déconnecter
                            </Button>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Box marginLeft={`${drawerWidth}px` }>
                {
                    children
                }
            </Box>
        </>
    )
}