import { SignIn } from "@clerk/nextjs"
import { Container, Toolbar, AppBar, Typography, Button, Box, Link } from "@mui/material"
import Header from '../../header'

export default function SignInPage() {
    return (
    <Container maxWidth="100vw" style={{background:"lightblue"}}>
        <Header/>
        {/* <AppBar position="static" sx={{backgroundColor:'#3f51b5'}}>
            <Toolbar>
                <Typography variant="h6" sx={{flexGrow: 1}}>
                    Flashcard GenAI
                </Typography>
                <Button color="inherit">
                    <Link href='/sign-in' passHref>
                        Sign In
                    </Link>
                </Button>
                <Button color="inherit">
                    <Link href='/sign-up' passHref>
                        Sign Up
                    </Link>
                </Button>
            </Toolbar>
        </AppBar> */}
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Typography variant="h4">
                Sign In
            </Typography>
            <SignIn/>
        </Box>
    </Container>
    )
}