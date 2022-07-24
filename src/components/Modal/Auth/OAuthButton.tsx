import { Button, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth } from '../../../firebase/clientApp'

const OAuthButton:React.FC = () => {

    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
    
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