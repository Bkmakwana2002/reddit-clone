import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useState } from "react"
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalRecoil";
import { auth } from '../../../firebase/clientApp'
import { FIREBASE_ERRORS } from "../../../firebase/error";

type LoginProps = {

};

const Login: React.FC<LoginProps> = () => {

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);

    const setAuthModalState = useSetRecoilState(authModalState)
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    })

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        signInWithEmailAndPassword(loginForm.email, loginForm.password)
    }


    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    return (
        <form onSubmit={onSubmit}>
            <Input bg='gray.50' _focus={{ outline: 'none', bg: 'white', border: '1px solid', borderColor: 'blue.500', }} _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }} _placeholder={{ color: 'gray.500' }} fontSize='10pt' required name='email' placeholder="email" type='email' mb={2} onChange={onChange} />

            <Input bg='gray.50' _focus={{ outline: 'none', bg: 'white', border: '1px solid', borderColor: 'blue.500', }} _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }} _placeholder={{ color: 'gray.500' }} fontSize='10pt' required name='password' placeholder="password" type='password' mb={2} onChange={onChange} />
            <Text textAlign='center' color='red' fontSize='10pt'>{FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}</Text>
            <Button isLoading={loading} width='100%' height='36px' mt='2' mb='2' type='submit'>Login</Button>

            <Flex justifyContent="center" mb={2}>
                <Text fontSize="9pt" mr={1}>
                    Forgot your password?
                </Text>
                <Text
                    fontSize="9pt"
                    color="blue.500"
                    cursor="pointer"
                    onClick={() => setAuthModalState(prev => ({
                        ...prev,
                        view: 'resetPassword'
                    }))}
                >
                    Reset
                </Text>
            </Flex>

            <Flex fontSize='9pt' justifyContent='center'>
                <Text mr={2}>New Here</Text>
                <Text color='blue.500' fontWeight={700} cursor='pointer' onClick={() => setAuthModalState(prev => ({
                    ...prev,
                    view: 'signUp'
                }))}
                >SIGN UP</Text>
            </Flex>
        </form>
    )
}
export default Login;