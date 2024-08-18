import Head from "next/head"
import {AppBar, Toolbar, Box, Typography, Button, Link} from '@mui/material'
import { SignedIn,SignedOut, UserButton, UserProfile } from "@clerk/nextjs"

export default function Header() {
    return (
        <Box>
            <Head>
            <title>Flashcard GenAI</title>
            <meta name="description" content="Create flashcards from your text." />
            </Head>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{flexGrow: 1}} >
                        <Link href="/" color='#ffffff' underline='none'>
                            Flashcard GenAI
                        </Link>
                    </Typography>
                    <SignedOut>
                        <Button color="inherit" href="/sign-in">Sign In</Button>
                        <Button color="inherit" href="/sign-up">Sign Up</Button>
                    </SignedOut>
                    <SignedIn>
                        <UserButton/>
                    </SignedIn>
                </Toolbar>
            </AppBar>
        </Box>
    )
}