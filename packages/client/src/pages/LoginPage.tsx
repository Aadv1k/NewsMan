import Navbar from "../components/Navbar";
import GenericForm from "../components/GenericForm";
import Logo from "../components/Logo";

import { Stack, Box, Typography } from "@mui/material";

export default function LoginPage() {
    return (
        <Box sx={{ maxWidth: "60rem", margin: "0 auto" }}>
            <Stack as="nav" direction="row" justifyContent="space-between" sx={{ padding: ".75rem", margin: "0 auto" }}> <Logo /> </Stack>

            <GenericForm
                title="Login"
                onSubmit={(data: any) => console.log(data)}
                subtitle="Don't have an account? Sign Up"
                linkTo="/signup"
            />

        </Box>
    ) 
}