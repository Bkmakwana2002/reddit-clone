import React, { useEffect, useState } from 'react'
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalRecoil';
import { auth, firestore } from '../../../firebase/clientApp';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { FIREBASE_ERRORS } from '../../../firebase/error'
import { FirebaseError } from 'firebase/app';
import { User } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';

const SignUp:React.FC = () => {
    
    const setAuthModalState = useSetRecoilState(authModalState)
    const [signUpForm, setSignUpForm] = useState({
        email: '',
        password: '',
        confirmPassword : ''
    })
    const [error, setError] = useState('')
    const [
        createUserWithEmailAndPassword,
        userCred,
        loading,
        userError,
      ] = useCreateUserWithEmailAndPassword(auth);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSignUpForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if(error) setError(``)
        if(signUpForm.password !== signUpForm.confirmPassword )
        {
            setError('password do not match')
            console.log(signUpForm.password,signUpForm.confirmPassword)
            return;
        }
        createUserWithEmailAndPassword(signUpForm.email,signUpForm.password)
    }

    const createUserDocument = async(user:User)=>{
       await addDoc(collection(firestore,'Users'),JSON.parse(JSON.stringify(user)))
    }

    useEffect(() => {
      if(userCred)
      {
        createUserDocument(userCred.user)
      }
    }, [userCred])
    


    return (
        <form onSubmit={onSubmit}>
            <Input bg='gray.50' _focus={{ outline: 'none', bg: 'white', border: '1px solid', borderColor: 'blue.500', }} _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }} _placeholder={{ color: 'gray.500' }} fontSize='10pt' required name='email' placeholder="email" type='email' mb={2} onChange={onChange} />

            <Input bg='gray.50' _focus={{ outline: 'none', bg: 'white', border: '1px solid', borderColor: 'blue.500', }} _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }} _placeholder={{ color: 'gray.500' }} fontSize='10pt' required name='password' placeholder="password" type='password' mb={2} onChange={onChange} />
            <Input bg='gray.50' _focus={{ outline: 'none', bg: 'white', border: '1px solid', borderColor: 'blue.500', }} _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }} _placeholder={{ color: 'gray.500' }} fontSize='10pt' required name='confirmPassword' placeholder="confirm password" type='password' mb={2} onChange={onChange} />
            
            {error || userError && (<Text textAlign='center' color='red' fontSize='10pt'>{error || FIREBASE_ERRORS[userError.message as keyof typeof FIREBASE_ERRORS]}</Text>)}
            <Button width='100%' height='36px' mt='2' mb='2' type='submit' isLoading={loading} >SignUp</Button>
    
            <Flex fontSize='9pt' justifyContent='center'>
               <Text mr={2}>Already a Redditor</Text>
               <Text color='blue.500' fontWeight={700} cursor='pointer' onClick={()=>setAuthModalState((prev)=>({
                ...prev,
                view: 'login'
               }))}
               >Login</Text>
            </Flex>
        </form>
    )
}
export default SignUp;