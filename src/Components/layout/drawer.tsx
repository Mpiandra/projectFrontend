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
import React, {ReactNode, useEffect, useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BadgeEuro, ChartBarStacked, Layers, Move3D, ShoppingBasket, Store, User, Users } from "lucide-react";
import { colors } from "../../Colors";
import { transformToEmployee } from "../../Hooks/useGroupData";
import { Employee } from "../../Hooks/types";

export default function AppDrawer({ children }: { children: ReactNode }) {
    const drawerWidth = 240;

    const [currentEmployee, setCurrentEmployee] = useState<Employee>();

    const storedEmployee = localStorage.getItem("employee");

    useEffect(() => {
        if(storedEmployee){
            console.log("st : ", storedEmployee);
            const parsedEmployee = JSON.parse(storedEmployee)
            console.log("parsedEmployee", parsedEmployee);
            setCurrentEmployee(transformToEmployee(parsedEmployee))
        }
    }, [storedEmployee])

    const navigate = useNavigate();
    const location = useLocation(); // Utilisé pour obtenir l'URL actuelle

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const arrayLink = [
        {
            link: "/categories",
            label: "Categories",
            icon: <ChartBarStacked />,
            shouldShow: true
        },
        {
            link: "/produits",
            label: "Produits",
            icon: <ShoppingBasket />,
            shouldShow: true
        },
        {
            link: "/sale",
            label: "Ventes",
            icon: <BadgeEuro />,
            shouldShow: currentEmployee?.pointOfSale !== null
        },
        {
            link: "/productStock",
            label: "Stock de produit",
            icon: <Layers />,
            shouldShow: true
        },
        {
            link: "/pointOfSale",
            label: "Points de vente",
            icon: <Store />,
            shouldShow: true
        },
        {
            link: "/employee",
            label: "Employés",
            icon: <Users />,
            shouldShow: true
        },
        {
            link: "/transfer",
            label: "Transferts",
            icon: <Move3D />,
            shouldShow: true
        },
        {
            link: "/account",
            label: "Profil",
            icon: <User />,
            shouldShow: true
        }
    ];

    return (
        <>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: colors.primary,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                    },
                }}
            >
                <Toolbar />
                <Divider />
                <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    {arrayLink.map((item) => {
                        if(!item.shouldShow){
                            return null
                        }
                        const isActive = location.pathname === item.link; 
                        return (
                            <ListItem key={item.link} disablePadding>
                                <ListItemButton
                                    onClick={() => navigate(item.link)}
                                    sx={{
                                        backgroundColor: isActive ? colors.background : 'inherit', 
                                        color: isActive ? colors.primary : colors.textDefault, 
                                        '&:hover': {
                                            backgroundColor: colors.neutral, 
                                            color: colors.textDefault,
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ color: isActive ? colors.primary : 'inherit' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
                <Divider />
                <Box sx={{ padding: 2, marginTop: 'auto' }}>
                    <Button
                        onClick={handleLogout}
                        variant="outlined"
                        size="small"
                        endIcon={<LogoutSharp />}
                        sx={{ backgroundColor: colors.background, color: colors.primary }}
                    >
                        Se déconnecter
                    </Button>
                </Box>
            </Drawer>
            <Box marginLeft={`${drawerWidth}px`}>
                {children}
            </Box>
        </>
    );
}
