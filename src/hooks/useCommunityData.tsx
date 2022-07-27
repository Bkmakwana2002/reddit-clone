import { collection, doc, getDocs, increment, writeBatch } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Community, communityState } from '../atoms/communititesAtom';
import { auth, firestore } from '../firebase/clientApp';
import { CommunitySnippet } from '../atoms/communititesAtom'
import { authModalState } from '../atoms/authModalRecoil';

const useCommunityData = () => {

    const [user] = useAuthState(auth)
    const [communitySateValue, setCommunitySateValue] = useRecoilState(communityState)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const setAuthModalState = useSetRecoilState(authModalState)

    const onJoinOrLeaveCommunity = (communityData: Community, isJoined: boolean) => {
       
       if(!user)
       {
          setAuthModalState({ open:true,view:"login" })
          return;
       }

        if (isJoined) {
            leaveCommunity(communityData.id)
            return;
        }
        joinCommunity(communityData)
    }

    const getMySnippets = async () => {
        setLoading(true)
        try {
            const snippetDocs = await getDocs(collection(firestore, `Users/${user?.uid}/communitySnippets`))

            const snippets = snippetDocs.docs.map(doc => ({ ...doc.data() }))
            setCommunitySateValue(prev => ({
                ...prev,
                mySnippets: snippets as CommunitySnippet[]
            }))
            setLoading(false)
        } catch (error: any) {
            console.log(error)
            setError(error.message)
        }
    }

    const joinCommunity = async(communityData: Community) => {
        setLoading(true)
        try {
            const batch = writeBatch(firestore)

            const newSnippet: CommunitySnippet = {
                communityId: communityData.id,
                imageURL: communityData.imageUrl || '',
            }
            batch.set(doc(firestore, `Users/${user?.uid}/communitySnippets`, communityData.id),
                newSnippet)

            batch.update(doc(firestore,'communities',communityData.id),{
                numberOfmembers : increment(1)
            })

           await  batch.commit()

           setCommunitySateValue(prev=>({
            ...prev,
            mySnippets : [...prev.mySnippets,newSnippet]
           }))
        } catch (error: any) {
            console.log("joining community error", error)
            setError(error.message)
            setLoading(false)
        }
        setLoading(false)
    }

    const leaveCommunity = async (communityId: string) => {
        setLoading(true) 
        try {
            
            const batch = writeBatch(firestore)
            batch.delete(
                doc(firestore,`Users/${user?.uid}/communitySnippets`,communityId)
            )

            batch.update(doc(firestore,'communities',communityId),{
                numberOfmembers : increment(-1)
            })

            await batch.commit()

            setCommunitySateValue(prev=>({
                ...prev,
                mySnippets:prev.mySnippets.filter(item=>item.communityId !== communityId)
            }))
            setLoading(false)

         } catch (error:any) {
            console.log("leaving community error", error)
            setError(error.message)
            setLoading(false)
         }
         setLoading(false)
    }

    useEffect(() => {
        if (!user) {
            setCommunitySateValue(prev=>({
                ...prev,
                mySnippets:[]
            }))
            return;
        }
        getMySnippets()
    }, [user])


    return {
        communitySateValue,
        onJoinOrLeaveCommunity,
        loading
    }
}
export default useCommunityData;