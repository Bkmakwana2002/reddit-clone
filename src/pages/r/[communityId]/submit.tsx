import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import About from '../../../components/community/About';
import PageContext from '../../../components/Layout/PageContext';
import NewPostForm from '../../../components/Posts/NewPostForm';
import { auth } from '../../../firebase/clientApp';
import useCommunityData from '../../../hooks/useCommunityData';


const submitPostPage:React.FC = () => {

    const [user] = useAuthState(auth)
    const { communitySateValue } = useCommunityData()
    console.log("community",communitySateValue)
    
    return (
        <PageContext>
            <>
              <Box p='14px 0px' borderBottom='1px solid' borderColor='white'>
                <Text>Create a Post</Text>
                {user && <NewPostForm user={user}/>}
              </Box> 
            </>
            <>
              { communitySateValue.currentCommunity && <About communityData={ communitySateValue.currentCommunity } />}
            </>
        </PageContext>
    )
}
export default submitPostPage;