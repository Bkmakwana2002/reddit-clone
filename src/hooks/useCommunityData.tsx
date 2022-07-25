import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';
import { Community, communityState } from '../atoms/communititesAtom';
import { auth, firestore } from '../firebase/clientApp';
import {CommunitySnippet} from '../atoms/communititesAtom'

const useCommunityData = () => {

    const [user] = useAuthState(auth)
    const [communitySateValue, setCommunitySateValue] = useRecoilState(communityState)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const onJoinOrLeaveCommunity = (communityData: Community, isJoined: boolean) => {


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
            setCommunitySateValue(prev=>({
                ...prev,
                mySnippets:snippets as CommunitySnippet[]
            }))

        } catch (error) {
            console.log(error)
        }
    }

    const joinCommunity = (communityData: Community) => {

    }

    const leaveCommunity = (communityId: string) => {

    }

    useEffect(() => {
        if (!user) return;
        getMySnippets()
    }, [user])


    return {
        communitySateValue,
        onJoinOrLeaveCommunity
    }
}
export default useCommunityData;