import { Button, useDisclosure, ModalHeader, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Modal, Flex, Text } from '@chakra-ui/react';
import React , {useEffect} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalRecoil';
import { auth } from '../../../firebase/clientApp';
import AuthInputs from './AuthInputs';
import OAuthButton from './OAuthButton';
import ResetPassword from './ResetPassword';

const AuthModal: React.FC = () => {

    const [modalState, setModalState] = useRecoilState(authModalState)
    const [user,loading,error] = useAuthState(auth)

    const handleClose = () => {
        setModalState(prev => ({
            ...prev, open: false
        }))
    }

   useEffect(() => {
    if(user) handleClose()
    console.log(user) 
   }, [user])
   

    return (
        <>
            <Modal isOpen={modalState.open} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign='center'>
                        {modalState.view === 'login' && 'Login'}
                        {modalState.view === 'signUp' && 'SignUp'}
                        {modalState.view === 'resetPassword' && 'ResetPassoword'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6} display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                        <Flex direction='column' align='center' justify='center' width='70%'>
                             
                             {modalState.view === 'login' || modalState.view === 'signUp' ? (
                                <>
                                 <OAuthButton/>
                                 <Text color='gray.400' fontWeight={700}>Or</Text>
                                 <AuthInputs/> 
                                </>
                             ) : <ResetPassword/>}
                             
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
export default AuthModal;