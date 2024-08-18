'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import getStripe from "@/utils/get-stripe"
import { useSearchParams } from "next/navigation"
import { CircularProgress, Typography, Container, Box, Link } from "@mui/material"
import Header from '../header'
import {useUser, isSignedIn} from '@clerk/nextjs'

export default function ResultPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')

    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)
    const [subscribed,setSubscribed] = useState(false)

    const user = useUser()

    const updateUser = async (subscription) => {
        await user.update({
          subscription: subscription
        })
      }

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) return
            
            try {
                const res = await fetch(`/api/checkout_session?session_id=${session_id}`)
                const sessionData = await res.json()
                if (res.ok) {
                    setSession(sessionData)
                } else {
                    setError(sessionData.error)
                }
            } catch (err) {
                setError("An error occurred while retrieveing the session.")
            } finally {
                setLoading(false)
            }
        }
        fetchCheckoutSession()
    }, [session_id])

    if (loading) {
        return (
            <Container maxWidth="100vw" sx={{textAlign: "center", mt:4}}>
                <CircularProgress />
                <Typography variant="h6">
                    Loading...
                </Typography>
            </Container>
        )
    }

    if (error) {
        return (
            <Container maxWidth="100vw" sx={{textAlign: "center", mt:4}}>
                <Typography variant="h6">
                    {error}
                </Typography>                
            </Container>
        )
    }

    return (
        <Container maxWidth="100vw" style={{background:"lightblue"}}>
            <Header/>
            <Box sx={{textAlign: "center", mt:4}}>
            {
                session.payment_status === 'paid' ? (
                    <>
                        <Typography variant="h4">
                            Thank you for your purchase.
                        </Typography>
                        <Box sx={{mt:22}}>
                            <Typography variant="h6">Session ID: {session_id}</Typography>
                            <Typography variant="body1">
                                We have received your payment. You will receive an email with the order details shortly.
                            </Typography>
                            <Typography variant="h3">
                                {/* TODO: save users subscription status to Clerk */}
                                {/* {updateUser('subscribed')} */}
                                <Link href="/generate">Go and generate Flashcards.</Link>
                            </Typography>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="h4">
                            Payment Failed
                        </Typography>
                        <Box sx={{mt:22}}>
                            <Typography variant="body1">
                                {/* TODO: how to scroll to Pricing, #pricingRef does not work */}
                                Your payment was not successful. <Link href="/">Please try again.</Link>
                            </Typography>
                        </Box>                    
                    </>
            )
            }
            </Box>
        </Container>
    )
}