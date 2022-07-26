import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import PageContext from '../../../components/Layout/PageContext';
import NewPostForm from '../../../components/Posts/NewPostForm';
import { auth } from '../../../firebase/clientApp';


const submitPostPage:React.FC = () => {

    const [user] = useAuthState(auth)
    
    return (
        <PageContext>
            <>
              <Box p='14px 0px' borderBottom='1px solid' borderColor='white'>
                <Text>Create a Post</Text>
                {user && <NewPostForm user={user}/>}
              </Box> 
            </>
            <>

            </>
        </PageContext>
    )
}
export default submitPostPage;