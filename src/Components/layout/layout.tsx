import React, {ReactNode} from "react";
import AppDrawer from "./drawer.tsx";
import Appbar from "./app-bar.tsx";
import {Box} from "@mui/material";
import {useLocation} from "react-router-dom";

export default function AppLayout({children}:{children:ReactNode}){
    const location = useLocation();

    return(
        <React.Fragment>
            { location.pathname!=="/login" ? (
            <>
                <Appbar/>
                    <AppDrawer>
                        <Box marginTop={10}>
                            {
                                children
                            }
                        </Box>
                    </AppDrawer>
            </>
            )
                :
                (<Box>
                    {

                    children
                }
                </Box>)
            }
        </React.Fragment>
    )
}