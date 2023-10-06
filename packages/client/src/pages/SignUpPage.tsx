import Navbar from "../components/Navbar";
import GenericForm from "../components/GenericForm";
import Logo from "../components/Logo";

import { Stack, Box, Typography } from "@mui/material";

export default function SignUpPage() {
    return (
        <Box sx={{ maxWidth: "60rem", margin: "0 auto" }}>
            <Stack as="nav" direction="row" justifyContent="space-between" sx={{ padding: ".75rem", margin: "0 auto" }}> <Logo /> </Stack>

            <GenericForm
                title="Sign Up"
                onSubmit={(data: any) => console.log(data)}
                subtitle="Already have an account? Login"
                linkTo="/login"
            />

        </Box>
    ) 
}
