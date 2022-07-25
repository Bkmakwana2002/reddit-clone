import { Button, Flex, Image, Text } from '@chakra-ui/react'
import { User } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth, firestore } from '../../../firebase/clientApp'

const OAuthButton:React.FC = () => {

    const [signInWithGoogle, userCred, loading, error] = useSignInWithGoogle(auth)

    const createUserDocument = async(user:User)=>{
        const userDocRef = doc(firestore,'Users',user.uid)
        await setDoc(userDocRef,JSON.parse(JSON.stringify(user)))    
    }

    useEffect(() => {
        if(userCred)
        {
          createUserDocument(userCred.user)
        }
      }, [userCred])
    
    return (
        <Flex>
            <Button variant='oauth' mb={2} isLoading={loading} onClick={()=>signInWithGoogle()}> 
                <Image mr={2} src='/images/googlelogo.png' height='20px'/>
                Continue with Google
            </Button>
            {error && <Text>
                {error.message}
            </Text>}
        </Flex>
    )
}
export default OAuthButton;