'use client'

import Image from "next/image"
import getStripe from '@/utils/get-stripe'
import { SignedIn,SignedOut, UserButton, UserProfile } from "@clerk/nextjs"
import { Link, AppBar, Toolbar, Typography, Container, Button, Box, Grid, CardContent, Card, CardActionArea } from "@mui/material";

import { useState, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation";
import Header from "./header"

export default function Home() {
    const {isLoaded,isSignedIn,user} = useUser()
    const router = useRouter()
    const [subscribed,setSubscribed] = useState(false)

    const str=`
      [
        {
          "id": 1,
          "color": "pink",
          "front": "Easy text input",
          "back": "Simply input your text and let our software do the rest. Creating flashcards has never been easier."
        },
        {
          "id": 2,
          "color": "lightgrey",          
          "front": "Smart flashcards",
          "back": "Our AI intelligently breaks down your text into concise flashcards, perfect for studying."
        },
        {
          "id": 3,
          "color": "lightgreen",          
          "front": "Accessible anywhere",
          "back": "Access your flashcards from any device, at any time. Study on the go with ease."
        }              
      ]
      `

  const [flashcards,setFlashcards] = useState(JSON.parse(str))
  const [flipped,setFlipped] = useState([])

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
        ...prev,
        [id]: !prev[id]
    }))
}



  const handleSubmit = async (amount) => {
    if (!user) {
      router.push(`/sign-in`)  
    } else {
      const checkoutSession = await fetch('/api/checkout_session',{
        method: "POST",
        headers: {
          origin: 'http://localhost:3000',
          amount: amount,
        },
      })

      const checkoutSessionJson = await checkoutSession.json()

      if (checkoutSession.statusCode === 500) {
        console.error(checkoutSession.message)
        return
      }

      const stripe = await getStripe()
      const {error} = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      })

      if (error) {
        console.warn(error.message)
      }
    }
  }

  const pricingRef=useRef()
  const executeScroll = () => {
    if (user && subscribed) {
      router.push('/generate')
    } else {
      pricingRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }
  


  return (
      <Container maxWidth="100vw" style={{background:"lightblue"}}>
        <Header/>
        {/* <Head>
          <title>Flashcard GenAI</title>
          <meta name="description" content="Create flashcards from your text." />
        </Head>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{flexGrow: 1}}>Flashcard GenAI</Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in">Sign In</Button>
              <Button color="inherit" href="/sign-up">Sign Up</Button>
            </SignedOut>
            <SignedIn>
              <UserButton/>
            </SignedIn>
          </Toolbar>
        </AppBar> */}
        <Box sx={{textAlign:"center", my:4}}>
          <Typography variant="h2">
            Welcome to Flashcard GenAI
          </Typography>
          <Typography variant="h5">
            The easiest way to make flashcards from your text with the help of AI.
          </Typography>
          <Button variant="contained" color="primary" sx={{mt:2}} onClick={executeScroll}>
            Get Started
          </Button>
        </Box>
        <Box sx={{my:6}}>
          <Typography variant="h4" textAlign={'center'}>
            Features
          </Typography>

          <Grid container spacing={3} sx={{mt:1}}>
            {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea 
                                    onClick={() => handleCardClick(index)}
                                >
                                    <CardContent>
                                        <Box
                                            sx={{backgroundColor:flashcard.color,
                                                perspective: '1000px',
                                                '& > div':{
                                                    transition: 'transform 0.6s',
                                                    transformStyle: 'preserve-3d',
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '200px',
                                                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                                    transform: flipped[index]?'rotateY(180deg)':'rotateY(0deg)',
                                                },
                                                '& > div > div':{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: 2,
                                                    boxSizing: 'border-box',
                                                },
                                                '& > div > div:nth-of-type(2)':{
                                                    transform: 'rotateY(180deg)',
                                                }                                                                                                   
                                            }}
                                        >
                                            <div>
                                                <div>
                                                    <Typography variant='h5' component='div'>
                                                        {flashcard.front}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant='h5' component='div'>
                                                        {flashcard.back}
                                                    </Typography>
                                                </div>                                                
                                            </div>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
            </Grid>

          {/* <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Easy text input
              </Typography>
              <Typography>Simply input your text and let our software do the rest. Creating flashcards has never been easier.</Typography>
            </Grid>            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Smart flashcards
              </Typography>
              <Typography>Our AI intelligently breaks down your text into concise flashcards, perfect for studying.</Typography>
            </Grid>            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Accessible anywhere
              </Typography>
              <Typography>Access your flashcards from any device, at any time. Study on the go with ease.</Typography>
            </Grid>
          </Grid> */}
        </Box>
        <Box sx={{my:6, textAlign:'center'}}>
          <Typography variant="h4" gutterBottom ref={pricingRef}>
            Pricing
          </Typography>
          <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box 
              sx={{
                p:3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                backgroundColor: 'red',
                color: 'white'
              }}>
              <Typography variant="h5" gutterBottom>Trial</Typography>
              <Typography variant="h6" gutterBottom>Free for a month</Typography>
              <Typography>Try it out before purchasing. All features included for 30 days.</Typography>
              <Button variant="contained" color="primary" sx={{mt:2}} onClick={()=>handleSubmit(0)}>
                Choose Trial
              </Button>
              </Box>
            </Grid>               
          <Grid item xs={12} md={4}>
            <Box 
              sx={{
                p:3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                backgroundColor: 'orange',
                color: 'white'
              }}>
              <Typography variant="h5" gutterBottom>Basic</Typography>
              <Typography variant="h6" gutterBottom>$5 / month</Typography>
              <Typography>Access to basic flashcard features and limited storage.</Typography>
              <Button variant="contained" color="primary" sx={{mt:2}} onClick={()=>handleSubmit(5)}>
                Choose Basic
              </Button>
              </Box>
            </Grid>            
            <Grid item xs={12} md={4}>
            <Box 
              sx={{
                p:3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                backgroundColor: 'green',
                color: 'white'
              }}>
              <Typography variant="h5" gutterBottom>Pro</Typography>
              <Typography variant="h6" gutterBottom>$10 / month</Typography>
              <Typography>Unlimited flashcards and storage, with priority support.</Typography>
              <Button variant="contained" color="primary" sx={{mt:2}} onClick={()=>handleSubmit(10)}>
                Choose Pro
              </Button>
              </Box>
            </Grid>            
          </Grid>
        </Box>
        <Typography variant="h5" textAlign="center">Designers wanted!&#128513; Apply <Link href="https://robertkiss.online/#contact" target="_blank">HERE</Link>.</Typography>
      </Container>
    )
}
